"use server"

import { permanentRedirect } from "next/navigation";
import { GetUserID, IsLoggedIn } from "../session";
import { ZodError, z } from "zod";

import Stripe from 'stripe';
import { PlanInfo } from "./page";
const stripe = new Stripe(process.env.STRIPE_API_KEY!);

export interface SubscribeFormState {
    success : boolean;
    message : string;
    stripeURL : string;
}

export async function HandleSubscribe(old_state : SubscribeFormState, form_data : FormData) : Promise<SubscribeFormState> {
    // If not logged in redirect to login
    if (!await IsLoggedIn()) {
        permanentRedirect("/login");
    }

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
        if (data.user.planID != null && data.user.planID != 999) return { success : false, message : "User already subscribed to a plan", stripeURL: "" };
    }
    catch (e : any)
    {
        return { success : false, message : "Could not find user", stripeURL: "" };
    }

    // Validate form
    const schema = z.object({
        plan_id : z.string().min(1, "Plan ID is required."),
    });

    let data : any;

    try {
        data = schema.parse(Object.fromEntries(form_data.entries()));
    } catch (e) {
        if (e instanceof ZodError) {
            return { success : false, message : e.issues[0].message, stripeURL : "" };
        }

        return { success : false, message : "Server Error", stripeURL: "" };
    }
    
    // Get plan details
    let plan_data : PlanInfo = {} as PlanInfo;
    try {
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
            "planID" : data.plan_id
        })
        });

        if (!resp.ok) throw { success : false, message : "Failed to get plan info", stripeURL : ""};
        plan_data = await resp.json();
    } catch (e : any) {
        return { success : false, message : "Failed to get plan info", stripeURL : ""};
    }

    // Create a stripe session
    let session : any;
    try {
        session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data : 
                    {
                        currency : "gbp",
                        product_data : {
                            name : plan_data.planName,
                            description : "Purchase 1 month of Forza access"
                        },
                        unit_amount_decimal : (plan_data.monthlyPrice * 100).toFixed(2)
                    },
                    quantity : 1
                },
            ],
            mode: 'payment',
            success_url: "http://localhost:3000",
            cancel_url: "http://localhost:3000"
        });
    } catch (e : any) {
        return { success : false, message : "Error with stripe", stripeURL: "" }
    }

    // Notify the database of the payment
    try {
        console.log("b4");
        const resp = await fetch("http://backend-dev:5001/api/stripe/register",
        {
        method : "POST",
        headers :
        {
            "Content-Type" : "application/json",
            "Accept" : "application/json",
            "APIKey" : process.env.SECRET_KEY!
        },

        body : JSON.stringify({
            userID : user_id,
            planID : data.plan_id,
            stripePaymentID : session.id
        })
        });

        console.log(JSON.stringify({
            userID : user_id,
            planID : data.plan_id,
            stripePaymentID : session.id
        }))
        console.log(await resp.json());

        if (!resp.ok) return { success : false, message : "Server Error", stripeURL: "" };        

    } catch (e : any) {
        return { success : false, message : "Server error", stripeURL : ""}
    }

    return { success : true, message : "Success", stripeURL : session.url!};
}