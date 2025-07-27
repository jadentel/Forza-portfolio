import React from "react";
import NormalButton from "./buttons";

// Placeholder Footer component

export default function Footer()
{
    return (
	<div className="p-100">
	  <div className="p-16 justify-between items-center flex flex-row bg-forza-500 h-64 ">
      <h1 className="text-forza-100 text-4xl">Forza Subscriptions</h1>
      <a href="" className="border border-forza-100 w-64 p-4 rounded-full justify-center flex bg-transparent text-forza-100 hover:shadow-[1px_2px_0px_white] transition-all duration-300 hover:-translate-y-1">
        <h1>Explore</h1>
      </a>
    </div>
    <div className="p-16 flex flex-row bg-forza-400 h-64">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-4xl text-forza-100">Forza</h1>
        <p className="text-forza-100">© 2024 Forza, Inc.</p>
        <p className="text-forza-100">All rights reserved.</p>
        <p className="text-forza-100">Do Not Share My Personal Information</p>
      </div>
    </div>
  </div>
  )
}
