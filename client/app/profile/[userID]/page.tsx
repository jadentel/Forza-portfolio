import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import WaveBackground from "../../components/wave";
import React  from "react";
import ViewSelector from "./view_selector";
import { GetCsrfToken, GetUserID, IsLoggedIn } from "@/app/session";
import { AddFriend, RemoveFriendForm } from "./forms";
import { cookies } from "next/headers";

interface UserDetails
{
  userID : string,
  username : string,
  firstName : string,
  lastName : string,
  email : string,
  bio : string,
  planID : string,
  friends : Array<string>,
  friendRequests:  Array<string>
}

function FriendButton(props : { logged_in_uid : string, viewing_uid : string, csrf : string})
{
  if (props.logged_in_uid !== "" && props.logged_in_uid != props.viewing_uid)
  {
    // TODO: check if friends
    let is_friend = false;
    if (is_friend)
    {
      return <RemoveFriendForm userID={props.viewing_uid} csrf_token={props.csrf}/>
    }
    else
    {
      return <AddFriend userID={props.viewing_uid} csrf_token={props.csrf}/>
    }
  }

  return ""
}

async function ProfileDisplay(props : { userID : string })
{
  let user_details : UserDetails = {
    userID : "",
    username : "",
    firstName : "",
    lastName : "",
    email : "",
    bio : "",
    planID : "",
    friends : [],
    friendRequests:  []
  }
  
  // Try to get user data
  try
  {
    const resp = await fetch("http://backend-dev:5001/api/user/info",
    {
      method : "POST",
      headers :
      {
        "Content-Type" : "application/json",
        "Accept" : "application/json",
        "APIKey" : process.env.SECRET_KEY!
      },

      body : JSON.stringify({
        "userID" : props.userID
      })
    });

    if (!resp.ok)
    {
      throw "User not found";
    }

    const data = await resp.json();
    data.code = resp.status;
    user_details = data.user
  }
  catch (e : any)
  {
    // DECORATE ME
    return <p>An error occured, sorry</p>;
  }

  // Check if we are logged in and get user id
  let logged_in_user = "";
  let csrf = "";
  if (await IsLoggedIn())
  {
    logged_in_user = await GetUserID();
    csrf = await GetCsrfToken(cookies().get("session-id")?.value!);
  }

  return (
  <div className="flex flex-col gap-10 items-center justify-around mx-5 md:mx-10 mb-10">
    <p className="text-2xl md:text-4xl text-forza-500">
      <span className="text-4xl md:text-6xl font-bold text-zinc-600">
	{user_details.firstName} {user_details.lastName}
      </span>
    </p>
    <FriendButton logged_in_uid={logged_in_user} viewing_uid={user_details.userID} csrf={csrf}/>
    <ViewSelector
      userInfoData={{
        username : user_details.username,
        firstName : user_details.firstName,
        lastName : user_details.lastName,
        email : user_details.email,
        bio : user_details.bio
      }}
      userFriendList={user_details.friends}
      userRequestList={user_details.friendRequests}
      viewing_user_id={props.userID}
      logged_in_user_id={logged_in_user!}
      planID={user_details.planID}
      csrf={csrf}
    />
  </div>
  );
}

export default async function Profile({params} : {params : { userID : string}}) {
  // Check that all data is loaded before rendering
  return (
    <div>
      <WaveBackground />
      <div className="relative z-50">
        <Navbar white_text={false}/>
        <ProfileDisplay userID={params.userID}/>
        <Footer />
      </div>
    </div>
  );
}
