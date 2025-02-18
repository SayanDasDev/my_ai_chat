import { useTokenStore } from "@/hooks/use-token-store"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BACKEND_URL = "http://127.0.0.1:5000"


export const assertAuthenticated = async () => {
  console.log("running 1")
  const { accessToken, refreshToken, setAccessToken, clearTokens } = useTokenStore.getState()

  if (!accessToken || !refreshToken)
    return false
  console.log("running 2")

  let response = await fetch(`${BACKEND_URL}/user/check`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  console.log("running 3")

  if (response.ok) return true
  console.log("running 4")

  response = await fetch(`${BACKEND_URL}/user/login`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
      "Content-Type": "application/json",
    }
  })
  console.log("running 5")

  if (!response.ok) {
    clearTokens()
    return false
  }
  console.log("running 6")

  const res = await response.json()

  setAccessToken(res.access_token)

  console.log("running 7")
  return true

}