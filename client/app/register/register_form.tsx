'use client';

import { useFormState, useFormStatus } from "react-dom";
import { HandleRegister, RegisterFormState } from "./actions";
import Link from "next/link";

function RegisterSubmitButton(props: { state: RegisterFormState }) {
  const status = useFormStatus();

  if (status.pending) {
    // loading
    return <button disabled className="flex-0 block transition-all bg-forza-300 border-2 border-forza-500 p-5 text-2xl w-full rounded-full font-bold border-solid my-4 mt-16" type="submit">Loading...</button>
  }
  else {
    // Default button
    return <button className="flex-0 block transition-all bg-forza-200 hover:bg-forza-100 border-2 border-forza-100 hover:border-forza-500 p-5 text-2xl w-full rounded-full font-bold border-solid my-4 mt-16" type="submit">Register</button>
  }
}

function RegisterEntry(props: { placeholder: string, name: string, type: string }) {
  return <input aria-label={props.name} type={props.type} placeholder={props.placeholder} name={props.name} className="flex-0 bg-white p-5 w-full rounded-full border-2 border-forza-500 border-solid my-4" />
}

export function RegisterForm() {
  const [state, action] = useFormState(HandleRegister, { success: false, message: "" });

  return (
    <>
      <form action={action} className="w-full">

        <div className="2xl:flex 2xl:justify-around">
          <RegisterEntry type="text" placeholder="First Name" name="first_name"></RegisterEntry>
          <div className="px-0 2xl:px-3"></div>
          <RegisterEntry type="text" placeholder="Last Name" name="last_name"></RegisterEntry>
        </div>

        <RegisterEntry type="text" placeholder="Username" name="username"></RegisterEntry>
        <RegisterEntry type="text" placeholder="example@email.com" name="email"></RegisterEntry>

        <div className="2xl:flex 2xl:justify-around">
        <RegisterEntry type="password" placeholder="Password" name="password"></RegisterEntry>
        <div className="px-0 2xl:px-3"></div>
        <RegisterEntry type="password" placeholder="Confirm password" name="confirm_password"></RegisterEntry>
        </div>

        <RegisterSubmitButton state={state} />

        <div className="flex items-center justify-center">
          <div className="flex gap-[2vw]">
            <Link href="/login" className="font-bold text-center text-forza-400 hover:text-forza-200 group transition duration-300">Already have an account?
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-forza-200"></span>
            </Link>
          </div>
        </div>

      </form>
      <p>{state.message}</p>
    </>
  )
}
