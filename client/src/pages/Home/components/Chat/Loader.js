import React, { forwardRef, useCallback, useRef } from "react";
import "./loader.css";

const Loader = forwardRef((props, ref) => {
  return (
    <div className="mt-5 flex justify-center">
      <div className="chat-loader"></div>
    </div>
  );
});

export default Loader;
