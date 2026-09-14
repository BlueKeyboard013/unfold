const STORAGE_KEY = "unfold_anonymous_user_id";

export function getOrCreateUserId(): string {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const generated = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, generated);
  return generated;
}
