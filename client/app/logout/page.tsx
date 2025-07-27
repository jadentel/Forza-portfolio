"use server";

import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";
import WaveBackground from "../components/wave";
import Link from "next/link";

export default async function logout() {
  let sessionID = cookies().get("session-id")!.value;
  try {
    const resp = await fetch(`http://backend-dev:5001/api/logout`, {
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

    // delete session cookie
    cookies().delete("session-id");

    if (data.message === "success") {
      permanentRedirect("/");
    } else if (data.message === "Session not found or already logged out") {
      permanentRedirect("/");
    }
  } catch (e: any) {
    console.log("Error: ", e.message);
  }

  return (
    <div>
      <WaveBackground />
      <div className="relative z-50 h-screen flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-center text-forza-500">
          Logged out successfully, Click
          <Link href="/">
            <h1 className="text-forza-400">here</h1>
          </Link>
          to go back to the home page
        </h1>
      </div>
    </div>
  );
}
