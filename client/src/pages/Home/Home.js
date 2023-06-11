import { useParams } from "react-router-dom";
import FriendsDashBoard from "pages/Home/components/Dashboard/FriendsDashboard/FriendsDashBoard";
import { DMHeader } from "pages/Home/components/Dashboard/DMDashboard/DMHeader";
import { DMSidebar } from "pages/Home/components/Dashboard/DMDashboard/DMSidebar";
import { HomeLayout } from "pages/Home/HomeLayout";
import { GuildList } from "pages/Home/components/GuildList";
import ChatScreen from "./components/Chat/ChatScreen";

export const AppPage = () => {
  const { channelId } = useParams();

  return (
    <HomeLayout>
      <GuildList />
      <DMSidebar />
      {channelId === undefined ? (
        <FriendsDashBoard />
      ) : (
        <>
          <DMHeader />
          <ChatScreen />
        </>
      )}
    </HomeLayout>
  );
};
