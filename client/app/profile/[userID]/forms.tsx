"use client";

import { useFormState } from "react-dom";
import { FiUser } from "react-icons/fi";
import Link from "next/link";
import {
  AcceptFriendRequest,
  FriendRequest,
  RejectFriendRequest,
  RemoveFriend,
  UnsubscribePlan,
  SearchUserFormState,
  SearchUser,
} from "./actions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// this file contains client side components
// *forms for the profile page

export function SearchUserForm(props: { csrf_token: string }) {
  const [state, action] = useFormState(SearchUser, {
    message: "",
    success: false,
    users: [],
  });

  return (
    <>
      <form action={action}>
        <input
          className="w-full px-2 py-1 border-2 border-zinc-400/40 rounded-md text-zinc-900"
          type="text"
          placeholder="Search User"
          name="query"
          required
        />
        <input type="hidden" value={props.csrf_token} name="csrf" />
      </form>
      {state.message === "" ? (
        <div></div>
      ) : state.success == true ? (
        <div className="flex flex-col gap-2 items-center justify-center">
          {state.users.map((user) => (
            <div
              className="grid grid-cols-2 py-3 w-full px-4 hover:bg-stone-50 transition-all"
              key={user.userID}
            >
              <Link
                className="transition-all hover:underline decoration-2"
                href={`/profile/${user.userID}`}
              >
                <div className="text-zinc-600 flex flex-row gap-4 items-center justify-start">
                  <FiUser size="30" />
                  {user.username}
                </div>
              </Link>
              <div className="flex flex-row items-center justify-end">
                <AddFriend
                  small="true"
                  userID={user.userID}
                  csrf_token={props.csrf_token}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Error: {state.message}</p>
      )}
    </>
  );
}

const buttonStyle =
  "transition-all py-2 px-2 bg-zinc-100 hover:bg-zinc-300 hover:rounded-sm active:bg-zinc-500 hover:shadow-sm";
const buttonStyleSuccess = "transition-all py-2 px-2 bg-forza-100";
const buttonStyleError = "transition-all py-2 px-2 bg-red-100";

// UnSubscribe button
export function UnsubscribeButton(props: { csrf_token: string }) {
  const [state, action] = useFormState(UnsubscribePlan, {
    message: "",
    success: false,
  });

  // This causes the page to refresh when the server action was successful
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state]);

  return (
    <form className="flex flex-row justify-center items-center" action={action}>
      {state.message === "" ? (
        <input className={buttonStyle} type="submit" value="Unsubscribe" />
      ) : state.success == true ? (
        <input
          className={buttonStyleSuccess}
          type="submit"
          value={state.message}
        />
      ) : (
        <input
          className={buttonStyleError}
          type="submit"
          value={state.message}
        />
      )}
      <input type="hidden" value={props.csrf_token} name="csrf" />
    </form>
  );
}

// Add friend button
export function AddFriend(props: {
  small: string;
  userID: string;
  csrf_token: string;
}) {
  const [state, action] = useFormState(FriendRequest, {
    message: "",
    success: false,
  });

  // This causes the page to refresh when the server action was successful
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state]);

  return (
    <form action={action}>
      {state.message === "" ? (
        <input
          className={
            props.small == "true"
              ? buttonStyle
              : "transition-all border-2 border-zinc-900 rounded-sm border-zinc-800 py-2 px-2 bg-zinc-100 hover:bg-zinc-300 hover:rounded-lg active:bg-zinc-500 hover:shadow-sm text-2xl"
          }
          type="submit"
          value="Add Friend"
        />
      ) : state.success == true ? (
        <input
          className={
            props.small == "true"
              ? buttonStyleSuccess
              : "transition-all border-2 border-zinc-900 rounded-sm border-zinc-800 py-2 px-2 bg-forza-100 hover:bg-zinc-300 hover:rounded-lg active:bg-zinc-500 hover:shadow-sm text-2xl"
          }
          type="submit"
          value={state.message}
        />
      ) : (
        <input
          className={
            props.small == "true"
              ? buttonStyleSuccess
              : "transition-all border-2 border-zinc-900 rounded-sm border-zinc-800 py-2 px-2 bg-red-100 hover:bg-zinc-300 hover:rounded-lg active:bg-zinc-500 hover:shadow-sm text-2xl"
          }
          type="submit"
          value={
            state.message == "Failed to send friend request"
              ? "Already Friends"
              : state.message
          }
        />
      )}
      <input type="hidden" value={props.csrf_token} name="csrf" />
      <input type="hidden" value={props.userID} name="userID" />
    </form>
  );
}

// view buton
function viewButton(props: {
  state: AcceptFriendRequest | FriendRequest | RemoveFriend;
  text: string;
}) {
  return (
    <form action={props.state}>
      <input className={buttonStyle} type="submit" value={props.text} />
    </form>
  );
}

// Accept friend button
export function AcceptFriend(props: { userID: string; csrf_token: string }) {
  const [state, action] = useFormState(AcceptFriendRequest, {
    message: "",
    success: false,
  });

  // This causes the page to refresh when the server action was successful
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state]);

  return (
    <form action={action}>
      <input className={buttonStyle} type="submit" value="Add Friend" />
      <input type="hidden" value={props.csrf_token} name="csrf" />
      <input type="hidden" value={props.userID} name="userID" />
    </form>
  );
}

// reject friend button
export function RejectFriend(props: { userID: string; csrf_token: string }) {
  const [state, action] = useFormState(RejectFriendRequest, {
    message: "",
    success: false,
  });

  // This causes the page to refresh when the server action was successful
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state]);

  return (
    <form action={action}>
      <input className={buttonStyle} type="submit" value="Reject" />
      <input type="hidden" value={props.csrf_token} name="csrf" />
      <input type="hidden" value={props.userID} name="userID" />
    </form>
  );
}

// Remove friend button
export function RemoveFriendForm(props: {
  userID: string;
  csrf_token: string;
}) {
  const [state, action] = useFormState(RemoveFriend, {
    message: "",
    success: false,
  });

  // This causes the page to refresh when the server action was successful
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state]);

  return (
    <form action={action} className="">
      <input className={buttonStyle} type="submit" value="Remove Friend" />
      <input type="hidden" value={props.csrf_token} name="csrf" />
      <input type="hidden" value={props.userID} name="userID" />
    </form>
  );
}
