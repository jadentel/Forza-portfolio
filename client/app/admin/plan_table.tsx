import React from "react";
import { PlanInfo } from "./page";

export function Info(props: { header: string; numSub: string; rev: string }) {
  return (
    <div className="grid grid-cols-3 border-t-2">
      <h1 className="text-zinc-500 px-6 py-4">{props.header}</h1>
      <div className="px-6 bg-white py-3 w-full min-h-11">
        <span className="px-3">{props.numSub}</span>
      </div>
      <div className="px-6 bg-white py-3 w-full min-h-11">
        <span className="px-3">{props.rev}</span>
      </div>
    </div>
  );
}

export default async function PlanTable(props: { plan_info: PlanInfo[] }) {
  let total_subscribers = 0;
  let total_revenue = 0;
  for (let i = 0; i < props.plan_info.length; i++) {
    total_subscribers += props.plan_info[i].numSubscribers;
    total_revenue += props.plan_info[i].monthlyRevenue;
  }
  return (
    <div className="flex flex-col bg-white border-zinc-400/40 border-2 shadow-xl rounded-xl overflow-x-auto w-full">
      <div className="flex flex-col py-3 px-6">
        <h2 className="text-left text-2xl text-zinc-900">
          Plan Subscription Data
        </h2>
        <p className="text-zinc-600">
          This is some information about the plans and their expected revenue
        </p>
      </div>
      <Info
        header="Plan Name"
        numSub="Number of Subscribers"
        rev="Monthly Revenue"
      />
      {props.plan_info.map((plan) => (
        <Info
          header={plan.planName}
          numSub={plan.numSubscribers.toLocaleString()}
          rev={plan.monthlyRevenue.toLocaleString() + " £"}
        />
      ))}
      <Info
        header="Total"
        numSub={total_subscribers.toLocaleString()}
        rev={total_revenue.toLocaleString() + " £"}
      />
    </div>
  );
}
