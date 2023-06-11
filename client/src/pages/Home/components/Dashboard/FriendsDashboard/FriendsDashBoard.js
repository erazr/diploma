import React from "react";
import { useQuery } from "react-query";
import homeStore from "stores/homeStore";
import FriendsList from "./Friends/FriendList";
import FriendListHeader from "./FriendsHeader";
import PendingList from "./Pending/PendingList";
import { fKey, rKey } from "utils/querykeys";
import { getFriends, getPendingRequests } from "api/handler/account";

export default function FriendsDashBoard() {
  const isPending = homeStore((state) => state.isPending);
  const requests = useQuery(rKey, () =>
    getPendingRequests().then((res) => res.data)
  );
  const friends = useQuery(fKey, () => getFriends().then((res) => res.data));
  return (
    <>
      <FriendListHeader />
      <div className="col-[3] row-[2] flex overflow-y-auto bg-[#0e1621]">
        {isPending ? (
          <PendingList data={requests} />
        ) : (
          <FriendsList data={friends} />
        )}
      </div>
    </>
  );
}
