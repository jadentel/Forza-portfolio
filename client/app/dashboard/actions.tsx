'use server'

import { cookies } from "next/headers";
import { z, ZodError } from "zod";
import { GetCsrfToken, GetUserID, IsLoggedIn } from "../session";
import { permanentRedirect } from "next/navigation";

export interface UploadFormState {
  success: boolean;
  message: string;
}

export interface DownloadFormState {
  success: boolean;
  message: string;
  downloadData: string;
}

export async function HandleDownload(old_state: DownloadFormState, form_data: FormData): Promise<DownloadFormState> {

  // INFO: use zod to validate submission for GPX download
  const schema = z.object({
    activityID: z.string(),
    activityName: z.string(),
    token: z.string(),
  })

  let data: any;

  try {
    data = schema.parse(Object.fromEntries(form_data.entries()));
  }
  catch (e: any) {
    if (e instanceof ZodError) {
      return { success: false, message: e.issues[0].message, downloadData: "" };
    }

    return { success: false, message: e.message, downloadData: "" };
  }


  // INFO: csrf token validation
  const cookie_store = cookies();
  const session_id = cookie_store.get("session-id")?.value!;
  var token: string = "";
  try {
    token = await GetCsrfToken(session_id);
  }
  catch (e: any) {
    return { success: false, message: e.message, downloadData: "" };
  }

  // INFO: if fetched token does not equal the submitted token, then csrf token is invalid
  if (token != data.token) {
    return { success: false, message: "444: Something went wrong :(", downloadData: "" };
  }

  // INFO: make a POST request to our server requesting to get gpx string
  try {
    const user_id = await GetUserID();
    const resp = await fetch("http://backend-dev:5001/api/activity/gpx",
      {
        method: "POST",
        headers:
        {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "APIKey": process.env.SECRET_KEY!
        },

        body: JSON.stringify({
          "userID": user_id,
          "activityIDs": [data.activityID],
        })
      });

    data = await resp.json();
    data.code = resp.status;
  }
  catch (e: any) {
    return { success: false, message: e.message, downloadData: "" };
  }

  // INFO: on a successful request, send the GPX string back to client side
  return { success: true, message: data.message, downloadData: data.gpxData[0].gpxData }
}

export async function HandleDelete(old_state: UploadFormState, form_data: FormData): Promise<UploadFormState> {

  // INFO: using zod to validate submission GPX deletion
  const schema = z.object({
    activityID: z.string(),
    token: z.string(),
  })

  let data: any;

  try {
    data = schema.parse(Object.fromEntries(form_data.entries()));
  }
  catch (e: any) {
    if (e instanceof ZodError) {
      return { success: false, message: e.issues[0].message };
    }

    return { success: false, message: e.message };
  }

  const cookie_store = cookies();
  const session_id = cookie_store.get("session-id")?.value!;
  var token: string = "";

  try {
    token = await GetCsrfToken(session_id);
  }
  catch (e: any) {
    return { success: false, message: e.message };
  }


  if (token != data.token) {
    return { success: false, message: "444: Something went wrong :(" };
  }


  // INFO: make a POST request to our server requesting to remove GPX data
  try {
    const user_id = await GetUserID();
    const resp = await fetch("http://backend-dev:5001/api/activity/remove",
      {
        method: "POST",
        headers:
        {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "APIKey": process.env.SECRET_KEY!
        },

        body: JSON.stringify({
          "userID": user_id,
          "activityID": data.activityID,
        })
      });

    data = await resp.json();
    data.code = resp.status;
  }
  catch (e: any) {
    return { success: false, message: e.message };
  }

  // INFO: refresh dashboard upon successful submission, no need to return
  permanentRedirect("/dashboard");
}

export async function HandleUpload(old_state: UploadFormState, form_data: FormData): Promise<UploadFormState> {

  // INFO: Make sure user is logged in
  if (!await IsLoggedIn()) {
    return { message: "You need to be logged in", success: false };
  }

  // INFO: use zod to validate submission for gpx upload 
  const schema = z.object({
    activity_data: z.any(),
    activity_name: z.string().min(1, "You must specify an activity name"),
    is_private: z.any(),
    token: z.string(),
  });

  let data: any;

  try {
    data = schema.parse(Object.fromEntries(form_data.entries()));

    // INFO: rather than checking for true or false, is_public can be set depending on if the checkbox from HTML input exists or not
    if ("is_private" in data) {
      data.is_public = false;
    }
    else {
      data.is_public = true;
    }

    // INFO: Read file contents
    const array_buffer = await data.activity_data.arrayBuffer();
    const buffer = new Uint8Array(array_buffer);
    const gpx_text = new TextDecoder().decode(buffer);
    data.gpx_data = gpx_text;
  }
  catch (e: any) {
    if (e instanceof ZodError) {
      return { success: false, message: e.issues[0].message };
    }

    return { success: false, message: e.message };
  }

  const cookie_store = cookies();
  const session_id = cookie_store.get("session-id")?.value!;
  var token: string = "";
  try {
    token = await GetCsrfToken(session_id);
  }
  catch (e: any) {
    return { success: false, message: e.message };
  }

  if (token != data.token) {
    return { success: false, message: "444: Something went wrong :(" };
  }

  // INFO: make a POST request to server requesting to upload gpx data
  try {
    const user_id = await GetUserID();
    const resp = await fetch("http://backend-dev:5001/api/activity/upload",
      {
        method: "POST",
        headers:
        {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "APIKey": process.env.SECRET_KEY!
        },

        body: JSON.stringify({
          "userID": user_id,
          "gpxData": data.gpx_data,
          "activityName": data.activity_name,
          "public": data.is_public,
        })

      });

    data = await resp.json();
    data.code = resp.status;
  }
  catch (e: any) {
    return { success: false, message: e.message };
  }

  // INFO: refresh dashboard upon successful submission
  if (data.code == 201) {
    permanentRedirect("/dashboard");
  }

  return { success: true, message: data.message }
}
