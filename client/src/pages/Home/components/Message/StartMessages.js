import React, { forwardRef, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import useGetCurrentChannel from "hooks/useGetCurrentChannel";
import { cKey } from "utils/querykeys";
import useGetCurrentDM from "hooks/useGetCurrentDM";

export default function StartMessages() {
  const { guildId } = useParams();

  return guildId === undefined ? <DMStartMessages /> : <ChannelStartMessages />;
}

function ChannelStartMessages() {
  const { guildId, channelId } = useParams();
  const channel = useGetCurrentChannel(channelId, cKey(guildId));

  return (
    <div className="mb-2 flex items-center justify-center">
      <div className="text-center text-[#d2d7d3]">
        <p className="text-lg">Welcome to #{channel?.name}</p>
        <p className="text-sm">
          This is the start of the #{channel?.name} channel
        </p>
      </div>
    </div>
  );
}

function DMStartMessages() {
  const { channelId } = useParams();
  const channel = useGetCurrentDM(channelId);

  return (
    <div className="m-4 ml-5">
      <div className="h-[80px] w-[80px] rounded-[50%]">
        <img
          src={channel?.user.avatar}
          className="h-[80px] w-[80px] rounded-[50%]"
        />
      </div>
      <h3 className="mt-2 font-['gg_sans'] text-2xl font-[600] text-[#d2d7d3]">
        {channel?.user.username}
      </h3>
      <p className="text-[#d2d7d3]">
        Бұл @{channel?.user.username} көмегімен тікелей хабарламалар тарихының
        басталуы
      </p>
      {/* <Divider mt={2} /> */}
    </div>
  );
}
