import React from "react";

export default function DMPlaceholder({ op }) {
  return (
    <div className="m-3 ml-2 flex items-center" style={{ opacity: op }}>
      <div className="h-8 w-8 rounded-[50%] bg-[#242f3d]"></div>
      <div className="ml-2 h-5 w-44 rounded-md bg-[#242f3d]"></div>
    </div>
  );
}
