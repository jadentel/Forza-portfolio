import React, { useState } from "react";
import Friends from "./friends";
import UserInfo from "./user_info";
import Subscription from "./subscription";

interface UserInfoData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
}

export default function ViewSelector(props: {
  userInfoData: UserInfoData;
  userFriendList: Array<string>;
  userRequestList: Array<string>;
  viewing_user_id: string; // Which user is the profile looking at?
  logged_in_user_id: string; // which user is logged in?
  planID: string;
  csrf: string;
}) {
  const valid = props.viewing_user_id === props.logged_in_user_id;
  return (
    <>
      {props.viewing_user_id === props.logged_in_user_id ? (
        <div className="grid grid-rows-3 gap-4 md:grid-cols-2 md:grid-rows-2">
          {valid ? <UserInfo userInfo={props.userInfoData} /> : <></>}
          {valid ? (
            <Friends
              friends_list={props.userFriendList}
              requests_list={props.userRequestList}
              csrf={props.csrf}
            />
          ) : (
            <></>
          )}
          {valid ? <Subscription planID={props.planID} /> : <></>}
        </div>
      ) : (
        <div className="grid grid-rows-1">
          <UserInfo userInfo={props.userInfoData} />
        </div>
      )}
    </>
  );
}
