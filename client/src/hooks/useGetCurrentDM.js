import { dmKey } from "utils/querykeys";

const { useQuery } = require("react-query");

export default function useGetCurrentDM(channelId) {
  const { data } = useQuery(dmKey);
  return data?.find((channel) => channel._id === channelId);
}
