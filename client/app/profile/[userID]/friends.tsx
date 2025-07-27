import React from "react";
import RequestList from "./request_list";
import FriendList from "./friend_list";
import { FiSearch } from "react-icons/fi";
import { SearchUserForm } from "./forms.tsx";

export interface FriendInfo {
  username: string;
  userID: string;
}

export default async function Friends(props: {
  friends_list: Array<string>;
  requests_list: Array<string>;
  csrf: string;
}) {
  // TODO: get infos of lists
  // but for now, dummy data
  let friends_req: Array<Promise<FriendInfo>> = props.friends_list.map(
    async (i) => {
      try {
        const resp = await fetch("http://backend-dev:5001/api/user/info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            APIKey: process.env.SECRET_KEY!,
          },

          body: JSON.stringify({
            userID: i,
          }),
        });

        if (!resp.ok) {
          return { username: "unknown", userID: "" };
        }

        const data = await resp.json();
        data.code = resp.status;

        return { username: data.user.username, userID: i };
      } catch (e: any) {
        return { username: "unknown", userID: "" };
      }
    },
  );

  let req_req: Array<Promise<FriendInfo>> = props.requests_list.map(
    async (i) => {
      try {
        const resp = await fetch("http://backend-dev:5001/api/user/info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            APIKey: process.env.SECRET_KEY!,
          },

          body: JSON.stringify({
            userID: i,
          }),
        });

        if (!resp.ok) {
          return { username: "unknown", userID: "" };
        }

        const data = await resp.json();
        data.code = resp.status;

        return { username: data.user.username, userID: i };
      } catch (e: any) {
        return { username: "unknown", userID: "" };
      }
    },
  );

  // Await all promises
  let friends = await Promise.all(friends_req);
  let requests = await Promise.all(req_req);

  return (
    <div className="flex flex-col bg-white border-zinc-400/40 border-2 shadow-xl rounded-xl overflow-x-auto w-full md:row-span-2">
      <div className="py-3 px-4 flex flex-col">
        <h2 className="text-left text-2xl text-zinc-900">
          Friends and Requests
        </h2>
        <SearchUserForm csrf_token={props.csrf} />
      </div>
      {friends.length == 0 ? (
        <div className="py-3 px-4 border-t-2 text-center text-lg text-zinc-600">
          You have no friends yet, add some! Use the search bar above.
        </div>
      ) : (
        <FriendList friendsList={friends} csrf={props.csrf} />
      )}
      {requests.length == 0 ? (
        <div className="py-3 px-4 border-t-2 text-center text-lg text-zinc-600">
          You have no friend requests, yet!
        </div>
      ) : (
        <RequestList requestsList={requests} csrf={props.csrf} />
      )}
    </div>
  );
}
