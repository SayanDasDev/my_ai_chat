import { z } from "zod";


export const registerSchema = z.object({
  username: z.string().min(3, { message: "Username should be at least 3 character long" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, {
      message: "Password must have at least 8 characters.",
    })
    .refine(
      (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_-])[A-Za-z\d@$!%*?&_-]+$/.test(
          password
        ),
      {
        message:
          "Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character.",
      }
    ),
})