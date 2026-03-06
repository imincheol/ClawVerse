/**
 * Convert a UUID string to a stable numeric id.
 *
 * Takes the first 8 hex characters of the UUID (32 bits) and parses them as
 * an unsigned integer.  This avoids the collision problem of charCodeAt(0)
 * while remaining deterministic for the same UUID.
 */
export function uuidToNumericId(uuid: string): number {
  // Strip dashes and take first 8 hex chars → 32-bit integer
  const hex = uuid.replace(/-/g, "").slice(0, 8);
  return parseInt(hex, 16) || 0;
}
