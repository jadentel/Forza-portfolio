'use client';
import React, { useState } from "react";
import { useFormState } from "react-dom";
import { HandleUpload } from "./actions";

function UploadButton() {
  return <button className="mx-5 p-3 rounded-xl bg-forza-400 hover:bg-forza-300 transition-all text-forza-100 font-bold">Upload</button>
}

export default function DashModal(props: { token: string }) {

  const [modal_state, set_modal_state] = useState(false);
  const [state, form_action] = useFormState(HandleUpload, { success: false, message: "" });

  // INFO: disable scrolling when modal is open
  var openModal = () => {
    document.body.style.overflow = modal_state ? "" : "hidden";
    set_modal_state(!modal_state);
  }

  // INFO: hide the modal if the user has not prompted to add an activity
  if (!modal_state) {
    return <div className="flex justify-center items-center">
      <button type="button" onClick={(openModal)} className="p-3 m-3 rounded-xl transition-all bg-forza-200 hover:bg-forza-100 text-forza-500 font-bold">Upload Activity</button>
    </div>
  }

  return <div className="flex justify-center items-center overscroll-contain">
    <button type="button" className="p-3 m-3 rounded-xl transition-all bg-forza-200 hover:bg-forza-100 text-forza-500 font-bold">Upload Activity</button>

    <div className="fixed inset-0 w-screen h-screen flex justify-center items-center backdrop-blur-sm backdrop-brightness-50">
      <form action={form_action} className="w-1/2 h-1/2 relative text-center bg-forza-100 rounded-xl">
        <h1 className="text-left p-8 font-bold text-xl">Upload file</h1>
        <hr className="mx-4 h-px bg-forza-200 border-0"></hr>
        <div className="absolute left-0 p-8">
          <input name="activity_data" accept=".gpx" className="flex cursor-pointer file:p-2 file:cursor-pointer file:bg-forza-500 file:text-forza-100 text-forza-500 file:font-bold bg-forza-200 file:border-0 border-0 shadow-xl rounded" type="file" required></input>
          <p className="text-left px-1">Select GPX date to upload</p>
          <div className="absolute left-0 py-5 px-8">
            <input name="activity_name" type="text" placeholder="Activity Name" className="my-5 p-1 bg-forza-100 border-2 border-forza-500 rounded placeholder:text-forza-200 shadow-xl" required />
            <div className="flex justify-between w-3/4">
              <input name="is_private" className="w-8 h-8 appearance-none rounded-3xl transition-all bg-forza-100 checked:bg-forza-300 border-2 border-forza-500" type="checkbox"></input>
              <p className="font-bold my-1">Private activity</p>
            </div>
            <p className="my-1">{state.message}</p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 m-4 justify-around">
          <UploadButton />
          <button onClick={(openModal)} className="p-3 rounded-xl transition-all bg-forza-200 hover:bg-forza-300 text-forza-500 border-0 font-bold">Cancel</button>
        </div>
        <input name="token" type="hidden" value={props.token} />
      </form>
    </div>
  </div>
}
