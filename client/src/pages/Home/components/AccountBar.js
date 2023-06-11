import { FaMicrophone } from "react-icons/fa";
import { RiHeadphoneFill } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";
import { BsPeopleFill } from "react-icons/bs";
import userStore from "stores/userStore";
import { useModal } from "hooks/useModal";
import AccountSettingsModal from "pages/Home/components/Modals/AccountSettingsModal";
import { useQueryClient } from "react-query";
import { aKey } from "utils/querykeys";

export const AccountBar = () => {
  const cache = useQueryClient();
  const data = cache.getQueryData(aKey);
  const user = userStore((state) => state.current);

  const { isOpen, onOpen, onClose } = useModal();

  return (
    <div className="flex h-[54px] w-full shrink-0 items-center py-2 pl-[14px] pr-[10px] shadow-[0_0.5px_#000000c4]">
      <div className="flex grow items-center">
        <div className="pointer-events-none max-h-[40px] max-w-[40px] rounded-[50%]">
          <img
            src={data?.avatar || user.avatar}
            alt="avatar"
            className="w-[40px] rounded-[50%]"
          />
        </div>
        <div className="pointer-events-none ml-3 font-['gg_sans'] text-base font-[600]">
          <p>{data?.username || user.username}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* <div
          onClick={() => {
            onOpen();
          }}
          className="flex h-[28px] w-[28px] items-center justify-center rounded-md hover:cursor-pointer hover:bg-[#242f3d]"
        >
          <BsPeopleFill size="65%" color="#ccd6e6" />
        </div> */}
        <div
          onClick={() => {
            onOpen();
          }}
          className="flex h-[28px] w-[28px] items-center justify-center rounded-md hover:cursor-pointer hover:bg-[#242f3d]"
        >
          <IoIosSettings size="75%" color="#ccd6e6" />
        </div>
      </div>
      <AccountSettingsModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
