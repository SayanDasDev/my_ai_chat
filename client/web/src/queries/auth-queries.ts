import { useTokenStore } from "@/hooks/use-token-store"
import { BACKEND_URL, ensureAuthenticated } from "@/lib/utils"
import { loginSchema } from "@/types/schema/login-schema"
import { registerSchema } from "@/types/schema/register-schema"
import { z } from "zod"


export const authQuery = () => {

  const registerUser = async (values: z.infer<typeof registerSchema>) => {
    const response = await fetch(`${BACKEND_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    })

    if (response.status !== 201) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  const logIn = async (values: z.infer<typeof loginSchema>) => {
    const response = await fetch(`${BACKEND_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  const { accessToken, clearTokens } = useTokenStore.getState()

  const logOut = async () => {

    await ensureAuthenticated()


    const response = await fetch(`${BACKEND_URL}/user/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    clearTokens()

    return response.json();
  }

  const getUser = async () => {
    await ensureAuthenticated()

    const response = await fetch(`${BACKEND_URL}/user/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);

    }

    return response.json()

  }

  return { registerUser, logIn, logOut, getUser }
}