import { useQuery } from "react-query";
import { getUserGuilds } from "api/handler/guild";
import { HomeIcon } from "pages/Home/components/HomeIcon";
import { gKey } from "utils/querykeys";
import { AddGuildModal } from "./Modals/AddGuildModal";
import { useModal } from "hooks/useModal";
import { AddGuildIcon } from "./AddGuildIcon";
import useGuildSocket from "api/ws/useGuildSocket";
import GuildListItem from "./GuildListItem";
import { useState } from "react";

export const GuildList = () => {
  const { data } = useQuery(gKey, () =>
    getUserGuilds().then((res) => res.data)
  );

  const { isOpen, onOpen, onClose } = useModal();

  useGuildSocket();

  const [isActive, setActive] = useState();

  return (
    <div className="col-[1] row-[1_/_4] flex flex-col overflow-y-auto bg-[#17212b] shadow-[inset_-1.2px_0_1.2px_-1.2px_#000000c4] [scrollbar-width:none] [&::-webkit-scrollbar]:w-0">
      <HomeIcon isActive={isActive} setActive={setActive} />
      <div className="mx-auto mt-[8px] h-[2px] w-[34px] bg-[#2b3a4d]"></div>
      <ul className="ml-0 list-none">
        {data?.map((guild) => (
          <GuildListItem
            key={guild._id}
            guild={guild}
            isActive={isActive}
            setActive={setActive}
          />
        ))}
      </ul>
      {/* <BurgerIcon sidebarOnOpen={sidebarOnOpen} />
      <SidebarDrawer
        sidebarIsOpen={sidebarIsOpen}
        sidebarOnClose={sidebarOnClose}
      /> */}
      <AddGuildIcon onOpen={onOpen} isOpen={isOpen} />
      <AddGuildModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
