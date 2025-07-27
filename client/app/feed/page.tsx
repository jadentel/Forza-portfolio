import React from 'react';
import Navbar from "../components/navbar";
import WaveBackground from "../components/wave";
import { GetCsrfToken, GetUserID, IsLoggedIn } from '../session'
import { permanentRedirect } from "next/navigation"
import { cookies } from 'next/headers';
import { ActivityType } from '../dashboard/dashboard_table';
import { FeedTable } from './feed_table';

// INFO: component to display if post request fails
function ErrorDisplay(props: { message: string }) {
  return <div className="flex items-center justify-center">
    <h1 className="text-2xl text-center m-5 pt-5">Oops. Something went wrong :(</h1>
    <h1 className="text-2xl text-center m-5 pt-5">{props.message}</h1>
  </div>
}

export interface PostDetails
{
  username : string,
  userID : string,
  activityID : string
}

export interface PostType extends ActivityType
{
  userID : string;
  username : string;
}

// INFO: Wrap the table in a server side component to make our api calls
async function FeedTableWrapper() {
  const cookie_store = cookies();
  const session_id = cookie_store.get("session-id")?.value!;
  var token: string = "";

  // INFO: Get csrf token for verification
  try {
    token = await GetCsrfToken(session_id);
  }
  catch (e: any) {
    return <p>"Something went wrong :( - failed to get csrf token"</p>
  }

  var data: any;
  let user_id: string = "";

  // INFO: Get user id
  try {
    user_id = await GetUserID();
  }
  catch (e: any) {
    return <ErrorDisplay message="Error 404: activities request failed" />;
  }

  // INFO: API post request to get the list of activities
  try {
    const resp = await fetch("http://backend-dev:5001/api/activity/feed",
      {
        method: "POST",
        headers:
        {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "APIKey": process.env.SECRET_KEY!
        },

        body: JSON.stringify({
          "userID": user_id,
        })
      });

    if (!resp.ok) throw {};

    data = await resp.json();
    data.code = resp.status;
  }
  catch (e: any) {
    console.log(e);
    return <ErrorDisplay message="Error: Activity id request failed" />
  }

  // INFO: array to store activities returned by POST request, we then pass this to feed page
  let activity_ids: Array<PostDetails> = data.activityIDs;
  var activities: PostType[] = [];

  // INFO: make second API call to get activity data for each activity id
  for (let id of activity_ids) {
    try {
      const resp = await fetch("http://backend-dev:5001/api/activity/get",
        {
          method: "POST",
          headers:
          {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "APIKey": process.env.SECRET_KEY!
          },

          body: JSON.stringify({
            "userID": user_id,
            "activityID": id.activityID
          })
        });


      data = await resp.json();
      data.code = resp.status;

      data.activity.activityID = id.activityID;
      data.activity.username = id.username;
      data.activity.userID = id.userID;

      if (resp.ok) activities.push(data.activity);
    }
    catch (e: any) {
      console.log(e);
      return <ErrorDisplay message="Error: activities request failed" />
    }
  }

  return <FeedTable activities={activities} token={token} userID={user_id} />
}

export default async function Dashboard() {
  if (!await IsLoggedIn()) {
    permanentRedirect("/login")
  }

  return <div>
    <WaveBackground />
    <div className="relative z-50 h-screen flex flex-col">
      <Navbar white_text={false} />
      <div className="m-10 flex flex-col items-center justify-center">
        <div >
          <FeedTableWrapper />
        </div>
      </div>
    </div>
  </div>;
}
