import React, { useEffect } from "react";
import homeStore from "stores/homeStore";
import RequestListItem from "./RequestListItem";

export default function PendingList({ data }) {
  const reset = homeStore((state) => state.resetRequest);

  // useEffect(() => {
  //   reset();
  //   return () => {
  //     data.refetch();
  //   };
  // }, []);

  if (data.data?.length === 0) {
    return (
      <div
        justify={"center"}
        align={"center"}
        w={"full"}
        className="flex w-full items-center justify-center"
      >
        <p className="text-lg text-[#8696a8]">Қазірге күтуліде өтініштер жоқ</p>
      </div>
    );
  }

  return (
    <>
      <ul className="ml-2 mt-2 w-full list-none">
        <p className="mx-3 mb-1 mt-3 w-[50%] text-[12px] font-semibold uppercase text-[#8696a8]">
          {data.data?.length ? `Күтуліде — ${data.data?.length}` : null}
        </p>
        {data.data?.map((request) => (
          <RequestListItem key={request._id} request={request} />
        ))}
      </ul>
    </>
  );
}
