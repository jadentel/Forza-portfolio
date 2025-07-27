import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import WaveBackground from "../components/wave";
import { RegisterForm } from "./register_form";

export default function Register() {
  return (
    <div>
      <WaveBackground />
      <div className="relative z-50">
        <Navbar white_text={false}/>
        <div className="flex justify-center items-center sm:mx-0">
          <div className="flex flex-row items-center mx-20 2xl:mx-60 my-10 justify-center bg-forza-100 border-2 border-forza-500 2xl:border-0 shadow-xl rounded-xl overflow-x-auto">
            <div className="w-2/3 flex flex-col items-center justify-center mx-10 my-10">
              <div className="w-full flex items-center justify-center text-5xl font-bold pb-10">
                Register
              </div>
              <RegisterForm />
            </div>

            <img className="rounded-tr-xl rounded-br-xl object-cover w-1/2 h-fit hidden 2xl:block" alt="A man running" src="/mountain.jpg"></img>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
