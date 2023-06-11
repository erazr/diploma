import { HiUsers } from "react-icons/hi";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useParams } from "react-router-dom";
import useGetCurrentDM from "hooks/useGetCurrentDM";
import DMStore from "stores/DMStore";
import { useState } from "react";

export const DMHeader = () => {
  const { channelId } = useParams();
  const channel = useGetCurrentDM(channelId);

  const user = DMStore((state) => state.DM);

  return (
    <div className="col-[3] row-[1] flex h-[54px] items-center bg-[#17212b] shadow-[inset_1px_0_1px_-1px_#000]">
      <div className="flex h-[35px] flex-auto items-center pl-5">
        <div className="flex h-full items-center text-[0.93rem]">
          <MdOutlineAlternateEmail size="24px" color="#567396" />
          <p className="ml-2 cursor-pointer font-['gg_sans'] text-base font-[600]">
            {user.username ? user.username : channel?.user.username}
          </p>
          {/* <div className="h-full w-[1px] bg-[#344458]"></div> */}
        </div>
      </div>
    </div>
  );
};
