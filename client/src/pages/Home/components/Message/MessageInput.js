import getSocket from "api/getSocket";
import { sendMessage } from "api/handler/messages";
import React, { forwardRef, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { MdAddCircle, MdDelete, MdAudioFile } from "react-icons/md";
import { RiCloseCircleFill } from "react-icons/ri";
import { useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import channelStore from "stores/channelStore";
import userStore from "stores/userStore";
import { cKey, dmKey } from "utils/querykeys";
import "./MessageInput.css";
import DMStore from "stores/DMStore";
import FileUploadButton from "../Chat/FileUploadButton";
import { FileSchema } from "utils/validation/message.schema";
// import FileUploadButton from "./FileUploadButton";

const MessageInput = forwardRef(
  ({ reply, setReply, qKey, setNewMessages }, ref) => {
    const [text, setText] = useState("");
    const [files, setFiles] = useState([]);
    const [fileList, setFileList] = useState([]);

    const [isSubmitting, setSubmitting] = useState(false);
    const [currentlyTyping, setCurrentlyTyping] = useState(false);
    const inputRef = useRef(null);
    const inputFile = useRef(null);

    const { guildId, channelId } = useParams();
    // const qKey = guildId === undefined ? dmKey : cKey(guildId);
    const { data } = useQuery(dmKey);
    const channel = data?.find((c) => c._id === channelId);

    const current = userStore((state) => state.current);
    const isTyping = channelStore((state) => state.typing);

    const cache = useQueryClient();

    const generateUniqueId = (flag = "_") =>
      flag + Math.random().toString(36).substr(2, 9);

    let fakeMessage = {
      _id: generateUniqueId(),
      channelId,
      content: text.trim(),
      author: current,
      attachments: files ? files : [],
      referencedMessage: reply?.message ? reply?.message : undefined,
      mentionedEveryone: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mentions: [reply?.message.author],
      status: "pending",
    };

    const socket = useMemo(() => getSocket(), []);

    const dmStore = DMStore();

    async function handleAddMessage(event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        if (!text && !text.trim() && files.length === 0) return;

        cache.setQueryData(qKey, (data) => {
          data.pages[data.pages.length - 1].push(fakeMessage);
          dmStore.addMessages(fakeMessage);
          return data;
        });

        setText("");
        setSubmitting(true);
        inputRef?.current?.focus();

        socket.emit("stopTyping", channelId, current?.username);
        setSubmitting(false);
        setCurrentlyTyping(false);
        const data = new FormData();
        data.append("content", text.trim());

        if (fileList) {
          fileList.forEach((f, i) => {
            console.log(f);
            data.append(`file-${i}`, f.file, f.name);
          });
          setFiles([]);
          setFileList([]);
          inputFile.current.value = "";
        }

        if (reply?.message) {
          data.append("referencedMessage", reply?.message._id);
          setReply(null);
        }

        await sendMessage(channelId, data).then((res) => {
          cache.setQueryData(qKey, (data) => {
            data.pages[data.pages.length - 1].splice(
              data.pages[data.pages.length - 1].findIndex(
                (m) => m._id === fakeMessage._id
              ),
              1,
              res.data
            );
            return data;
          });
        });
      }
    }

    const getTypingString = (members) => {
      switch (members.length) {
        case 1:
          return members[0];
        case 2:
          return `${members[0]} және ${members[1]}`;
        case 3:
          return `${members[0]}, ${members[1]} және ${members[2]}`;
        default:
          return "Бірнеше адам";
      }
    };

    function handleMessageChange(event) {
      const value = event.target.value;
      if (value.trim().length === 1 && !currentlyTyping) {
        socket.emit("startTyping", channelId, current?.username);
        setCurrentlyTyping(true);
      } else if (value.length === 0) {
        socket.emit("stopTyping", channelId, current?.username);
        setCurrentlyTyping(false);
      }
      if (value.length <= 2000) setText(value);
    }

    const getPlaceholder = () => {
      if (channel?.user) {
        return `@${channel?.user.username} жазу`;
      }
      return `#${channel?.name} жазу`;
    };

    return (
      <div
        className={
          "flex flex-shrink-0 flex-col px-5" +
          (isTyping.length > 0 ? " pb-0" : " pb-7")
        }
      >
        <div className="relative flex min-h-[46px] w-full flex-col">
          {reply && (
            <div
              className="relative h-9 w-full cursor-pointer select-none rounded-t-md bg-[#203e5c] pl-4"
              onClick={() => {
                setReply((prev) => ({ ...prev, click: true }));
              }}
            >
              <div className="mt-[0.6rem] flex w-full items-center text-left font-['gg_Sans'] text-[0.9rem]">
                Replying to {reply?.message.author.username}
                <div
                  className="absolute right-[18px] text-[#ffffffd0] hover:text-[#fffffff5]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReply(null);
                  }}
                >
                  <RiCloseCircleFill size="20px" color="inherit" />
                </div>
              </div>
            </div>
          )}
          {files.length > 0 && (
            <div
              id="file_list"
              className="flex w-full gap-2 overflow-x-auto border-b-2 border-b-[#162029] bg-[#1c2935] px-4 py-4"
            >
              {files.map((f, i) => {
                return (
                  <div
                    key={i}
                    id={f.id}
                    className="relative flex max-h-[200px] min-h-[200px] min-w-[200px] max-w-[200px] flex-col items-center justify-between rounded bg-[#141f29] p-2"
                  >
                    <div className="absolute -top-2 right-0">
                      <div
                        className="group/remove flex h-[32px] min-w-[32px] cursor-pointer items-center justify-center bg-[#20324b] p-[4px] text-[#ffffffee] hover:bg-[#1a2a3f]"
                        onClick={() => {
                          // document.getElementById(`${f.id}`).remove();
                          setFiles((prev) => {
                            return [...prev.filter((file) => file.id !== f.id)];
                          });
                          setFileList((prev) => {
                            return [...prev.filter((file) => file.id !== f.id)];
                          });
                        }}
                      >
                        <MdDelete
                          className="group-active/remove:translate-y-[1px]"
                          color="inherit"
                          size="18px"
                        />
                      </div>
                    </div>
                    <div className="flex min-h-0 grow items-center rounded">
                      {f.filetype.startsWith("image/") ? (
                        <img
                          className="mb-2 max-w-full rounded object-contain"
                          src={f.url}
                        />
                      ) : (
                        <MdAudioFile color="#4c96ff" size="96px" />
                      )}
                    </div>
                    <p className="self-start text-sm">{f.name}</p>
                  </div>
                );
              })}
            </div>
          )}
          <div className="relative flex min-h-[46px] items-center">
            <TextareaAutosize
              aria-autocomplete="list"
              className={
                "h-[46px] max-h-[50vh] w-full resize-none overflow-y-auto border-none bg-[#1c2935] py-[11px] pl-[3.7rem] pr-2 text-base outline-none [scrollbar-width:none] focus:border-none disabled:text-gray-500" +
                (reply || files.length > 0 ? " rounded-t-none" : " rounded-md")
              }
              minRows={1}
              name="text"
              placeholder={getPlaceholder()}
              ref={inputRef}
              disabled={isSubmitting}
              value={text}
              onChange={handleMessageChange}
              onKeyDown={handleAddMessage}
            />
            {/* <FileUploadButton /> */}
            <div
              className="absolute left-0 top-[7px] flex h-[32px] w-[3.7rem] cursor-pointer items-center justify-center text-[#3f71a3] hover:text-[#62a1d8]"
              onClick={() => inputFile.current.click()}
            >
              <MdAddCircle size="26px" color="inherit" />
              <input
                type="file"
                ref={inputFile}
                hidden
                multiple
                disabled={isSubmitting}
                onChange={async (e) => {
                  if (!e.currentTarget.files) return;

                  e.currentTarget.files = [...e.currentTarget.files].forEach(
                    (f) => {
                      const id = generateUniqueId("attachments_file");

                      setFiles((prev) => {
                        return [
                          ...prev,
                          {
                            url: URL.createObjectURL(f),
                            filetype: f.type,
                            name: f.name,
                            id,
                          },
                        ];
                      });
                      setFileList((prev) => [
                        ...prev,
                        {
                          file: f,
                          id,
                        },
                      ]);
                    }
                  );
                  inputRef.current.focus();
                }}
              />
            </div>
          </div>
        </div>
        {isTyping.length > 0 && (
          <div className="flex items-center text-sm leading-[28px]">
            <div className="typing-indicator">
              <span />
              <span />
              <span />
            </div>
            <p className="ml-1 ">{getTypingString(isTyping)}</p>
            <p className="ml-1">жазып жатыр </p>
          </div>
        )}
      </div>
    );
  }
);

export default MessageInput;
