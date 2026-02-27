export type UserRole = "ADMIN" | "FINANCE" | "OPERATION" | "USER"

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    role: UserRole
  }
}

const TOKEN_KEY = "auth_token"
const ROLE_KEY = "auth_role"
const USERNAME_KEY = "auth_username"

export const ROLE_OPTIONS: UserRole[] = ["ADMIN", "FINANCE", "OPERATION", "USER"]

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:5001"

const ROLE_REDIRECTS: Record<UserRole, string> = {
  ADMIN: "/dashboard",
  FINANCE: "/finance-dashboard",
  OPERATION: "/operation-dashboard",
  USER: "/dashboard",
}

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const data = (await response.json().catch(() => ({}))) as
      | LoginResponse
      | { message?: string }

    if (!response.ok) {
      const message =
        "message" in data && typeof data.message === "string"
          ? data.message
          : "Login failed. Please check your username and password."
      throw new Error(message)
    }

    if (
      !("token" in data) ||
      typeof data.token !== "string" ||
      !("user" in data) ||
      !data.user ||
      typeof data.user !== "object" ||
      typeof data.user.role !== "string"
    ) {
      throw new Error("Invalid login response from server")
    }

    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(ROLE_KEY, data.user.role)
    localStorage.setItem(USERNAME_KEY, data.user.username)

    return data as LoginResponse
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }

    throw new Error("Unable to sign in right now. Please try again.")
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUserRole(): UserRole | null {
  const role = localStorage.getItem(ROLE_KEY)

  if (!role) {
    return null
  }

  if (isValidRole(role)) {
    return role as UserRole
  }

  return null
}

export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY)
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ROLE_KEY)
  localStorage.removeItem(USERNAME_KEY)
}

export function getRoleRedirectPath(role: UserRole): string {
  return ROLE_REDIRECTS[role] ?? "/dashboard"
}

export function getRouteGuardRedirect(allowedRoles?: UserRole[]): string | null {
  const token = getToken()

  if (!token) {
    return "/login"
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return null
  }

  const role = getUserRole()

  if (!role || !allowedRoles.includes(role)) {
    return "/unauthorized"
  }

  return null
}

export function isValidRole(value: string): value is UserRole {
  return ROLE_OPTIONS.includes(value as UserRole)
}

export function canAccessPath(role: UserRole, pathname: string): boolean {
  if (role === "ADMIN") {
    return true
  }

  if (pathname === "/" || pathname === "/dashboard") {
    return true
  }

  if (role === "FINANCE") {
    return (
      pathname.startsWith("/finance") ||
      pathname.startsWith("/finance-dashboard") ||
      pathname.startsWith("/customers")
    )
  }

  if (role === "OPERATION") {
    return (
      pathname.startsWith("/operations") ||
      pathname.startsWith("/operation-dashboard") ||
      pathname.startsWith("/inventory") ||
      pathname.startsWith("/customers")
    )
  }

  return pathname.startsWith("/dashboard")
}
