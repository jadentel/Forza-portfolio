'use client';

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import { HandleSubscribe } from "./actions";

import { SubscribeFormState } from "./actions";

export default function PlanSubscribeForm(props : { plan_id : string, subscribed : string } ) {
    const [state, action] = useFormState(HandleSubscribe, { success : false, message : "", stripeURL : ""});

    useEffect(() => {
        if (state.success) {
            window.location.href = state.stripeURL;
        }
    }, [state])

    return (
        <form action={action} className="w-full">
            <input type="hidden" value={props.plan_id} name="plan_id" />
            <input disabled={props.subscribed != ""} className="bg-forza-200 border-2 border-forza-500 rounded-md transition-colors disabled:bg-forza-200 hover:bg-forza-100 min-h-full min-w-full p-2" type="submit" value={ props.plan_id != props.subscribed ? "Subscribe" : "Current plan"} />
        </form>
    );
}