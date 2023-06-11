import React, { useRef, useState, Fragment, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatGrid from "./ChatGrid";
import { checkNewDay, getTimeDifference } from "utils/dateUtils";
import Message from "../Message/Message";
import DateDivider from "./DateDivider";
import useMessageSocket from "api/ws/useMessageSocket";
import { useInfiniteQuery } from "react-query";
import { getMessages } from "api/handler/messages";
import StartMessages from "../Message/StartMessages";
import MessageInput from "../Message/MessageInput";
import Scroller from "./Scroller";

export default function ChatScreen() {
  const { channelId } = useParams();
  const [hasMore, setHasMore] = useState(false);
  const [reply, setReply] = useState();
  const qKey = `messages-${channelId}`;
  const scrollableRef = useRef(null);

  const {
    data,
    isLoading,
    hasPreviousPage,
    fetchPreviousPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery(
    qKey,
    async ({ pageParam = null }) => {
      let { data } = await getMessages(channelId, pageParam);
      if (data.length >= 30) setHasMore(true);
      else setHasMore(false);
      data = data.reverse();
      return data;
    },
    {
      getPreviousPageParam: (firstPage) => {
        return hasMore && firstPage.length
          ? firstPage[0]?.createdAt
          : undefined;
      },
    }
  );

  const newMessages = useMessageSocket(channelId, qKey);

  const checkIfWithinTime = (message1, message2) => {
    if (message1.author._id !== message2.author._id) return false;
    if (message1.createdAt === message2.createdAt) return false;
    return getTimeDifference(message1.createdAt, message2.createdAt) <= 4;
  };

  if (isLoading) {
    return (
      <ChatGrid>
        <div className="flex h-full items-center justify-center">
          <span>loading</span>
        </div>
      </ChatGrid>
    );
  }
  return (
    <ChatGrid>
      <Scroller
        fetchPreviousPage={fetchPreviousPage}
        ref={scrollableRef}
        isFetchingPreviousPage={isFetchingPreviousPage}
        hasPreviousPage={hasPreviousPage}
        reply={reply}
      >
        {!hasMore && <StartMessages key="start" />}
        {data?.pages.map((messages) =>
          messages.map((m, i) => (
            <Fragment key={m._id}>
              {checkNewDay(
                m.createdAt,
                messages[Math.min(i - 1 < 0 ? 0 : i - 1, messages.length - 1)]
                  .createdAt
              ) && <DateDivider date={m.createdAt} />}
              <Message
                reply={reply}
                setReply={setReply}
                message={m}
                channelId={channelId}
                isFetchingPreviousPage={isFetchingPreviousPage}
                fetchPreviousPage={fetchPreviousPage}
                isCompact={checkIfWithinTime(
                  m,
                  messages[Math.min(i - 1 < 0 ? 0 : i - 1, messages.length - 1)]
                )}
              />
            </Fragment>
          ))
        )}
      </Scroller>

      <MessageInput
        qKey={qKey}
        reply={reply}
        setReply={setReply}
        ref={scrollableRef}
        setNewMessages={newMessages[1]}
      />
    </ChatGrid>
  );
}
