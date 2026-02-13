import { NextRequest, NextResponse } from "next/server";
import {
  getSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  processApprovedSubmission,
} from "@/lib/data/submissions";
import { sendEmail } from "@/lib/email/client";
import { submissionApproved, submissionRejected } from "@/lib/email/templates";

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status") || "pending";
  const submissions = await getSubmissions(status);

  return NextResponse.json({ submissions, count: submissions.length });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected"].includes(body.status)) {
      return NextResponse.json(
        { error: "status must be approved or rejected" },
        { status: 400 }
      );
    }

    // Fetch submission before updating to get details for post-processing
    const submission = await getSubmissionById(body.id);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const result = await updateSubmissionStatus(body.id, body.status);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Post-processing
    if (body.status === "approved") {
      // Insert data into the appropriate table
      const processResult = await processApprovedSubmission(submission);
      if (!processResult.success) {
        console.error(`[Admin] Failed to process approved submission ${body.id}:`, processResult.error);
      }

      // Notify submitter
      if (submission.submitted_by) {
        const { subject, html } = submissionApproved(submission.name, submission.type);
        sendEmail({ to: submission.submitted_by, subject, html }).catch(() => {});
      }
    } else if (body.status === "rejected") {
      // Notify submitter with optional reason
      if (submission.submitted_by) {
        const { subject, html } = submissionRejected(
          submission.name,
          submission.type,
          body.reason
        );
        sendEmail({ to: submission.submitted_by, subject, html }).catch(() => {});
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
