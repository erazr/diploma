import React from "react";

import { Modal, ModalBody, ModalOverlay } from "components/Modal/Modal";
import { getTime } from "utils/dateUtils";
import { deleteMessage } from "api/handler/messages";

export default function EditMessageModal({ isOpen, onClose, message }) {
  async function handleDelete() {
    onClose();
    await deleteMessage(message._id);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalBody className="max-h-[50vh] min-w-[440px] max-w-[15vw]">
        <div className="flex h-full max-h-[inherit] w-full flex-col justify-between">
          <div className="relative flex w-full flex-col overflow-x-hidden p-4">
            <p className="font-['gg_Sans'] text-lg">Хабарламаны жою</p>

            <p className="mt-3 text-base">
              Сіз бұл хабарламаны жойғыңыз келетініне сенімдісіз бе?
            </p>
            <div className="mt-4 overflow-y-auto rounded shadow-[0.4px_0.4px_0.025rem_1px_#283646,2px_2px_1rem_1px_#1f2c3b]">
              <div className="relative overflow-y-auto py-[.3rem] pl-[72px] pr-[48px]">
                <img
                  className="absolute left-[19px] mt-[.125rem] h-[41px] w-[41px] rounded-[50%] hover:cursor-pointer"
                  src={message.author.avatar}
                />
                <div>
                  <h3 className="_!important relative block min-h-[1.375rem] leading-[1.375rem]">
                    <span className="font-['gg_sans'] text-base font-[500] leading-[1.375rem] text-[#fffffff8_!important]">
                      {message.author.nickname ?? message.author.username}
                    </span>
                    <span className="ml-2 select-none text-[.75rem] text-gray-300">
                      {getTime(message.createdAt)}
                    </span>
                  </h3>
                  <p className="break-all">{message.content}</p>
                  <div className="flex max-h-[350px] gap-x-1 gap-y-1 overflow-y-auto">
                    {message.attachments.length > 0 &&
                      message.attachments.map((file, i) => {
                        if (file.filetype.startsWith("image/")) {
                          return (
                            <div
                              key={i}
                              className={
                                "h-full max-h-[inherit] w-full" +
                                (!message.content ? " mt-2" : "")
                              }
                            >
                              <img
                                className="rounded-md object-contain"
                                src={file.url}
                                alt={""}
                              />
                            </div>
                          );
                        }
                        if (file.filetype.startsWith("audio/")) {
                          return (
                            <div key={i} className="my-2">
                              <audio controls>
                                <source src={file.url} type={file.filetype} />
                              </audio>
                            </div>
                          );
                        }
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[60px] w-full border-t border-t-[#283646] p-3">
            <div className="float-right flex h-full items-center gap-8 pr-[18px] text-sm">
              <button className="max-w-fit hover:underline" onClick={onClose}>
                Жабу
              </button>
              <button
                className="rounded bg-[#da373c] p-[8px] px-[22px] hover:bg-[#a0272b]"
                onClick={handleDelete}
              >
                Жою
              </button>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
