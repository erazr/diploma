import { useState } from "react";
import { Form, Formik } from "formik";
import userStore from "stores/userStore";
import CopyToClipboard from "react-copy-to-clipboard";
import { InputField } from "components/InputFields/InputField";
import { sendFriendRequest } from "api/handler/account";
import { useQueryClient } from "react-query";
import { rKey } from "utils/querykeys";
import { Modal, ModalBody, ModalOverlay } from "components/Modal/Modal";

export default function AddFriendModal({ isOpen, onClose }) {
  const cache = useQueryClient();

  const current = userStore((state) => state.current);

  const [isCopied, setIsCopied] = useState(false);

  async function handleAddFriend(values, { setErrors }) {
    if (values.id === "" || values.id.length !== 24) {
      setErrors({ id: "Enter a valid ID" });
    } else {
      const { data } = await sendFriendRequest(values.id);
      if (data) {
        onClose();
        cache.invalidateQueries({ queryKey: rKey });
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalBody className="h-[345px] w-[500px]">
        <Formik initialValues={{ id: "" }} onSubmit={handleAddFriend}>
          {({ isSubmitting }) => (
            <Form className="h-full px-6 pt-5">
              <p className="text-2xl">Дос қсоыңыз</p>
              <p className="mb-3 mt-4">
                Досыңызды оның UID арқылы қоса аласыз.
              </p>
              <div className="absolute max-h-[44px] w-[453px]">
                <div className="pointer-events-none relative z-10 flex h-[44px] w-[50px] select-none items-center justify-center rounded-l border-r-2 border-r-[#172230] bg-[#1f2b38]">
                  UID
                </div>
                <input
                  type="text"
                  readOnly
                  value={current?._id || ""}
                  className="relative left-0 top-[-44px] box-border w-full rounded bg-[#1f2b38] py-[.64rem] pl-[4.1rem] pr-[.8rem] text-base text-[#fff] outline-none"
                />
                <CopyToClipboard
                  text={current?._id}
                  onCopy={() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 800);
                  }}
                >
                  <button
                    className={
                      "relative right-1 top-[-84px] float-right rounded-md bg-[#4295ff] p-2 text-sm" +
                      (isCopied ? " bg-[#3178d6]" : "")
                    }
                    type="button"
                  >
                    {isCopied ? "Көшірілді" : "Көшіру"}
                  </button>
                </CopyToClipboard>
              </div>
              <div className="mt-[90px]">
                <InputField
                  label="Пайдаланушының ID-ін жасыңыз"
                  name="id"
                  className="bg-[#1f2b38]"
                />
              </div>
              <div className="mt-8 flex items-center justify-end gap-8">
                <button className="p-1" onClick={() => onClose()} type="button">
                  Жабу
                </button>
                <button
                  className="rounded-md bg-[#4295ff] px-4 py-2 active:bg-[#348bfd] disabled:bg-[#3074ce]"
                  disabled={isSubmitting}
                  type="submit"
                >
                  Өтініщ жіберу
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </ModalBody>
    </Modal>
  );
}
