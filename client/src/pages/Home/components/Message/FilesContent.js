import React from "react";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default function FilesContent({ message }) {
  Fancybox.bind(`[data-fancybox="gallery_${message._id}"]`);

  return (
    <div className="flex max-h-[350px] max-w-[80%] gap-x-1 gap-y-1 rounded-md">
      {message.attachments.length > 0 &&
        message.attachments.map((file, i) => {
          if (file.filetype.startsWith("image/")) {
            return (
              <div
                key={i}
                className="h-1/2 max-h-[inherit] w-1/2 overflow-hidden rounded-md"
              >
                <a href={file.url} data-fancybox={`gallery_${message._id}`}>
                  <img
                    className="rounded-md object-contain"
                    src={file.url}
                    alt={""}
                  />
                </a>
              </div>
            );
          }
          if (file.filetype.startsWith("audio/")) {
            return (
              <div key={i} className="my-2">
                <audio controls>
                  <source src={file.url} type={file.filetype} />
                </audio>
              </div>
            );
          }
        })}
    </div>
  );
}
