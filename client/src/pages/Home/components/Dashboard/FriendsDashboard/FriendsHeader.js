import React from "react";
import { FiUsers } from "react-icons/fi";
import homeStore from "stores/homeStore";
import { useModal } from "hooks/useModal";
import AddFriendModal from "pages/Home/components/Modals/AddFriendModal";

export default function FriendsHeader() {
  const { isOpen, onOpen, onClose } = useModal();
  const toggle = homeStore((state) => state.toggleDisplay);
  const isPending = homeStore((state) => state.isPending);
  const requests = homeStore((state) => state.requestCount);
  return (
    <div className="col-[3] row-[1] h-[54px] bg-[#17212b] shadow-[inset_1px_0_1px_-1px_#000]">
      <div className="flex h-full items-center justify-between">
        <div className="flex h-full items-center px-4 font-['gg_sans'] text-base">
          <FiUsers size="21px" />
          <p className="pointer-events-none ml-3 mr-5">Достар</p>
          <button
            onClick={() => {
              if (isPending) toggle();
            }}
            className={
              "ml-3 rounded-[4px] px-[11px] py-[1px] hover:bg-[#242f3d] " +
              (!isPending ? "bg-[#2b3a49]" : "")
            }
          >
            Барлық
          </button>
          <button
            onClick={() => {
              if (!isPending) toggle();
            }}
            className={
              "ml-4 rounded-[4px] px-[11px] py-[1px] hover:bg-[#242f3d] " +
              (isPending ? "bg-[#2b3a49]" : "")
            }
          >
            Күтуліде
            {/* {requests > 0 && <PingIcon count={requests} />} */}
          </button>
          <button
            onClick={() => {
              onOpen();
            }}
            className="ml-4 rounded-[4px] bg-[#4295ff] px-[11px] py-[1px] hover:bg-[#397fda] active:bg-[#348bfd]"
          >
            Дос қосу
            {/* {requests > 0 && <PingIcon count={requests} />} */}
          </button>
        </div>
      </div>
      <AddFriendModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
