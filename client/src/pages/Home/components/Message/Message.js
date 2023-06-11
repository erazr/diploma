import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  MdOutlineReply,
  MdOutlineAddReaction,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import { useQueryClient } from "react-query";
import { RiDeleteBin5Fill } from "react-icons/ri";
import useGetCurrentGuild from "hooks/useGetCurrentGuild";
import { useModal } from "hooks/useModal";
import userStore from "stores/userStore";
import { getShortenedTime, getTime } from "utils/dateUtils";
import MessageContent from "./MessageContent";
import { getMessages } from "api/handler/messages";
import FilesContent from "./FilesContent";
import DeleteMessageModal from "pages/Home/components/Modals/DeleteMessageModal";

export default function Message({
  message,
  isCompact = false,
  reply,
  setReply,
  channelId,
  qKey,
  isFetchingPreviousPage,
  fetchPreviousPage,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const current = userStore((state) => state.current);
  const isAuthor = current?._id === message.author._id;
  const { guildId } = useParams();
  // const guild = useGetCurrentGuild(guildId);
  const isOwner = current?._id;
  // guild !== undefined && guild.ownerId === current?._id;
  const showMenu = isAuthor || isOwner || message.url;

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useModal();

  const [isEdit, setIsEdit] = useState(false);

  const id = `${message.author._id}-${Math.random()
    .toString(36)
    .substring(2, 5)}`;

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const [jumpToReply, setJumpToReply] = useState(false);
  const mesRef = useRef(null);
  const cache = useQueryClient();

  useEffect(() => {
    // if (jumpToReply) {
    //   setTimeout(() => {
    //     document
    //       .getElementById(`chat-messages-${message.referencedMessage._id}`)
    //       .firstChild.classList.remove("bg-[#2870cf10]");
    //   }, 700);
    //   setJumpToReply(false);
    // }
    if (jumpToReply && !isFetchingPreviousPage) {
      document.getElementById(
        `chat-messages-${message.referencedMessage._id}`
      ).firstChild.className += " bg-[#2870cf10] transition-[background]";
      document
        .getElementById(`chat-messages-${message.referencedMessage._id}`)
        .scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      setTimeout(() => {
        document
          .getElementById(`chat-messages-${message.referencedMessage._id}`)
          .firstChild.classList.remove("bg-[#2870cf10]");
      }, 700);
      setJumpToReply(false);
    }
  }, [isFetchingPreviousPage, jumpToReply]);

  return (
    <li
      id={`chat-messages-${message._id}`}
      className="group relative hover:bg-[#2b3a493f]"
      onMouseLeave={() => setShowSettings(false)}
      onMouseEnter={() => setShowSettings(true)}
    >
      <div
        className={
          "leading-1 relative w-full break-all py-[.125rem] pl-[72px] pr-[48px]" +
          (isCompact
            ? message.referencedMessage
              ? " mt-[1.0625rem] min-h-[2.75rem]"
              : " mt-0 min-h-[1.625rem]"
            : " mt-[1.0625rem] min-h-[2.75rem]") +
          (reply && message._id === reply.message._id
            ? " rounded-r-sm bg-[#2870cf2f] after:absolute after:left-0 after:top-0 after:block after:h-full after:w-[2px] after:bg-[#2870cf]"
            : "") +
          (message.status ? " text-[#ffffff79]" : "")
        }
      >
        {message.referencedMessage && (
          <div className="before: flex items-center text-[0.875rem]">
            <img
              className="h-[18px] w-[18px] flex-[0_0_auto] rounded-[50%]"
              src={message.referencedMessage.author.avatar}
            />
            <span className="ml-1 mr-1 cursor-pointer text-[#ffffffbd_!important]">
              @{message.referencedMessage.author.username}
            </span>
            <div
              className="cursor-pointer text-ellipsis text-[#ffffffbd_!important] hover:text-[#ffffffef_!important]"
              onClick={async () => {
                document.getElementById(
                  `chat-messages-${message.referencedMessage._id}`
                )
                  ? (() => {
                      document
                        .getElementById(
                          `chat-messages-${message.referencedMessage._id}`
                        )
                        .scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                          inline: "center",
                        });
                      document.getElementById(
                        `chat-messages-${message.referencedMessage._id}`
                      ).firstChild.className +=
                        " bg-[#2870cf10] transition-[background]";
                      setJumpToReply(true);
                    })()
                  : (() => {
                      fetchPreviousPage({
                        pageParam: {
                          around: message.referencedMessage.createdAt,
                        },
                      });
                      setJumpToReply(true);
                    })();
              }}
            >
              {message.referencedMessage.attachments.length > 0
                ? "Click to see attachments"
                : message.referencedMessage.content}
            </div>
          </div>
        )}
        {isCompact ? (
          message.referencedMessage ? (
            <>
              {/* <UserPopover member={message.user}>
             <div
              className="mt-1 max-h-[40px] max-w-[40px] rounded-[50%] hover:cursor-pointer" 
              onContextMenu={(e) => {
                if (!isAuthor) profileShow(e);
              }}
            > */}
              <img
                draggable={false}
                className="absolute left-[19px] mt-[.125rem] h-[41px] w-[41px] rounded-[50%] hover:cursor-pointer"
                src={message.author.avatar}
              />
              {/* </div>
           </UserPopover> */}

              <h3 className="_!important relative block min-h-[1.375rem] leading-[1.375rem]">
                <span className="font-['gg_sans'] text-base font-[500] leading-[1.375rem] text-[#fffffff8_!important]">
                  {message.author.nickname ?? message.author.username}
                </span>
                <span className="ml-2 select-none text-[.75rem] text-gray-300">
                  {getTime(message.createdAt)}
                </span>
              </h3>
              <MessageContent
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                message={message}
              />
              <FilesContent message={message} />
            </>
          ) : (
            <>
              <span
                className={
                  "absolute left-0 w-[56px] select-none text-right text-[.75rem] text-[#d2d7d3]" +
                  (!showSettings ? " invisible" : " visible") +
                  (message.attachments?.length > 0
                    ? " leading-[1.8rem]"
                    : " leading-[1.47rem]")
                }
              >
                {getShortenedTime(message.createdAt)}
              </span>
              <div
                className="w-full"
                // onContextMenu={show}
              >
                <MessageContent
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  message={message}
                />
                <FilesContent message={message} />
              </div>
            </>
          )
        ) : (
          <>
            {/* <UserPopover member={message.user}>
             <div
              className="mt-1 max-h-[40px] max-w-[40px] rounded-[50%] hover:cursor-pointer" 
              onContextMenu={(e) => {
                if (!isAuthor) profileShow(e);
              }}
            > */}
            <img
              draggable={false}
              className="absolute left-[19px] mt-[.125rem] h-[41px] w-[41px] rounded-[50%] hover:cursor-pointer"
              src={message.author.avatar}
            />
            {/* </div>
           </UserPopover> */}

            <h3 className="relative block min-h-[1.375rem] leading-[1.375rem]">
              <span className="font-['gg_sans'] text-base font-[500] leading-[1.375rem] text-[#fffffff8_!important]">
                {message.author.nickname ?? message.author.username}
              </span>
              <span className="ml-2 select-none text-[.75rem] text-gray-300">
                {getTime(message.createdAt)}
              </span>
            </h3>
            <MessageContent
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              message={message}
            />
            <FilesContent message={message} />
          </>
        )}
        {!isEdit && (
          <div
            className={
              "absolute right-0 z-50 outline-none" +
              (isCompact ? " top-[-10px]" : " top-0")
            }
          >
            <div className="pointer-events-none absolute right-0 top-[-16px] z-[1] p-[0_14px_0_32px] opacity-0 group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="relative box-content grid h-[32px] select-none grid-flow-col items-center overflow-hidden rounded bg-[#182536] text-[#ffffffd7] shadow-[0_0_0_1px_#081627c7] outline-none transition-shadow ">
                <div className="group/react flex h-[32px] min-w-[32px] cursor-pointer items-center justify-center p-[4px] hover:bg-[#233752] hover:text-[#ffffffee]">
                  <MdOutlineAddReaction
                    className="group-active/react:translate-y-[1px]"
                    color="inherit"
                    size="32px"
                  />
                </div>
                {message.author._id !== current?._id && (
                  <div
                    className="group/reply flex h-[32px] min-w-[32px] cursor-pointer items-center justify-center p-[4px] hover:bg-[#233752] hover:text-[#ffffffee]"
                    onClick={() => {
                      setReply({
                        channelId,
                        message,
                      });
                    }}
                  >
                    <MdOutlineReply
                      className="group-active/reply:translate-y-[1px]"
                      color="inherit"
                      size="32px"
                    />
                  </div>
                )}
                <div
                  className="group/edit flex h-[32px] min-w-[32px] cursor-pointer items-center justify-center p-[4px] text-[#ffffffee] hover:bg-[#233752]"
                  onClick={() => {
                    setIsEdit(true);
                  }}
                >
                  <MdEdit
                    className="group-active/edit:translate-y-[1px]"
                    color="inherit"
                    size="18px"
                  />
                </div>
                <div
                  className="group/delete flex h-[32px] min-w-[32px] cursor-pointer items-center justify-center p-[4px] text-[#ffffffee] hover:bg-[#233752]"
                  onClick={() => {
                    onDeleteOpen();
                  }}
                >
                  <MdDelete
                    className="group-active/delete:translate-y-[1px]"
                    color="inherit"
                    size="18px"
                  />
                </div>
                <DeleteMessageModal
                  isOpen={isDeleteOpen}
                  onClose={onDeleteClose}
                  message={message}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
