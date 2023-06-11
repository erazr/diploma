import { getUserDMs } from "api/handler/dm";
import { AccountBar } from "pages/Home/components/AccountBar";
import { useQuery } from "react-query";
import { FaUserFriends } from "react-icons/fa";
import { dmKey } from "utils/querykeys";
import DMPlaceholder from "./DMPlaceholder";
import DMListItem from "./DMListItem";
import { useNavigate } from "react-router-dom";
import useDMSocket from "api/ws/useDMSocket";

export const DMSidebar = () => {
  const { data } = useQuery(dmKey, () => getUserDMs().then((res) => res.data));

  useDMSocket();

  const navigate = useNavigate();

  return (
    <div className="col-[2] row-[1_/_4] box-border overflow-hidden bg-[#17212b]">
      <AccountBar />
      <div className="flex h-[100%] shrink-0 flex-col pt-4">
        <div
          className="flex shrink-0 flex-col-reverse justify-center gap-4 bg-[#17212b] px-[10px]"
          // borderBottom="0.02rem solid #101111"
        >
          <div
            className="flex h-[40px] items-center gap-2 rounded-[4px] py-2 pl-3 text-left font-['gg_Sans'] text-[#9ca3af] hover:cursor-pointer hover:bg-[#242f3d]"
            onClick={() => navigate("/channels/me")}
          >
            <FaUserFriends color="inherit" size="22px" />
            Достар
          </div>
          {/* <input
            className="w-full rounded-sm border-none bg-[#242f3d] px-3 py-[6px] text-[0.96rem] outline-none placeholder:text-[.96em]"
            placeholder="Search"
          /> */}
        </div>
        <div
          className="box-border flex flex-auto flex-col overflow-x-hidden overflow-y-scroll pl-[10px] pr-[2px] [scrollbar-color:#242f3d_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb:vertical:hover]:bg-[#2c394b] [&::-webkit-scrollbar-thumb]:bg-[#242f3d] [&::-webkit-scrollbar-track]:w-[6px] [&::-webkit-scrollbar-track]:bg-[inherit] [&::-webkit-scrollbar]:w-1"
          // boxShadow="inset 0 0.03rem 0.02rem 0.02rem #101111, inset 0.03rem 0 0.02rem 0.02rem #101111"
        >
          <p className="mb-2 ml-2 mt-4 max-w-fit font-['gg_Sans'] text-xs font-[500] uppercase tracking-wider text-[#9ca3af] hover:cursor-default hover:text-[#d3d5da]">
            тікелей хабарламалар
          </p>
          <ul className="ml-0 flex list-none flex-col gap-2">
            {data?.map((dm) => (
              <DMListItem key={dm._id} dm={dm} />
            ))}
            {data?.length === 0 && (
              <div>
                <DMPlaceholder op="1" />
                <DMPlaceholder op=".8" />
                <DMPlaceholder op=".6" />
                <DMPlaceholder op=".4" />
                <DMPlaceholder op=".2" />
                <DMPlaceholder op=".05" />
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
