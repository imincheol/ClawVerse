import type { Metadata } from "next";
import Image from "next/image";

interface Profile {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  github_username: string | null;
  created_at: string;
}

interface PublicReview {
  id: string;
  target_type: string;
  target_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface PublicStack {
  id: string;
  name: string;
  description: string | null;
  item_count: number;
}

async function fetchProfile(username: string): Promise<{
  profile: Profile | null;
  reviews: PublicReview[];
  stacks: PublicStack[];
}> {
  // In static/no-DB mode, return null
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { profile: null, reviews: [], stacks: [] };
  }

  try {
    const { createServiceRoleClient } = await import("@/lib/supabase/server");
    const supabase = createServiceRoleClient();

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (!profile) return { profile: null, reviews: [], stacks: [] };

    const [{ data: reviews }, { data: stacks }] = await Promise.all([
      supabase
        .from("reviews")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("user_stacks")
        .select("id, name, description")
        .eq("user_id", profile.id)
        .eq("is_public", true)
        .order("created_at", { ascending: false }),
    ]);

    return {
      profile,
      reviews: reviews || [],
      stacks: stacks || [],
    };
  } catch {
    return { profile: null, reviews: [], stacks: [] };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username} — ClawVerse Profile`,
    description: `View ${username}'s profile on ClawVerse`,
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const { profile, reviews, stacks } = await fetchProfile(username);

  if (!profile) {
    return (
      <div className="py-20 text-center">
        <h1 className="mb-2 text-xl font-bold text-text-primary">
          User not found
        </h1>
        <p className="text-sm text-text-muted">
          @{username} doesn&apos;t exist on ClawVerse.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Profile Header */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full border border-border"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-purple/20 text-2xl text-accent-violet">
              {(profile.display_name || profile.username)[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              {profile.display_name || profile.username}
            </h1>
            <span className="text-sm text-text-muted">
              @{profile.username}
            </span>
            {profile.bio && (
              <p className="mt-2 text-sm text-text-secondary">{profile.bio}</p>
            )}
            <div className="mt-2 flex items-center gap-4 text-xs text-text-muted">
              <span>
                Joined {new Date(profile.created_at).toLocaleDateString()}
              </span>
              {profile.github_username && (
                <span>GitHub: {profile.github_username}</span>
              )}
            </div>
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
          <div className="text-xs text-text-muted">Public Stacks</div>
        </div>
      </div>

      {/* Public Stacks */}
      {stacks.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
            Public Stacks
          </h2>
          <div className="flex flex-col gap-2">
            {stacks.map((stack) => (
              <a
                key={stack.id}
                href={`/stacks/${stack.id}`}
                className="rounded-xl border border-border bg-card p-4 no-underline transition-colors hover:border-white/10"
              >
                <span className="font-semibold text-text-primary">
                  {stack.name}
                </span>
                {stack.description && (
                  <p className="mt-1 text-xs text-text-secondary">
                    {stack.description}
                  </p>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Recent Reviews */}
      {reviews.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
            Reviews
          </h2>
          <div className="flex flex-col gap-2">
            {reviews.map((review) => (
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
                <span className="mt-1 block text-[11px] text-text-muted">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
