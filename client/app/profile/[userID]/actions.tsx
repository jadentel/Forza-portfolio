"use server";

import { GetCsrfToken, GetUserID, IsLoggedIn } from "@/app/session";
import { cookies } from "next/headers";
import { z, ZodError } from "zod";

// For simplicity, just gonna use 1 type for all form states
interface ProfileFormState {
  message: string;
  success: boolean;
}

export interface SearchUserFormState {
  message: string;
  success: boolean;
  users: any[];
}

// subscribe
export async function UnsubscribePlan(
  old_state: ProfileFormState,
  form_data: FormData,
): Promise<ProfileFormState> {
  // Check we are logged in
  if (!(await IsLoggedIn)) {
    return { message: "Failed to authenticate", success: false };
  }

  // Validate form
  const schema = z.object({
    csrf: z.string().min(1),
  });

  let data: any;

  try {
    data = schema.parse(Object.fromEntries(form_data.entries()));
  } catch (e) {
    if (e instanceof ZodError) {
      return { success: false, message: e.issues[0].message };
    }

    return { success: false, message: "Server Error" };
  }

  // validate the csrf
  try {
    const csrf = await GetCsrfToken(cookies().get("session-id")?.value!);
    if (csrf !== data.csrf) {
      return { message: "Failed to authenticate", success: false };
    }
  } catch (e: any) {
    return { message: "Failed to authenticate", success: false };
  }

  // Try subscribing
  try {
    const userID = await GetUserID();
    const resp = await fetch(`http://backend-dev:5001/api/unsubscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        APIKey: process.env.SECRET_KEY!,
      },
      body: JSON.stringify({
        userID: userID,
      }),
    });

    const data = await resp.json();
    console.log(data);
    if (!resp.ok) return { success: false, message: data.message };

    return { success: true, message: data.message };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

// friend request
export async function FriendRequest(
  old_state: ProfileFormState,
  form_data: FormData,
): Promise<ProfileFormState> {
  // Check we are logged in
  if (!(await IsLoggedIn)) {
    return { message: "Failed to authenticate", success: false };
  }

  // Validate form
  const schema = z.object({
    csrf: z.string().min(1),
    userID: z.string().min(1),
  });

  let data: any;

  try {
    data = schema.parse(Object.fromEntries(form_data.entries()));
  } catch (e) {
    if (e instanceof ZodError) {
      return { success: false, message: e.issues[0].message };
    }

    return { success: false, message: "Server Error" };
  }

  // validate the csrf
  try {
    const csrf = await GetCsrfToken(cookies().get("session-id")?.value!);
    if (csrf !== data.csrf) {
      return { message: "Failed to authenticate", success: false };
    }
  } catch (e: any) {
    return { message: "Failed to authenticate", success: false };
  }

  // Try friending
  try {
    const userID = await GetUserID();
    const resp = await fetch(
      `http://backend-dev:5001/api/user/friend/request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          APIKey: process.env.SECRET_KEY!,
        },
        body: JSON.stringify({
          from: userID,
          to: data.userID,
        }),
      },
    );

    data = await resp.json();
    if (!resp.ok) return { success: false, message: data.message };

    return { success: true, message: data.message };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

// Search a friend
export async function SearchUser(
  old_state: SearchUserFormState,
  form_data: FormData,
): Promise<SearchUserFormState> {
  // Check we are logged in
  if (!(await IsLoggedIn)) {
    return { message: "Failed to authenticate", success: false, users: [] };
  }

  // Validate form
  const schema = z.object({
    query: z.string().min(1, "Query cannot be blank"),
    csrf: z.string().min(1),
  });

  let data: any;

  // Try parsing the form data
  try {
    data = schema.parse(Object.fromEntries(form_data.entries()));
  } catch (e) {
    if (e instanceof ZodError) {
      return { success: false, message: e.issues[0].message, users: [] };
    }

    return { success: false, message: "Server Error", users: [] };
  }

  // validate the csrf
  try {
    const csrf = await GetCsrfToken(cookies().get("session-id")?.value!);
    if (csrf !== data.csrf) {
      return { message: "Failed to authenticate", success: false, users: [] };
    }
  } catch (e: any) {
    return { message: "Failed to authenticate", success: false, users: [] };
  }

  // Try searching
  try {
    const userID = await GetUserID();
    const resp = await fetch(
      "http://backend-dev:5001/api/user/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          APIKey: process.env.SECRET_KEY!,
        },
	body: JSON.stringify({
	  "username": data.query
	}),
      },
    );

    data = await resp.json();
    if (!resp.ok) return { success: false, message: data.message, users: [] };

    return { success: true, message: data.message, users: data.users };
  } catch (e: any) {
    return { success: false, message: e.message, users: [] };
  }
}

