import { cookies } from "next/headers";

export async function IsLoggedIn() : Promise<boolean>
{
    const cookie_store = cookies();

    if (!cookie_store.has("session-id"))
    {
        return false;
    }

    try
    {
        const resp = await fetch("http://backend-dev:5001/api/csrf", {
            method : "POST",
            headers :
            {
                "Content-Type" : "application/json",
                "Accept" : "application/json",
                "APIKey" : process.env.SECRET_KEY!
            },

            body : JSON.stringify({
                "sessionID" : cookie_store.get("session-id")?.value
            })
        })

        return resp.ok;
    }
    catch (e : any)
    {
        console.log(e);
        return false;
    }
}

// Gets the csrf token for a user id
export async function GetCsrfToken(session_id : string) : Promise<string>
{
    try
    {
        const resp = await fetch("http://backend-dev:5001/api/csrf", {
            method : "POST",
            headers :
            {
                "Content-Type" : "application/json",
                "Accept" : "application/json",
                "APIKey" : process.env.SECRET_KEY!
            },

            body : JSON.stringify({
                "sessionID" : session_id
            })
        })

        const data = await resp.json();

        return data.csrfToken;
    }
    catch (e : any)
    {
        console.log(e);
        return Promise.reject();
    }
}

export async function GetUserID(): Promise<string> {
    try
    {
        let sessionID = cookies().get("session-id")!.value;
        const resp = await fetch(`http://backend-dev:5001/api/user/id`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                APIKey: process.env.SECRET_KEY!,
            },
            body: JSON.stringify({
                sessionID: sessionID,
            }),
      });
  
      const data = await resp.json();
  
      return data.userID;
    }
    catch (e: any)
    {
        return "";
    }
}
