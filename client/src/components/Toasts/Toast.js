import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { createPortal } from "react-dom";
import { AiFillCheckCircle } from "react-icons/ai";
import { VscClose } from "react-icons/vsc";

export default function Toast({ isOpen, onClose }) {
  setTimeout(() => onClose(), 3000);
  return (
    <>
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, bottom: "-4px" }}
              animate={{ opacity: 1, bottom: "10px" }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              key="toast"
              className="fixed left-2/4 flex h-[54px] w-[210px] items-center justify-between rounded-md bg-[#4295ff] text-sm"
            >
              <div className="flex shrink-0 items-center gap-2 pl-4 text-[#2b2b2b]">
                <AiFillCheckCircle color="#2b2b2b" size="24px" /> Account
                Updated
              </div>

              <div className="relative ml-3 mr-1 mt-2 h-full w-[21px]">
                <VscClose
                  className="absolute top-0 hover:cursor-pointer"
                  color="#2b2b2b"
                  onClick={() => onClose()}
                  size="21px"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.getElementById("portal")
      )}
    </>
  );
}
