import { FiUser } from "react-icons/fi";
import { FriendInfo } from "./friends";
import { AcceptFriend, RejectFriend } from "./forms";
import Link from "next/link";

export default function RequestList(props: {
  requestsList: Array<FriendInfo>;
  csrf: string;
}) {
  return (
    <div className="flex flex-col gap-2 max-h-96 items-center justify-center overflow-y-auto border-t-2">
      {props.requestsList.map((request, index) => (
        <div
          key={index}
          className="grid grid-cols-2 py-3 w-full px-4 hover:bg-stone-50 transition-all"
        >
          <Link
            className="transition-all hover:underline decoration-2"
            href={`/profile/${request.userID}`}
          >
            <div className="text-zinc-600 flex flex-row gap-4 items-center justify-start">
              <FiUser size="30" />
              {request.username}
            </div>
          </Link>
          <div className="flex flex-row gap-3 items-center justify-end">
            <RejectFriend userID={request.userID} csrf_token={props.csrf} />
            <AcceptFriend userID={request.userID} csrf_token={props.csrf} />
          </div>
        </div>
      ))}
    </div>
  );
}
