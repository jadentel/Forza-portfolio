import React from "react";

export function Info(props: { values: string[] , header: string}) {
  return (
    <div className="grid grid-cols-4 border-t-2">
      {props.values.map((value) => (
        <div className="px-6 bg-white py-3 w-full min-h-11">
          <span className="px-3">{value}</span>
        </div>
      ))}
    </div>
  );
}

export default async function PlanInfo(props: { plans: any[] }) {
  return (
    <div className="flex flex-col bg-white border-zinc-400/40 border-2 shadow-xl rounded-xl w-full col-span-2">
      <div className="flex flex-col py-3 px-6">
        <h2 className="text-left text-2xl text-zinc-900">
          Plan Information Data
        </h2>
        <p className="text-zinc-600">
          This is some information about the plans that are available for users
        </p>
      </div>
      <Info
        values={[
          "Plan Name",
          "Monthly Price",
          "Weekly Activities",
          "Friends Allowed",
        ]}
      />
      {props.plans.map((plan) => (
        <Info
          values={[
            plan.planName,
            plan.monthlyPrice + " £",
            plan.weeklyActivities == "-1" ? "Unlimited": plan.weeklyActivities,
            plan.friendsAllowed != "true" ? "Yes": "No",
          ]}
        />
      ))}
    </div>
  );
}
