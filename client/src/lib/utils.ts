import { useTokenStore } from "@/hooks/use-token-store"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BACKEND_URL = "http://127.0.0.1:5000/api/v1"


export const assertAuthenticated = async () => {
  const { accessToken, refreshToken, setAccessToken, clearTokens } = useTokenStore.getState()

  if (!accessToken || !refreshToken)
    return false

  let response = await fetch(`${BACKEND_URL}/user/check`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (response.ok) return true

  response = await fetch(`${BACKEND_URL}/user/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      "Content-Type": "application/json",
    }
  })

  if (!response.ok) {
    clearTokens()
    return false
  }

  const res = await response.json()

  setAccessToken(res.access_token)

  return true

}

export const ensureAuthenticated = async () => {
  const isAuthenticated = await assertAuthenticated();

  if (!isAuthenticated) {
    throw new Error(`401`);
  }
};

/**
 * Get the initials from a full name.
 * @param name - The full name.
 * @returns The initials.
 */
export const getInitials = (name: string): string => {
  if (!name) return '';

  const nameParts = name.trim().split(' ');
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
  return initials;
};