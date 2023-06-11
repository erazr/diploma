import React from "react";
import { BiCheck } from "react-icons/bi";
import { VscChromeClose } from "react-icons/vsc";
import { useQueryClient } from "react-query";
import { fKey, rKey } from "utils/querykeys";
import { acceptFriendRequest, declineFriendRequest } from "api/handler/account";

export default function RequestListItem({ request }) {
  const cache = useQueryClient();
  console.log(request);
  const acceptRequest = async () => {
    const { data } = await acceptFriendRequest(request._id);
    console.log(request._id);
    if (data) {
      cache.setQueryData(rKey, (d) => {
        return d?.filter((r) => r._id !== request._id);
      });
      await cache.invalidateQueries(fKey);
    }
  };

  const declineRequest = async () => {
    const { data } = await declineFriendRequest(request._id);
    if (data) {
      cache.setQueryData(rKey, (d) => {
        return d?.filter((r) => r._id !== request._id);
      });
    }
  };

  return (
    <li className="group mx-3 p-3 hover:cursor-pointer hover:rounded-md hover:bg-[#2b3a49]">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="max-h-[36px] min-w-[36px] rounded-[50%]">
            <img
              src={request.avatar}
              alt="avatar"
              className="w-[36px] rounded-[50%]"
            />
          </div>
          <div className="ml-2">
            <p>{request.username}</p>
            <p className="text-xs">
              {request.type === 1
                ? "Incoming Friend Request"
                : "Outgoing Friend Request"}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {request.type === 1 && (
            <div
              className="flex h-[42px] w-[42px] items-center justify-center rounded-[50%] bg-[#17212b] hover:text-[#4295ff] group-hover:bg-[#161d25]"
              onClick={acceptRequest}
            >
              <BiCheck size="32px" color="inherit" />
            </div>
          )}
          <div
            className="ml-3 flex h-[42px] w-[42px] items-center justify-center rounded-[50%] bg-[#17212b] hover:text-[#b93d3d] group-hover:bg-[#161d25]"
            onClick={declineRequest}
          >
            <VscChromeClose size="22px" color="inherit" />
          </div>
        </div>
      </div>
    </li>
  );
}
