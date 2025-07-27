import { GetCsrfToken } from "@/app/session";
import { assert } from "console";
import { cookies } from "next/headers";
import React from "react";
import { UnsubscribeButton } from "./forms";
import { Info } from "./user_info.tsx";
import Link from "next/link";

export default async function Subscription(props: { planID: string }) {
  let plan_details: {
    planID: string;
    planName: string;
    monthlyPrice: number;
    weeklyActivities: number;
    displayFreeBadge: boolean;
    friendsAllowed: boolean;
  } = {
    planID: props.planID,
    planName: "",
    monthlyPrice: -1,
    weeklyActivities: -1,
    displayFreeBadge: false,
    friendsAllowed: false,
  };

  // DECORATE ME
  if (plan_details.planID == "999") {
    return (
      <div className="flex flex-col bg-white border-zinc-400/40 border-2 shadow-xl rounded-xl overflow-x-auto w-full">
        <div className="flex flex-col py-3 px-6">
          <h2 className="text-left text-2xl text-zinc-900">
            User Subscription
          </h2>
          <p className="text-zinc-600">
            This is some information about your subscription
          </p>
        </div>
        <div className="border-t-2">
          <h1 className="text-zinc-500 px-6 py-4">
            You are not subscribed to any plan{" "}
	    Click <Link className="underline text-xl text-green-300" href="/pricing">here</Link> to subscribe.
          </h1>
        </div>
      </div>
    );
  }

  let csrf = "";

  // try getting the csrf token and plan details
  try {
    csrf = await GetCsrfToken(cookies().get("session-id")?.value!);
    const resp = await fetch(`http://backend-dev:5001/api/plan/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        APIKey: process.env.SECRET_KEY!,
      },
      body: JSON.stringify({
        planID: plan_details.planID,
      }),
    });

    const data = await resp.json();
    plan_details.planName = data.planName;
    plan_details.monthlyPrice = data.monthlyPrice;
    plan_details.weeklyActivities = data.weeklyActivities;
    plan_details.displayFreeBadge = data.displayFreeBadge;
    plan_details.friendsAllowed = data.friendsAllowed;
    if (!resp.ok) {
      throw "Failed to get plan data";
    }
  } catch (e: any) {
    console.error("Failed to get plan details: ", e);
    return <p>Something went wrong</p>;
  }

  return (
    <div className="flex flex-col bg-white border-zinc-400/40 border-2 shadow-xl rounded-xl overflow-x-auto w-full">
      <div className="flex flex-col py-3 px-6">
        <h2 className="text-left text-2xl text-zinc-900">User Subscription</h2>
        <p className="text-zinc-600">
          This is some information about your subscription
        </p>
      </div>
      <Info header="Plan Name" data={plan_details.planName} />
      <Info header="Monthly Price" data={plan_details.monthlyPrice} />
      <Info header="Weekly Activities" data={plan_details.weeklyActivities == "-1" ? "Unlimited" : plan_details.weeklyActivities} />
      <Info
        header="Friends Allowed"
        data={plan_details.friendsAllowed ? "Yes" : "No"}
      />
      <UnsubscribeButton csrf_token={csrf} />
    </div>
  );
}
