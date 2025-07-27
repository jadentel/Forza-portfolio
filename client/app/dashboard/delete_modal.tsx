'use client';
import React, { useState } from "react";
import { HandleDelete, HandleDownload } from "./actions";
import { useFormState } from "react-dom";

function DeleteButton() {
  return <button className="mx-5 p-3 rounded-xl bg-forza-400 hover:bg-forza-300 transition-all text-forza-100 font-bold">Delete Activity</button>
}

export default function DeleteModal(props: { activityID: any, token: any, activityName: String, modalState : any }) {

  const [modal_state, set_modal_state] = useState(true);
  const [state, form_action] = useFormState(HandleDelete, { success: false, message: "" });

  // INFO: disable scrolling by default when modal is open
  document.body.style.overflow = "hidden";

  // INFO: re-enable scrolling when closing
  var closeModal = () => {
    set_modal_state(!modal_state);
    props.modalState(!modal_state);
    document.body.style.overflow = "";
  }

  // INFO: in this case delete modal cannot be displayed, so display error
  if (!modal_state) {
    return <div>Error: {state.message}</div>
  }

  return <div className="flex justify-center items-center overscroll-contain">
    <div className="fixed inset-0 w-screen h-screen flex justify-center items-center backdrop-blur-sm backdrop-brightness-50">
      <form action={form_action} className="w-1/3 h-1/3 relative text-center bg-forza-100 rounded-xl">
        <h1 className="text-left p-8 font-bold text-xl">Deleting Activity - "{props.activityName}"</h1>
        <hr className="mx-4 h-px bg-forza-200 border-0"></hr>
        <div className="absolute left-0 p-8">
          <p className="text-left px-1">Once deleted, the activity cannot be recovered. Are you sure you want to delete this activity?</p>
        </div>
        <div className="absolute bottom-0 right-0 m-4 justify-around">
          <DeleteButton />
          <button onClick={(closeModal)} className="p-3 rounded-xl transition-all bg-forza-200 hover:bg-forza-300 text-forza-500 border-0 font-bold">Cancel</button>
        </div>
        <input name="activityID" type="hidden" value={props.activityID} />
        <input name="token" type="hidden" value={props.token} />
      </form>
    </div>
  </div>

}
