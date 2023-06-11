import React from "react";
import { formatDivider } from "utils/dateUtils";

export default function DateDivider({ date }) {
  return (
    <div className="mx-4 mt-2 flex items-center text-center" key={date}>
      <div className="h-[1px] w-full bg-[rgb(42_55_71_/_2)]"></div>
      <p className="w-[15%] text-xs text-gray-400">{formatDivider(date)}</p>
      <div className="h-[1px] w-full bg-[rgb(42_55_71_/_2)]"></div>
    </div>
  );
}
