'use client';
import React from "react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { HandleLogin, LoginFormState } from "./actions";

function LoginButton() {
  const status = useFormStatus();

  if (status.pending) {
    // INFO: before logging in, display loading status to show that form is processing
    return <button disabled className="flex-0 block transition-all bg-forza-300 border-2 border-forza-500 p-5 text-2xl w-full rounded-full font-bold border-solid my-4 mt-16" type="submit">Loading...</button>
  }
  else {
    // INFO: otherwise, give user the opportunity to log in
    return <button className="flex-0 block transition-all bg-forza-200 hover:bg-forza-100 border-2 border-forza-100 hover:border-forza-500 p-5 text-2xl w-full rounded-full font-bold border-solid my-4 mt-16" type="submit">Log In</button>
  }
}

export default function LoginForm() {
  // INFO: to pass to actions to make login post request
  const [state, form_action] = useFormState(HandleLogin, { success: false, message: "" });

  return (
    <form className="w-full" action={form_action}>
      <input aria-label="Username" className="flex-0 bg-white p-5 w-full rounded-full border-2 border-forza-500 border-solid my-4" name="username" type="text" placeholder="Username" required />
      <input aria-label="Password" className="flex-0 bg-white p-5 w-full rounded-full border-2 border-forza-500 border-solid my-4" name="password" type="password" placeholder="Password" required />
      <LoginButton />

      <div className="flex items-center justify-center">
        <div className="flex gap-[2vw]">
          <Link href="/register" className="font-bold text-center text-forza-400 hover:text-forza-200 group transition duration-300">Don't have an account?
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-forza-200"></span>
          </Link>
        </div>
      </div>

      <p className="text-center">{state.message}</p>
    </form>
  );
}
