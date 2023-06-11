import { AnimatePresence, motion } from "framer-motion";
import React, { createContext, useContext } from "react";
import { createPortal } from "react-dom";

const ModalContext = createContext({
  isOpen: null,
  onClose: null,
  children: null,
});

export const Modal = ({ isOpen, onClose, children }) => {
  return (
    <ModalContext.Provider
      value={{
        isOpen,
        onClose,
        children,
      }}
    >
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed left-0 top-0 h-[100vh] w-[100vw] font-[inherit]">
              {children}
            </div>
          )}
        </AnimatePresence>,
        document.getElementById("portal")
      )}
    </ModalContext.Provider>
  );
};

export const ModalOverlay = () => {
  // const { onClose } = useModalContext();
  const { onClose } = useContext(ModalContext);

  return (
    <motion.div
      className="z-[1000] h-[100vh] w-[100vw] bg-[#0000005b]"
      key="modal-overlay"
      onClick={(e) => {
        e.stopPropagation();
        onClose?.();
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.05 }}
    ></motion.div>
  );
};

export const ModalBody = ({ children, className }) => {
  return (
    <div className="pointer-events-none fixed left-0 top-0 flex h-[100%] w-[100%] items-center justify-center">
      <motion.section
        className={`${className} pointer-events-auto rounded-md bg-[#17212b] text-[#ffffff] shadow-lg shadow-[#00000081]`}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        key="modal"
      >
        {children}
      </motion.section>
    </div>
  );
};