// accept friend request
export async function AcceptFriendRequest(
  old_state: ProfileFormState,
  form_data: FormData,
): Promise<ProfileFormState> {
  // Check we are logged in
  if (!(await IsLoggedIn)) {
    return { message: "Failed to authenticate", success: false };
  }

  // Validate form
  const schema = z.object({
    csrf: z.string().min(1),
    userID: z.string().min(1),
  });

  let data: any;

  try {
    data = schema.parse(Object.fromEntries(form_data.entries()));
  } catch (e) {
    if (e instanceof ZodError) {
      return { success: false, message: e.issues[0].message };
    }

    return { success: false, message: "Server Error" };
  }

  // validate the csrf
  try {
    const csrf = await GetCsrfToken(cookies().get("session-id")?.value!);
    if (csrf !== data.csrf) {
      return { message: "Failed to authenticate", success: false };
    }
  } catch (e: any) {
    return { message: "Failed to authenticate", success: false };
  }

  // Try friending
  try {
    const userID = await GetUserID();
    const resp = await fetch(`http://backend-dev:5001/api/user/friend/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        APIKey: process.env.SECRET_KEY!,
      },
      body: JSON.stringify({
        from: data.userID,
        to: userID,
      }),
    });

    data = await resp.json();
    if (!resp.ok) return { success: false, message: data.message };

    return { success: true, message: data.message };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

// accept friend request
export async function RejectFriendRequest(
  old_state: ProfileFormState,
  form_data: FormData,
): Promise<ProfileFormState> {
  // Check we are logged in
  if (!(await IsLoggedIn)) {
    return { message: "Failed to authenticate", success: false };
  }

  // Validate form
  const schema = z.object({
    csrf: z.string().min(1),
    userID: z.string().min(1),
  });

  let data: any;

  try {
    data = schema.parse(Object.fromEntries(form_data.entries()));
  } catch (e) {
    if (e instanceof ZodError) {
      return { success: false, message: e.issues[0].message };
    }

    return { success: false, message: "Server Error" };
  }

  // validate the csrf
  try {
    const csrf = await GetCsrfToken(cookies().get("session-id")?.value!);
    if (csrf !== data.csrf) {
      return { message: "Failed to authenticate", success: false };
    }
  } catch (e: any) {
    return { message: "Failed to authenticate", success: false };
  }

  // Try friending
  try {
    const userID = await GetUserID();
    const resp = await fetch(`http://backend-dev:5001/api/user/friend/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        APIKey: process.env.SECRET_KEY!,
      },
      body: JSON.stringify({
        from: data.userID,
        to: userID,
      }),
    });

    data = await resp.json();
    if (!resp.ok) return { success: false, message: data.message };

    return { success: true, message: data.message };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

// remove friend request
export async function RemoveFriend(
  old_state: ProfileFormState,
  form_data: FormData,
): Promise<ProfileFormState> {
  // Check we are logged in
  if (!(await IsLoggedIn)) {
    return { message: "Failed to authenticate", success: false };
  }

  // Validate form
  const schema = z.object({
    csrf: z.string().min(1),
    userID: z.string().min(1),
  });

  let data: any;

  try {
    data = schema.parse(Object.fromEntries(form_data.entries()));
  } catch (e) {
    if (e instanceof ZodError) {
      return { success: false, message: e.issues[0].message };
    }

    return { success: false, message: "Server Error" };
  }

  // validate the csrf
  try {
    const csrf = await GetCsrfToken(cookies().get("session-id")?.value!);
    if (csrf !== data.csrf) {
      return { message: "Failed to authenticate", success: false };
    }
  } catch (e: any) {
    return { message: "Failed to authenticate", success: false };
  }

  // Try friending
  try {
    const userID = await GetUserID();
    const resp = await fetch(`http://backend-dev:5001/api/user/friend/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        APIKey: process.env.SECRET_KEY!,
      },
      body: JSON.stringify({
        from: userID,
        to: data.userID,
      }),
    });

    data = await resp.json();
    if (!resp.ok) return { success: false, message: data.message };

    return { success: true, message: data.message };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}
