import React from "react";
import NormalButton from "./buttons";
import { PlanInfo } from "../pricing/page";
import PlanSubscribeForm from "../pricing/pricing_form";

export default function SubscriptionCard(props : { plan : PlanInfo, subscribed : string }) {
  // Split the price into two parts, the integer and the decimal
  // If the price is Free then we don't want to split it
  let time = "/month";
  if (props.plan.monthlyPrice == 0) {
    time = "";
  }

  let text = props.plan.monthlyPrice == 0 ? "Free" : props.plan.monthlyPrice.toFixed(2) + " £";
  let bg_theme = props.plan.planID != props.subscribed
    ? "shadow-xl text-forza-500 h-full w-72 m-5 md:w-56 p-6 border-2 border-forza-500 backdrop-blur-md bg-white/50 flex flex-col rounded-xl justify-center items-center"
    : "shadow-xl text-forza-500 h-full w-72 m-5 md:w-56 p-6 border-2 border-forza-500 backdrop-blur-md bg-white    flex flex-col rounded-xl justify-center items-center"
  return (
    <div className={bg_theme}>
      <h1 className="text-xl">{props.plan.planName}</h1>
      <div>
        <span className="text-4xl">{text}</span><span>{time}</span>
      </div>
      <div className="m-5 h-px w-full bg-forza-500"></div>
      <ul>
        <li>Free Badge: <b>{props.plan.displayFreeBadge ? "Yes" : "No"}</b></li>
        <li>Friends allowed: <b>{props.plan.friendsAllowed ? "Yes" : "No"}</b></li>
        <li>Weekly Activities: <b>{props.plan.weeklyActivities == -1 ? "Unlimited" : props.plan.weeklyActivities.toLocaleString()}</b></li>
      </ul>
      <div className="m-5 h-px w-full bg-forza-500"></div>
      <PlanSubscribeForm plan_id={props.plan.planID} subscribed={props.subscribed} />
    </div>
  )
}
