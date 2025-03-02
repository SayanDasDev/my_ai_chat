import { useTokenStore } from "@/hooks/use-token-store"
import { clsx, type ClassValue } from "clsx"
import { usePathname } from "next/navigation"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BACKEND_URL = "http://127.0.0.1:5000/api/v1"
// export const BACKEND_URL = "https://k4jpkgdk-5000.inc1.devtunnels.ms/api/v1"


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

export const useChatId = (): string => {
  const pathname = usePathname();
  const match = pathname.match(/\/chat\/([^/]+)/);
  return match ? match[1] : "";
};

export function parseResponsePattern(input: string): { filename: string | null, restOfString: string } {
  const pattern = /^\*#FILE=\$(.+?)#([\s\S]*)$/;
  const match = input.match(pattern);

  if (match) {
    const fullFilename = match[1];
    const restOfString = match[2];
    const filename = fullFilename.substring(fullFilename.indexOf('_') + 1);
    return { filename, restOfString };
  } else {
    return { filename: null, restOfString: input };
  }
}

export function extractThoughtAndRest(input: string) {
  const thoughtMatch = input.match(/<think>([\s\S]*?)<\/think>/);
  const thoughtContent = thoughtMatch ? thoughtMatch[1].trim() : "";
  const restContent = thoughtMatch ? input.replace(thoughtMatch[0], "").trim() : input.trim();

  if (thoughtContent === "")
    return { thought: null, rest: restContent }

  return { thought: thoughtContent, rest: restContent };
}
