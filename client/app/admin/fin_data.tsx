import React from "react";



function DataPoint(props: { label: string; value: number }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-center text-xl text-zinc-900 border-b-2 border-b-zinc-900">
        {props.label}
      </h1>
      <h1 className="text-center text-4xl text-zinc-900">
        {/* Locale string formats it with "," */}
        {props.value.toLocaleString()}{" "}
        <span className="text-forza-300 text-2xl">£</span>
      </h1>
    </div>
  );
}

export default async function FinData(props: { monthly_revenue: number }) {
  return (
    <div className="flex flex-col bg-white border-zinc-400/40 border-2 shadow-xl rounded-xl overflow-x-auto w-full">
      <div className="flex flex-col py-3 px-6">
        <h2 className="text-left text-2xl text-zinc-900">Revenue Forecast</h2>
        <p className="text-zinc-600">
          The following is a forecast of the revenue that can be expected from
          the Subscribers of the service.
        </p>
      </div>
      <div className="border-t-2 grid grid-cols-2 gap-14 py-8 px-6">
        <DataPoint label="Monthly" value={props.monthly_revenue} />
        <DataPoint label="Quarterly" value={props.monthly_revenue * 3} />
        <DataPoint label="First Half" value={props.monthly_revenue * 6} />
        <DataPoint label="Annual" value={props.monthly_revenue * 12} />
      </div>
    </div>
  );
}
