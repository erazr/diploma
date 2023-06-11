import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import DMStore from "stores/DMStore";
import userStore from "stores/userStore";
import { gKey } from "utils/querykeys";

export default function GuildListItem({ guild, isActive, setActive }) {
  const dmStore = DMStore();

  const cache = useQueryClient();

  const current = userStore();

  useEffect(() => {
    if (dmStore.newMessages.length >= 1 && dmStore.newMessages.length === 0) {
      cache.setQueryData(gKey, (d) => {
        d = d.filter((g) => g._id !== guild._id);
        return d;
      });
    }
  }, [dmStore.newMessages]);

  return (
    <div
      id={`server_${guild._id}`}
      className="relative mt-[8px] flex h-[46px] items-center justify-center"
    >
      <Link
        to={
          guild.fake
            ? `/channels/me/${guild._id}`
            : `/channels/${guild._id}/${guild.default_channel_id}`
        }
      >
        <div
          onClick={() => {
            setActive(guild._id);
          }}
          className={
            "group flex max-h-[46px] max-w-[46px] flex-col items-center justify-center overflow-hidden bg-[#242f3d] text-[#4295ff] transition-[border-radius] duration-150 hover:cursor-pointer hover:rounded-[35%] " +
            (isActive === guild._id ? "rounded-[35%]" : "rounded-[50%]")
          }
        >
          <img
            className="h-[46px] w-[46px] rounded-[inherit]"
            src={guild.icon}
          />
          <span
            className="absolute left-0 h-0 w-0 rounded-[25%] bg-[#fff] opacity-0 transition-[width_height] 
          group-hover:h-[55%] group-hover:w-[4px] group-hover:rounded-[0_8px_8px_0] group-hover:opacity-100 
          "
            style={
              isActive === guild._id
                ? {
                    opacity: "1",
                    borderRadius: "0 8px 8px 0",
                    width: "4px",
                    height: "80%",
                  }
                : null
            }
          ></span>
          {guild.fake && dmStore.newMessages.length > 0 && (
            <span
              className={
                "absolute bottom-0 right-[12px] flex h-4 w-4 items-center justify-center rounded-[50%] bg-[#c93d3d] font-['gg_Sans'] text-xs font-[500] text-[#dadada]"
              }
            >
              {dmStore.newMessages.length}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
