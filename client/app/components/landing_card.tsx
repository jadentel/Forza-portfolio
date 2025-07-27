import React from "react";

export default function landingCard({ image, alt, title, subtitle }) {
  return (
    <div>
      <img className="shadow-xl rounded-lg w-10/12 h-[400px] object-cover items-center m-auto" alt={alt} src={image}></img>
      <div className="text-center text-forza-500 p-10">
        <h1 className="text-xl font-bold">{title}</h1>
        <h2 className="text-xl">{subtitle}</h2>
      </div>
    </div>
  )
}
