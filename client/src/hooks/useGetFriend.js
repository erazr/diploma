import { useQuery } from "react-query";
import { fKey } from "utils/querykeys";

export default function useGetFriend(id) {
  const { data } = useQuery(fKey);
  return data?.find((f) => f._id === id);
}
