import React from "react";
import FriendListItem from "./FriendListItem";

export default function FriendsList({ data }) {
  if (data.data?.length === 0) {
    return (
      <div className="flex w-full items-center justify-center">
        <p className="text-[#8696a8]">Достарды қосыңыз</p>
      </div>
    );
  }

  return (
    <>
      <ul className="ml-2 mt-2 w-full list-none">
        <p className="mx-3 mb-1 mt-3 w-[50%] text-[12px] uppercase tracking-wide text-[#8696a8]">
          {data.data?.length ? `Достар — ${data.data?.length}` : null}
        </p>
        {data.data?.map((friend) => (
          <FriendListItem key={friend._id} friend={friend} />
        ))}
      </ul>
    </>
  );
}
