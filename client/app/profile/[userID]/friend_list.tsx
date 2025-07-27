import { FiUser } from "react-icons/fi";
import { FriendInfo } from "./friends";
import Link from "next/link";
import { RemoveFriendForm } from "./forms";

export default function FriendList(props: {
  friendsList: Array<FriendInfo>;
  csrf: string;
}) {
  return (
    <div className="flex flex-col gap-2 max-h-96 items-center justify-center overflow-y-auto border-t-2">
      {props.friendsList.map((friend) => (
        <div className="grid grid-cols-2 py-3 w-full px-4 hover:bg-stone-50 transition-all">
          <Link
            className="transition-all hover:underline decoration-2"
            href={`/profile/${friend.userID}`}
          >
            <div className="text-zinc-600 flex flex-row gap-4 items-center justify-start">
              <FiUser size="30" />
              {friend.username}
            </div>
          </Link>
          <div className="flex flex-row items-center justify-end">
            <RemoveFriendForm userID={friend.userID} csrf_token={props.csrf} />
          </div>
        </div>
      ))}
    </div>
  );
}
