'use server';

import { z, ZodError } from 'zod';
import { permanentRedirect } from "next/navigation";

export interface RegisterFormState {
  success: boolean;
  message: string;
}

export async function HandleRegister(old_state: RegisterFormState, form_data: FormData): Promise<RegisterFormState> {
  // Validate form
  // TODO: minimum length etc
  const schema = z.object({
    first_name: z.string().min(1, "First Name cannot be blank"),
    last_name: z.string().min(1, "Last Name cannot be blank"),
    username: z.string().min(1, "Username cannot be blank"),
    email: z.string().min(1, "Email cannot be blank").email("Email must be a valid email"),
    password: z.string().min(8, "Password must be a minimum length 8"),
    confirm_password: z.string().min(8, "Password must be a minimum length 8")
  });

  let data: any;

  try {
    data = schema.parse(Object.fromEntries(form_data.entries()));
  }
  catch (e) {
    if (e instanceof ZodError) {
      return { success: false, message: e.issues[0].message };
    }

    return { success: false, message: "Server Error" };
  }

  // API call to our server
  try {
    const resp = await fetch("http://backend-dev:5001/api/register",
      {
        method: "POST",
        headers:
        {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "APIKey": process.env.SECRET_KEY!
        },
        body: JSON.stringify({
          "username": data.username,
          "password": data.password,
          "confirm_password": data.confirm_password,
          "email": data.email,
          "firstName": data.first_name,
          "lastName": data.last_name
        })
      });

    data = await resp.json();
    data.code = resp.status;
  }
  catch (e: any) {
    return { success: false, message: e.message };
  }

  // INFO: refresh page upon successful submission
  if (data.code == 201) {
    permanentRedirect("/login");
  }

  return { success: true, message: data.message };
}
