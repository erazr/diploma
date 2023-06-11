import React from "react";
import "./loader.css";

export default function Loader() {
  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center">
      <div className="loader"></div>
    </div>
  );
}
