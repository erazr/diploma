import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { createPortal } from "react-dom";
import useGetFriend from "hooks/useGetFriend";
import { removeFriend } from "api/handler/account";
import { useQueryClient } from "react-query";
import { fKey } from "utils/querykeys";
import { Modal, ModalBody, ModalOverlay } from "components/Modal/Modal";

export default function RemoveFriendModal({ friend, isOpen, onClose }) {
  const cache = useQueryClient();

  const hadnleRemoveFriend = async () => {
    onClose();
    const { data } = await removeFriend(friend._id);
    if (data) {
      cache.setQueryData(fKey, (friends) => {
        return friends?.filter((f) => f._id !== friend._id);
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalBody className="h-[180px] w-[450px]">
        <div className="px-5 pt-4">
          <p className="font-['gg_Sans'] text-xl">
            Достарыңыздан "{friend?.username}" алып тастау
          </p>
          <p className="mb-4 mt-3 text-base font-light text-[#d2d7d3]">
            <span className="font-bold">{friend?.username}</span> достарыңыздан
            алып тастағыңыз келе ме?
          </p>
        </div>
        <div className="mt-7 h-[72px] bg-[#10171f] px-5 pt-4 ">
          <button
            className="float-right rounded-[4px] bg-[#c43939] p-[9px] px-3 text-sm outline-none hover:bg-[#942c2c] active:bg-[#941d1d]"
            onClick={hadnleRemoveFriend}
          >
            Алып тастау
          </button>
          <button className="float-right mr-4 p-[9px] px-3 text-sm outline-none hover:underline active:text-[#bebebe]">
            Артқа қайту
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}
