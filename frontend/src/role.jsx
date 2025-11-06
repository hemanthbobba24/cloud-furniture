export const ALLOWED_ROLES = ["USER", "SELLER", "ADMIN"];

export function normalizeRole(val) {
  if (!val) return "";
  const up = String(val).toUpperCase();
  return up.startsWith("ROLE_") ? up.slice(5) : up;
}

export function safeRole(val) {
  const norm = normalizeRole(val);
  return ALLOWED_ROLES.includes(norm) ? norm : "";
}

