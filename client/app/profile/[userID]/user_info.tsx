import React from "react";

export function Info(props: { header: string; data: string }) {
  return (
    <div className="grid grid-cols-3 border-t-2">
      <h1 className="text-zinc-500 px-6 py-4">{props.header}</h1>
      <div className="px-6 col-span-2 bg-white py-3 w-full min-h-11">
        <span className="px-3">{props.data}</span>
      </div>
    </div>
  );
}

// component to view the user data
// TODO: make it editable for  user
export default function UserInfo(props: { userInfo: any }) {
  return (
    <div className="flex flex-col bg-white border-zinc-400/40 border-2 shadow-xl rounded-xl overflow-x-auto w-full">
      <div className="flex flex-col py-3 px-6">
        <h2 className="text-left text-2xl text-zinc-900">User Profile</h2>
        <p className="text-zinc-600">
          This is some information about <span>{props.userInfo.username}</span>
        </p>
      </div>
      <Info header="Username" data={props.userInfo.username} />
      <Info header="First Name" data={props.userInfo.firstName} />
      <Info header="Last Name" data={props.userInfo.lastName} />
      <Info header="Email" data={props.userInfo.email} />
      <Info header="Bio" data={props.userInfo.bio} />
    </div>
  );
}
