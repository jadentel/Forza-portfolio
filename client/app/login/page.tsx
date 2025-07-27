import React from "react";
import LoginForm from "./login_form";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import WaveBackground from "../components/wave";
import { IsLoggedIn } from "../session";
import { permanentRedirect } from "next/navigation";

export default async function Login() {
  // INFO: if the user is logged in, we can redirect to the dashboard
  if (await IsLoggedIn()) {
    permanentRedirect("/dashboard");
  }

  return (
    <div>
      <WaveBackground />
      <div className="relative z-50">
        <Navbar white_text={false}/>
        <div className="flex justify-center items-center sm:mx-0">
          <div className="flex flex-row items-center mx-10 2xl:mx-96 my-40 justify-center bg-forza-100 border-2 border-forza-500 2xl:border-0 shadow-xl rounded-xl overflow-x-auto">
              <div className="w-1/2 flex flex-col items-center justify-center my-20 mx-20 2xl:my-0">
                <div className="w-full flex items-center justify-center text-5xl font-bold pb-20">
                  Login
                </div>
                <LoginForm />
              </div>
              <img className="rounded-tr-xl rounded-br-xl object-cover w-1/2 h-fit hidden 2xl:block" alt="A man running" src="/shoes.jpg"></img>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
