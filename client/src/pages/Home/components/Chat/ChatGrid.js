import React, { useEffect, useRef } from "react";

export default function ChatGrid({ children }) {
  return (
    <div className="relative col-[3] row-[2] mr-1 flex min-h-0 min-w-0 flex-col justify-end bg-[#0e1621]">
      {children}
    </div>
  );
}
