import { HiOutlinePlus } from "react-icons/hi";
import { useState } from "react";

export const AddGuildIcon = ({ onOpen, isOpen }) => {
  return (
    <div className="relative mt-[8px] flex w-full items-center justify-center">
      <div
        className={
          "flex min-h-[46px] min-w-[46px] cursor-pointer flex-col items-center justify-center bg-[#1f2b39] text-[#4295ff] transition-[border_background] hover:rounded-[35%] hover:bg-[#4090ec] hover:text-[#fff]" +
          (isOpen
            ? " rounded-[35%] bg-[#4090ec] text-[#fff]"
            : " rounded-[50%]")
        }
        onClick={() => onOpen()}
      >
        <HiOutlinePlus size="22px" color="inherit" />
      </div>
    </div>
  );
};
