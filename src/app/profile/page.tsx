"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { withCsrfHeaders } from "@/lib/security/csrf";

interface Profile {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  github_username: string | null;
  created_at: string;
}

interface UserReview {
  id: string;
  target_type: string;
  target_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface UserStack {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  item_count: number;
  created_at: string;
}

export default function MyProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [stacks, setStacks] = useState<UserStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/profile/reviews").then((r) => r.json()),
      fetch("/api/profile/stacks").then((r) => r.json()),
    ])
      .then(([profileData, reviewsData, stacksData]) => {
        if (profileData.profile) {
          setProfile(profileData.profile);
          setBio(profileData.profile.bio || "");
          setDisplayName(profileData.profile.display_name || "");
        }
        setReviews(reviewsData.reviews || []);
        setStacks(stacksData.stacks || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: withCsrfHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ display_name: displayName, bio }),
    });
    if (res.ok) {
      const data = await res.json();
      setProfile(data.profile);
      setEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-text-muted">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-20 text-center">
        <p className="mb-4 text-text-secondary">
          Sign in with GitHub to view your profile.
        </p>
        <Link
          href="/"
          className="text-sm text-accent-violet no-underline hover:underline"
        >
          Go to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1
        className="font-display mb-6 text-2xl font-bold text-text-primary"
      >
        My Profile
      </h1>

      {/* Profile Card */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              width={64}
              height={64}
              className="rounded-full border border-border"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-purple/20 text-2xl text-accent-violet">
              {(profile.display_name || profile.username)[0]?.toUpperCase()}
            </div>
          )}

          <div className="flex-1">
            {editing ? (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display name"
                  className="rounded-lg border border-border bg-void px-3 py-1.5 text-sm text-text-primary"
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={2}
                  className="resize-none rounded-lg border border-border bg-void px-3 py-1.5 text-sm text-text-primary"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="rounded-lg bg-accent-purple/20 px-4 py-1.5 text-xs font-semibold text-accent-violet hover:bg-accent-purple/30"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="rounded-lg border border-border px-4 py-1.5 text-xs text-text-secondary hover:text-text-primary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-text-primary">
                    {profile.display_name || profile.username}
                  </span>
                  <span className="text-sm text-text-muted">
                    @{profile.username}
                  </span>
                </div>
                {profile.bio && (
                  <p className="mt-1 text-sm text-text-secondary">
                    {profile.bio}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-4 text-xs text-text-muted">
                  <span>
                    Joined{" "}
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                  {profile.github_username && (
                    <span>GitHub: {profile.github_username}</span>
                  )}
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="mt-3 rounded-lg border border-border px-3 py-1 text-xs text-text-secondary hover:border-border-hover hover:text-text-primary"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-text-primary">
            {reviews.length}
          </div>
          <div className="text-xs text-text-muted">Reviews</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-text-primary">
            {stacks.length}
          </div>
          <div className="text-xs text-text-muted">Stacks</div>
        </div>
      </div>

      {/* My Stacks */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            My Stacks
          </h2>
          <Link
            href="/stacks"
            className="text-xs text-accent-violet no-underline hover:underline"
          >
            View all stacks
          </Link>
        </div>
        {stacks.length === 0 ? (
          <p className="text-xs text-text-muted">
            No stacks yet. Create one from the{" "}
            <Link
              href="/stacks"
              className="text-accent-violet no-underline hover:underline"
            >
              Stacks page
            </Link>
            .
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {stacks.map((stack) => (
              <Link
                key={stack.id}
                href={`/stacks/${stack.id}`}
                className="rounded-xl border border-border bg-card p-4 no-underline transition-colors hover:border-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-primary">
                    {stack.name}
                  </span>
                  <span className="text-xs text-text-muted">
                    {stack.item_count} items
                  </span>
                </div>
                {stack.description && (
                  <p className="mt-1 text-xs text-text-secondary">
                    {stack.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Reviews */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
          Recent Reviews
        </h2>
        {reviews.length === 0 ? (
          <p className="text-xs text-text-muted">No reviews yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {reviews.slice(0, 5).map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-border bg-card px-4 py-3"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    {review.target_type}/{review.target_id}
                  </span>
                  <span className="text-xs text-[#fbbf24]">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-[13px] text-text-secondary">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
