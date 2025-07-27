'use client';
import "leaflet/dist/leaflet.css";

import React, { useState } from "react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { BiRun } from "react-icons/bi";
import { MapContainer, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import { RoutePoint } from "../dashboard/dashboard_table";
import { PostType } from "./page";

export function FeedTable(props: { activities: PostType[], token: any, userID: any }) {

  // INFO: customisation to pass to map display, so that we can distinguish it from dashboard
  const map_icon = new Icon({
    iconUrl: "/blue.svg",
    iconSize: [38, 38]
  });
  const line_options = {
    color: 'CornflowerBlue'
  }

  // INFO: headers to display on feed table
  const headers = ["Selected", "Username", "Activity Name", "Activity Number", "Duration (s)", "Distance (m)", "Avg Speed (m/s)"];

  // INFO: state for the table entries
  const [table_state, set_table_state] = useState(Array<boolean>(props.activities.length));
  const [show_selected_button, set_selected_button] = useState(true);
  const [search_input, set_search_input] = useState("");

  // INFO: change state to filter results based on input from HTML
  const handleSearchInput = (event: any) => {
    var search: any = event.target.value;
    set_search_input(search);
  }

  // INFO: for select and deselect all
  var toggleSelectedButton = () => {
    set_table_state([...table_state.fill(show_selected_button)]);
    set_selected_button(!show_selected_button);
  };

  var activities_origin;

  // INFO: if the user currently has no added friends, prompt them to go to the profile page
  if (props.activities.length == 0) {
    return <div className="flex flex-col items-center justify-center">
      <BiRun size={400} />
      <h1 className="text-4xl text-center font-bold m-5 pt-5">Together, we go further.</h1>
      <h2 className="text-2xl text-center m-5">Connect with others to celebrate your journeys together.</h2>
      <Link type="button" href={`/profile/${props.userID}`} className="m-3 py-3 px-5 font-bold bg-forza-200 hover:bg-forza-100 transition-all rounded-xl">Start Here</Link>
    </div>
  }
  else {
    // INFO: the origin of an activity would be point of first activity given
    activities_origin = props.activities[0].route.waypoints[0];
  }
  return (
    <div>
      <div className="flex-row items-center justify-center">
        <h1 className="text-5xl text-center text-forza-500 font-bold mb-10">User Feed</h1>
        <MapContainer className="rounded-xl shadow-xl" center={[activities_origin.lat, activities_origin.lon]} zoom={13}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors, &copy; CARTO'
            url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
          />
          {props.activities.filter(route => (route.activityName.startsWith(search_input)) || (search_input === "")).map((activity, index) => (
            <RoutePoint activity={activity} selected={table_state[index]} activityNumber={index} searchInput={search_input} mapIcon={map_icon} lineOptions={line_options} userName={activity.username}  />
          ))}
        </MapContainer>
      </div>
      <div className="flex items-center justify-center pt-8">
        {show_selected_button && (
          <button onClick={(toggleSelectedButton)} type="button" className="m-6 py-3 px-8 rounded-xl transition-all bg-forza-200 hover:bg-forza-100 text-forza-500 font-bold">Select All</button>
        )}
        {!show_selected_button && (
          <button onClick={(toggleSelectedButton)} type="button" className="m-6 py-3 px-6 rounded-xl transition-all bg-forza-200 hover:bg-forza-100 text-forza-500 font-bold">Deselect All</button>
        )}
        <div className="relative">
          <div className="text-forza-500 absolute m-2"><FiSearch size="30"></FiSearch></div>
          <input type="text" value={search_input} onChange={handleSearchInput} placeholder="Search for an activity" className="p-2 rounded-xl bg-transparent border-2 border-forza-500 pl-12 outline-none"></input>
        </div>
      </div>
      <table className="table-auto overflow-auto border-separate border-spacing-y-8">
        <thead>
          <tr className="m-6">
            {headers.map((header) => (
              <th className="xl:px-10 px-4">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {props.activities.filter(route => (route.activityName.startsWith(search_input)) || (search_input === "")).map((route, index) => (
            <tr className="shadow-xl">
              <td className="xl:px-14 px-8 rounded-l-xl border-forza-500 border-t-2 border-b-2 border-l-2">
                <input checked={table_state[index]} onChange={() => { let n = table_state; n[index] = !n[index]; set_table_state([...n]) }} type="checkbox" className="w-8 h-8 flex items-center justify-center appearance-none rounded-3xl transition-all bg-forza-100 checked:bg-forza-300 border-2 border-forza-500"></input>
              </td>
              <td className="py-10 text-center border-forza-500 border-t-2 border-b-2">{route.username}</td>
              <td className="py-10 text-center border-forza-500 border-t-2 border-b-2">{route.activityName}</td>
              <td className="py-10 text-center border-forza-500 border-t-2 border-b-2">{index + 1}</td>
              <td className="py-10 text-center border-forza-500 border-t-2 border-b-2">{route.duration > 0 ? route.duration.toString() : 'N/A'}</td>
              <td className="py-10 text-center border-forza-500 border-t-2 border-b-2">{route.distance.toPrecision(4).toString()}</td>
              <td className="py-10 text-center rounded-r-xl border-forza-500 border-t-2 border-b-2 border-r-2">{(route.distance / route.duration).toString() === "Infinity" ? 'N/A' : (route.distance / route.duration).toPrecision(3).toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
