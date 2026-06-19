import type { User } from "@/types";

/** Dev-only: skip login when running `npm run dev` */
export const isDevAuthBypass =
  process.env.NODE_ENV === "development";

export const DEV_ADMIN_USER: User = {
  _id: "dev-admin",
  name: "dev-admin",
  role: "admin",
};

export const DEV_ADMIN_TOKEN = "dev-bypass-token";

export function ensureDevAdminSession(): User | null {
  if (!isDevAuthBypass || typeof window === "undefined") {
    return null;
  }

  const devUser = DEV_ADMIN_USER;
  localStorage.setItem("user", JSON.stringify(devUser));
  localStorage.setItem("token", DEV_ADMIN_TOKEN);
  return devUser;
}

export function hasAdminSession(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (isDevAuthBypass) {
    return true;
  }

  return Boolean(
    localStorage.getItem("user") && localStorage.getItem("token")
  );
}
