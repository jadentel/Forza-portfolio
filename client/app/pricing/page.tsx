import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import SubscriptionCard from "../components/subscription";
import WaveBackground from "../components/wave";
import { GetUserID, IsLoggedIn } from "../session";

export interface PlanInfo {
  planID : string;
  planName : string;
  monthlyPrice : number;
  weeklyActivities : number;
  displayFreeBadge : boolean;
  friendsAllowed : boolean;
}

async function PricingCards(props : {plans : PlanInfo[]}) {
  // If logged in, get the user's plan so we can style the pricing page appropiately
  let subscribed_plan : string = "";
  if (await IsLoggedIn()) {
    // Get user id
    const user_id = await GetUserID();

    // Check if user is already subsribed
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
            "userID" : user_id
        })
        });

        if (!resp.ok) throw "User not found";

        // Check if user is subsctibed already
        const data = await resp.json();
        if (data.user.planID != null && data.user.planID != 999) subscribed_plan = data.user.planID;
    }
    catch (e : any) {}
  }

  if (props.plans.length == 0) {
    return <p className="m-32 text-6xl">There are no plans yet.</p>
  } else {
    return (
      <div className="flex flex-col md:flex-row md:justify-around items-center">
        {props.plans.map((plan) => {
          return <SubscriptionCard plan={plan} subscribed={subscribed_plan}/>
        })}
      </div>
    );
  }
}

async function PricingDisplay() {
  // Get available plans
  let plan_ids = [];
  let plans : PlanInfo[] = [];
  try {
    const resp = await fetch("http://backend-dev:5001/api/plan/ids", 
    {
      method : "GET",
      headers :
      {
        "Content-Type" : "application/json",
        "Accept" : "application/json",
        "APIKey" : process.env.SECRET_KEY!
      }
    });

    if (!resp.ok) throw "";

    let data = await resp.json();
    plan_ids = data.planIDs;
  } catch (e: any) {
    return <p>Something went wrong</p>
  }

  // Get plan details
  for (let i = 0; i < plan_ids.length; i++) {
    const resp = await fetch("http://backend-dev:5001/api/plan/get",
    {
      method : "POST",
      headers :
      {
        "Content-Type" : "application/json",
        "Accept" : "application/json",
        "APIKey" : process.env.SECRET_KEY!
      },

      body : JSON.stringify({
        "planID" : plan_ids[i]
      })
    });

    if (!resp.ok) throw "";

    let data = await resp.json();
    plans.push(data);
    plans[i].planID = plan_ids[i];
  }

  return (
    <PricingCards plans={plans}/>
  );
}

export default function Pricing() {
  return (
    <div>
      <WaveBackground />
      <div className="relative z-50">
        <Navbar white_text={false}/>
        <div className="m-0 items-center justify-center p-8 flex flex-col">
          <h1 className="m-4 text-4xl md:m-6 md:text-5xl text-center">
            Choose the subscription that best defines you.
          </h1>
          <PricingDisplay />
        </div>
        <Footer />
      </div>
    </div>
  );
}
