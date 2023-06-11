import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { useQueryClient } from "react-query";
import { closeDirectMessage } from "api/handler/dm";
import { dmKey } from "utils/querykeys";

export default function DMListItem({ dm }) {
  const currentPath = `/channels/me/${dm._id}`;
  const navigate = useNavigate();
  const location = useLocation();
  const cache = useQueryClient();
  const isActive = location.pathname === currentPath;
  const [showCloseButton, setShowButton] = useState(false);

  async function handleCloseDM(event) {
    event.preventDefault();
    await closeDirectMessage(dm._id);
    cache.setQueryData(dmKey, (d) => {
      return d?.filter((channel) => channel._id !== dm._id);
    });
    if (isActive) {
      navigate("/channels/me");
    }
  }

  return (
    <Link
      draggable={false}
      to={`/channels/me/${dm._id}`}
      className="select-none"
    >
      <li
        className={
          "hover:rounded-54px] pointer-events-auto select-none rounded-[5px] p-[6px] hover:cursor-pointer hover:bg-[#2c3a4d] hover:text-white" +
          (isActive ? " bg-[#242f3d] text-white" : "text-gray-400")
        }
        onMouseLeave={() => setShowButton(false)}
        onMouseEnter={() => setShowButton(true)}
      >
        <div className="flex items-center justify-between font-['gg_sans'] text-base font-[600]">
          <div className="flex items-center">
            <div draggable={false} className="max-w-[34px] rounded-[50%]">
              <img
                draggable={false}
                className="rounded-[50%]"
                src={dm.user.avatar}
              />
            </div>
            <p className="ml-2">{dm.user.username}</p>
          </div>
          {showCloseButton && (
            <IoMdClose size="20px" onClick={handleCloseDM} className="mr-1" />
          )}
        </div>
      </li>
    </Link>
  );
}
