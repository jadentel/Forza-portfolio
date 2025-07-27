import React, { use } from "react";
import Navbar from "../components/navbar";
import WaveBackground from "../components/wave";
import { permanentRedirect } from "next/navigation";
import { GetCsrfToken, GetUserID, IsLoggedIn } from "../session";
import PlanTable from "./plan_table";
import PlanInfo from "./plan_info";
import FinData from "./fin_data";

// ====== tests ======

// ====== types ======

// Includes planID
export interface PlanInfo {
  planID: string; // Keeping planid here just in case
  numSubscribers: number;
  monthlyRevenue: number;
  planName: string;
}

async function AdminDisplay() {
  // Get info
  let plans: PlanInfo[] = [];
  try {
    const resp = await fetch(`http://backend-dev:5001/api/admin/finance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        APIKey: process.env.SECRET_KEY!,
      },
    });

    if (!resp.ok) throw "Error getting finance data";

    let data = await resp.json();
    plans = data.data;
  } catch (e: any) {
    console.log("AAAAAAAAAAAAAAAAAAA");
    // TODO: Error display
    return <p>Something went wrong</p>;
  }

  let apiPlanData: any[] = [];

  // Get full info on plans
  for (let i = 0; i < plans.length; i++) {
    try {
      const resp = await fetch(`http://backend-dev:5001/api/plan/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          APIKey: process.env.SECRET_KEY!,
        },
        body: JSON.stringify({
          planID: plans[i].planID,
        }),
      });

      if (!resp.ok) throw "Error getting finance data";

      let data = await resp.json();
      apiPlanData.push(data);
      plans[i].planName = data.planName;
    } catch (e: any) {
      plans[i].planName = "Error";
    }
  }

  // From the Full plans calculate the monthlyRevenue
  let monthly_revenue = 0;
  for (let i = 0; i < plans.length; i++) {
    monthly_revenue += plans[i].monthlyRevenue;
  }

  console.log("API PLAN DATA", apiPlanData);

  return (
    <div className="grid md:grid-cols-2 gap-4 grid-rows-2">
      <PlanTable plan_info={plans} />
      <FinData monthly_revenue={monthly_revenue} />
      <PlanInfo plans={apiPlanData} />
    </div>
  );
}

export default async function Admin() {
  // Check if admin is logged in
  if (await IsLoggedIn()) {
    let userID = await GetUserID();

    // Its easier to check for user id
    if (userID !== "1") {
      permanentRedirect("/");
    }
  } else {
    permanentRedirect("/");
  }

  return (
    <div>
      <WaveBackground />
      <div className="relative z-50 h-screen flex flex-col">
        <Navbar white_text={false} />
        <div className="flex flex-col gap-10 items-center justify-around mx-5 md:mx-10 mb-10">
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-600">
            Admin Panel
          </h1>
          <AdminDisplay />
        </div>
      </div>
    </div>
  );
}
