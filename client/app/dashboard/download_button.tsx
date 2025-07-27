'use client';
import { useFormState } from "react-dom";
import { HandleDownload } from "./actions";
import { ActivityType } from "./dashboard_table";
import { FiDownload } from "react-icons/fi";
import { saveAs } from 'file-saver';

export default function DownloadButton(props: { route: ActivityType, token: any }) {
  const [state, form_action] = useFormState(HandleDownload, { success: false, message: "", downloadData: "" });

  // INFO: upon a successful POST request, we can initiate the download
  if(state.success){
    const file = new Blob([state.downloadData], { type: 'application/gpx+xml' });
    saveAs(file, props.route.activityName + '.gpx');

    // INFO: needs to be set to false to prevent redownload
    state.success = false;
  }

  return <div>
    <form>
      <button formAction={form_action} className="border-forza-500 transition-all rounded-full bg-forza-200 hover:bg-forza-100 p-2">
        <FiDownload size={30} />
      </button>
      <input name="activityID" type="hidden" value={props.route.activityID} />
      <input name="activityName" type="hidden" value={props.route.activityName} />
      <input name="token" type="hidden" value={props.token} />
    </form>
  </div>
}
