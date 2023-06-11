import React, { forwardRef, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import InfiniteScroll from "react-infinite-scroller";
import userStore from "stores/userStore";
import Loader from "./Loader";
import { getShortenedTime, getTimeDifference } from "utils/dateUtils";
import { useResizeDetector } from "react-resize-detector";
import DMStore from "stores/DMStore";

const Scroller = forwardRef(
  (
    {
      children,
      fetchPreviousPage,
      hasPreviousPage,
      isFetchingPreviousPage,
      reply,
    },
    ref
  ) => {
    const current = userStore((state) => state.current);
    const dmStore = DMStore();
    // const [newMessages, _setNewMessages, clear] = messages;
    const [hasNewMessages, setHasNewMessages] = useState(false);

    let ol = ref.current?.children[1]
      ? ref.current?.children[1]
      : ref.current?.children[0];

    useEffect(() => {
      ref.current?.scrollTo(0, ref.current?.scrollHeight);
    }, []);

    const newline = document.createElement("div");
    newline.className =
      "bg-[#df2a2d] relative w-[95%] h-[1px] my-[7px] z-[10] ml-[24px] after:absolute after:bg-[#df2a2d] after:w-[30px] after:h-[12px] after:right-0 after:rounded-l-[15px] after:top-1/2 after:translate-y-[-50%] after:rounded-r-[7px] after:content-['New'] after:font-['gg_Sans'] after:font-[600] after:text-[9px] after:flex after:items-center after:justify-center after:uppercase";
    newline.id = "new-messages-divider";

    const [viewRef, inView, entry] = useInView();
    const [now, setNow] = useState();

    useEffect(() => {
      const spacer = document.getElementById("space");
      viewRef(spacer);

      const checkIfWithinTime = (message1, message2) => {
        return getTimeDifference(message1, message2) >= 1;
      };
      if (dmStore.newMessages.length > 0) {
        const newMessageRef = document.getElementById(
          `chat-messages-${dmStore.newMessages[0]?._id}`
        );
        if (dmStore.newMessages[0]?.author._id !== current._id && !inView) {
          setHasNewMessages(true);

          if (!document.getElementById("new-messages-divider")) {
            newMessageRef.before(newline);
            console.log(newMessageRef);
            setNow(Date.now());
          }

          if (
            document.getElementById("new-messages-divider") &&
            checkIfWithinTime(Date.now(), now)
          ) {
            document.getElementById("new-messages-divider").remove();
            console.log(newMessageRef);

            setNow(Date.now());
            newMessageRef.before(newline);
          }
        } else {
          ref.current?.scrollTo(0, ref.current?.scrollHeight);
          setHasNewMessages(false);
          dmStore.clear();
          if (
            document.getElementById("new-messages-divider") &&
            dmStore.newMessages[0]?.author._id === current._id
          )
            document.getElementById("new-messages-divider").remove();
        }
      }
      return () => {
        if (isFetchingPreviousPage)
          document.getElementById("new-messages-divider")?.remove();
      };
    }, [dmStore.newMessages, isFetchingPreviousPage]);

    useEffect(() => {
      if (reply?.click) {
        ref.current?.scrollTo({
          left: 0,
          top:
            document.getElementById(`chat-messages-${reply.message._id}`)
              .offsetTop -
            ref.current?.clientHeight / 2,
          behavior: "smooth",
        });
      }
    }, [reply]);

    return (
      <div
        className="relative flex min-h-0 flex-auto flex-col justify-end overflow-y-scroll bg-[#0e1621] [scrollbar-color:#1f2d3a_transparent]"
        ref={ref}
        onScroll={(e) => {
          if (
            e.target.scrollHeight - e.target.scrollTop ===
            e.target.clientHeight
          ) {
            setHasNewMessages(false);
            dmStore.clear();
          }
          return;
        }}
      >
        {hasNewMessages &&
          dmStore.newMessages[dmStore.newMessages.length - 1]?.author._id !==
            current._id && (
            <div
              className="sticky left-1/2 top-0 z-20 mt-[-24px] flex w-48 -translate-x-1/2 justify-center rounded-b-lg bg-[#2c445e] hover:cursor-pointer"
              onClick={() => {
                ref.current?.scrollTo({
                  left: 0,
                  top:
                    document.getElementById(
                      `chat-messages-${dmStore.newMessages[0]?._id}`
                    ).offsetTop - 50,
                  behavior: "smooth",
                });
                setHasNewMessages(false);
                dmStore.clear();
              }}
            >
              New {dmStore.newMessages.length} message since{" "}
              {getShortenedTime(dmStore.newMessages[0]?.createdAt)}
            </div>
          )}
        <InfiniteScroll
          element="ol"
          className="min-h-0"
          loader={
            <div key="loader">
              <Loader />
            </div>
          }
          initialLoad={false}
          isReverse={true}
          hasMore={hasPreviousPage}
          useWindow={false}
          loadMore={fetchPreviousPage}
          getScrollParent={() => ref.current}
        >
          {children}
          <div
            id="space"
            key="space"
            className="block h-5 w-[1px] [overflow-anchor:auto]"
          ></div>
        </InfiniteScroll>
      </div>
    );
  }
);

export default Scroller;
