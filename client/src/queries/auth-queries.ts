import { BACKEND_URL } from "@/lib/utils"
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

  return { registerUser }
}