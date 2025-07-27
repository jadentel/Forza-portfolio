import Link from "next/link";
import React from "react";
import { FiActivity, FiUser } from "react-icons/fi";
import { GetUserID, IsLoggedIn } from "../session";

function NavLink(props : { href : string, text : string, white_text : boolean}) {
  const classLink = `font-bold text-xl group text-black transition duration-300 ${props.white_text ? "text-forza-100" : "text-forza-500"}`;
  const classSpan = `block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 ${props.white_text ? "bg-forza-100" : "bg-forza-500"}`;

  return (
    <Link href={props.href} className={classLink}>
      {props.text}
      <span className={classSpan}></span>
    </Link>
  );
}

async function NavLinks(props : {white_text : boolean}) {
  const classLink = `border-4 rounded-3xl hover:rounded-xl transition-all ${props.white_text ? "text-forza-100 border-forza-100" : "text-forza-500 border-forza-500"}`;
  
  // Check user is logged in
  let logged_in : boolean = await IsLoggedIn();
  let user_id : string = await GetUserID();

  return (
    <div className="flex gap-[2vw] items-center">
      {user_id === "1"
        ? <NavLink href="/admin" text="Admin" white_text={props.white_text}/>
        : <></>
      }

      {logged_in
        ? <NavLink href="/dashboard" text="Dashboard" white_text={props.white_text}/>
        : <></>
      }

      {logged_in
        ? <NavLink href="/feed" text="Feed" white_text={props.white_text}/>
        : ""
      }

      <NavLink href="/pricing" text="Plans" white_text={props.white_text}/>
      
      {logged_in
        ? <NavLink href="/logout" text="Log Out" white_text={props.white_text}/>
        : <NavLink href="/register" text="Register" white_text={props.white_text}/>
      }

      {logged_in
      ? <Link href={"/profile/" + user_id.toString()} className={classLink}> <FiUser size={40} /> </Link>
      : <NavLink href="/login" text="Login" white_text={props.white_text}/>
      }
    </div>
  );
}

export default function Navbar(props : {white_text : boolean}) {
  const classLink = `font-bold text-2xl ${props.white_text ? "text-forza-100" : "text-forza-500"}`;
  return (
    <div className="bg-forza-500 bg-opacity-0">
      <div className="flex items-center justify-between mx-auto w-[95%] 3xl:justify-center space-x-10 h-20 p-6">
        <div className="flex gap-[2vw] items-center">
          <div className={classLink}>
            <FiActivity size="40" />
          </div>
          <Link href="/" className={classLink}>
            FORZA
          </Link>
        </div>
        <NavLinks white_text={props.white_text}/>
      </div>
    </div>
  );
}
