import { sendMessage } from "api/handler/messages";
import { Modal, ModalBody, ModalOverlay } from "components/Modal/Modal";
import { useModal } from "hooks/useModal";
import React, { useEffect, useRef, useState } from "react";
import { MdAddCircle } from "react-icons/md";
import { useParams } from "react-router-dom";
import { FileSchema } from "utils/validation/message.schema";

export default function FileUploadButton() {
  const { channelId } = useParams();
  const { isOpen, onOpen, onClose } = useModal();

  const inputFile = useRef(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});

  const closeModal = () => {
    setErrors({});
    setProgress(0);
    onClose();
  };

  const handleSubmit = async (file) => {
    if (!file) return;
    setSubmitting(true);
    try {
      await FileSchema.validate({ file });
    } catch (err) {
      setErrors(err.errors);
      onOpen();
      return;
    }

    const data = new FormData();
    data.append("file", file);
    await sendMessage(channelId, data, (event) => {
      const loaded = Math.round((100 * event.loaded) / event.total);
      setProgress(loaded);
      if (loaded >= 100) setProgress(0);
    });
  };

  // useEffect(() => {
  //   console.log(progress);
  // }, [progress]);

  return (
    <div
      className="absolute left-0 flex h-full w-[3.7rem] cursor-pointer items-center justify-center text-[#5d92c0] hover:text-[#62a1d8]"
      onClick={() => inputFile.current.click()}
    >
      <MdAddCircle size="26px" color="inherit" />
      <input
        type="file"
        ref={inputFile}
        hidden
        disabled={isSubmitting}
        onChange={async (e) => {
          if (!e.currentTarget.files) return;
          handleSubmit(e.currentTarget.files[0]).then(() => {
            setSubmitting(false);
            e.target.value = "";
          });
        }}
      />
      {errors && (
        <Modal isOpen={isOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalBody w="200px" h="200px">
            <p className="mb-2">Reason: {errors}</p>
            <p>Max file size is 5.00 MB</p>
            <p>Only Images and mp3 allowed</p>
          </ModalBody>
        </Modal>
      )}
      {progress > 0 && (
        <Modal isOpen={progress > 0} onClose={closeModal}>
          <ModalBody w="200px" h="50px">
            Uploading...
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}
