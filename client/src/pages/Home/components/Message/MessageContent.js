import { editMessage } from "api/handler/messages";
import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

export default function MessageContent({
  message: { _id, content, edited, attachments },
  isEdit,
  setIsEdit,
}) {
  const [text, setText] = useState(content);

  async function hadnleSubmit(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!text || !text.trim()) return;
      if (text.trim() === content.trim()) {
        setIsEdit(false);
        return;
      }
      await editMessage(_id, text.trim());
      setIsEdit(false);
    }
    if (e.key === "Escape") {
      setIsEdit(false);
    }
  }

  return (
    <div className="box-content flex items-center whitespace-break-spaces break-all">
      {isEdit ? (
        <TextareaAutosize
          value={text}
          autoFocus
          onChange={(e) => {
            setText(e.target.value);
          }}
          onKeyDown={hadnleSubmit}
          minRows={1}
          className="my-[5px] mr-[5px] h-[46px] max-h-[50vh] w-full resize-none overflow-hidden overflow-y-auto rounded border-none bg-[#1c2935] px-[11px] py-[11px] text-base outline-none focus:border-none disabled:text-gray-500"
        />
      ) : (
        <p
          className={
            "whitespace-break-spaces break-all text-base leading-[1.375rem]" +
            (attachments.length > 0 ? " mb-1" : "")
          }
        >
          {content}
          {edited && !isEdit && (
            <time dateTime={edited}>
              <span className="ml-1 text-[10px] text-gray-400">(edited)</span>
            </time>
          )}
        </p>
      )}
    </div>
  );
}
