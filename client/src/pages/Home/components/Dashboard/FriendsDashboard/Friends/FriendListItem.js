import React from "react";
import { FaEllipsisV } from "react-icons/fa";
import { useModal } from "hooks/useModal";
import RemoveFriendModal from "pages/Home/components/Modals/RemoveFriendModal";
import { getOrCreateDirectMessage } from "api/handler/dm";
import { useQueryClient } from "react-query";
import { dmKey } from "utils/querykeys";
import { useNavigate } from "react-router-dom";
import DMStore from "stores/DMStore";

export default function FriendListItem({ friend }) {
  const { isOpen, onOpen, onClose } = useModal();
  const cache = useQueryClient();
  const navigate = useNavigate();

  const store = DMStore();

  async function getDMChannel() {
    const { data } = await getOrCreateDirectMessage(friend._id);
    if (data) {
      cache.invalidateQueries(dmKey);
      store.setDM({ username: friend.username, _id: friend._id });
      navigate(`/channels/me/${data.id}`);
    }
  }
  return (
    <li
      className="group mx-3 p-3 hover:cursor-pointer hover:rounded-md hover:bg-[#2b3a49]"
      onClick={getDMChannel}
    >
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center hover:cursor-pointer">
          <div className="max-h-[36px] min-w-[36px] rounded-[50%]">
            <img
              src={friend.avatar}
              alt="avatar"
              className="w-[36px] rounded-[50%]"
            />
          </div>
          <p className="ml-2">{friend.username}</p>
        </div>
        <div
          className="flex h-[45px] w-[45px] items-center justify-center rounded-[50%] bg-[#17212b] text-[#ffffff94] hover:text-[#ffffffc7] group-hover:bg-[#161d25]"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        >
          <FaEllipsisV size="18px" color="inherit" />
        </div>
      </div>
      <RemoveFriendModal friend={friend} isOpen={isOpen} onClose={onClose} />
    </li>
  );
}
