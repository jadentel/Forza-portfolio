'use server';

import { redirect } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";
import { z, ZodError } from "zod";

export interface LoginFormState
{
    success : boolean;
    message : string;
}

export async function HandleLogin(old_state : LoginFormState, form_data : FormData) : Promise<LoginFormState>
{
    // INFO: validate the login form from client input 
    const schema = z.object({
        username : z.string().min(1, "Username cannot be blank"),
        password : z.string().min(1, "You must enter a password"),
    });

    let data : any;

    try
    {
        data = schema.parse(Object.fromEntries(form_data.entries()));
    }
    catch (e)
    {
        if (e instanceof ZodError)
        {
            return { success : false, message : e.issues[0].message };
        }

        return { success : false, message : "Server Error" };
    }

    // INFO: Making an API call to our server requesting to login user
    try
    {
        const resp = await fetch("http://backend-dev:5001/api/login",
        {
            method : "POST",
            headers :
            {
                "Content-Type" : "application/json",
                "Accept" : "application/json",
                "APIKey" : process.env.SECRET_KEY!
            },

            body : JSON.stringify({
                "username" : data.username,
                "password" : data.password,
                "forceLogout" : "false"
            })
        });

        data = await resp.json();
        data.code = resp.status;
    }
    catch (e : any)
    {
        return { success : false, message : e.message};
    }

    // INFO: Create session cookie
    const cookie_store = cookies();
    cookie_store.set("session-id", data.sessionID);

    // INFO: if success code is returned, login is successful, redirect to dashboard
    if (data.code == 201) {
      permanentRedirect("/dashboard");
    }

    return { success : true, message : data.message }
}
