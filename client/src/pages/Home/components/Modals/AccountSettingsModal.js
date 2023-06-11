import { Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { UserSchema } from "utils/validation/user.schema";
import { useQuery, useQueryClient } from "react-query";
import { aKey } from "utils/querykeys";
import { getAccount, updateAccount } from "api/handler/account";
import userStore from "stores/userStore";
import { useNavigate } from "react-router-dom";
import { InputField } from "components/InputFields/InputField";
import toErrorMap from "utils/toErrorMap";
import { logout } from "api/handler/auth";
import { useModal } from "hooks/useModal";
import CropImageModal from "./CropImageModal";
import Toast from "components/Toasts/Toast";
import { Modal, ModalBody, ModalOverlay } from "components/Modal/Modal";

export default function AccountSettingsModal({ isOpen, onClose }) {
  const { data: user } = useQuery(aKey, () =>
    getAccount().then((res) => res.data)
  );

  const cache = useQueryClient();
  const logoutUser = userStore((state) => state.logout);
  const setUser = userStore((state) => state.setUser);
  const navigate = useNavigate();

  const {
    isOpen: cropperIsOpen,
    onOpen: cropperOnOpen,
    onClose: cropperOnClose,
  } = useModal();
  const {
    isOpen: toastIsOpen,
    onOpen: toastOnOpen,
    onClose: toastOnClose,
  } = useModal();

  const [imageUrl, setImageUrl] = useState(user?.image || "");
  const [cropImage, setCropImage] = useState("");
  const [croppedImage, setCroppedImage] = useState(null);
  const inputFile = useRef(null);

  const applyCrop = (file) => {
    setImageUrl(URL.createObjectURL(file));
    setCroppedImage(new File([file], "avatar"));
    cropperOnClose();
  };

  const handleUpdateAccount = async (values, { setErrors }) => {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("username", values.username);
    formData.append("avatar", croppedImage ?? imageUrl);
    const { data } = await updateAccount(formData);
    if (data) {
      setUser(data);
      cache.setQueryData(aKey, data);
      toastOnOpen();
      onClose();
    }
  };

  const handleSelectImage = (event) => {
    if (!event.currentTarget.files) return;
    setCropImage(URL.createObjectURL(event.currentTarget.files[0]));
    cropperOnOpen();
  };

  const handleLogout = async () => {
    const { data } = await logout();
    if (data) {
      cache.clear();
      logoutUser();
      navigate("/");
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalBody className="h-[545px] w-[550px]">
        <Formik
          initialValues={{
            email: user.email,
            username: user.username,
            avatar: null,
          }}
          validationSchema={UserSchema}
          onSubmit={handleUpdateAccount}
        >
          {({ isSubmitting }) => (
            <Form className="h-full">
              <div className="px-6 pt-5">
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => inputFile.current.click()}
                    className="group pointer-events-none relative min-h-[120px] min-w-[120px] rounded-[50%] after:pointer-events-auto after:absolute after:left-0 after:top-0 after:z-10 after:flex after:h-full after:w-full after:rounded-[50%] after:hover:cursor-pointer after:hover:bg-[#192b3fc7]"
                  >
                    <img
                      src={imageUrl ? imageUrl : user.avatar}
                      className="w-[120px] rounded-[50%]"
                    />
                    <p className="pointer-events-none invisible absolute left-[50%] top-[50%] z-20 -translate-x-2/4 -translate-y-2/4 text-center text-sm font-semibold uppercase text-[#e8ebff] group-hover:visible">
                      Суретіңізді өзгерту
                    </p>
                  </div>
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    ref={inputFile}
                    hidden
                    onChange={handleSelectImage}
                  />
                  <div className="mt-10 w-full">
                    <InputField
                      name="email"
                      label="пошта"
                      className="bg-[#1f2b38]"
                    />
                    <InputField
                      name="username"
                      label="пайдаланушы атыңыз"
                      className="bg-[#1f2b38]"
                    />
                  </div>
                </div>
                <div className="mt-4 flex w-full gap-5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-[#3178d6] p-[10px] text-sm hover:bg-[#2c6bbe] disabled:bg-[#3074ce]"
                  >
                    Жаңарту
                  </button>
                  <button
                    type="button"
                    onClick={() => onClose()}
                    className="p-[10px] text-sm hover:underline"
                  >
                    Жабу
                  </button>
                </div>
              </div>

              <div className="mt-10 w-full border-t-[1px] border-t-[#2a3747] p-5 text-lg">
                {/* <p className="uppercase">password and authentication</p> */}
                {/* <button
                    type="submit"
                    className="rounded-md bg-[#3178d6] p-[10px] text-sm hover:bg-[#2c6bbe]"
                  >
                    Change password
                  </button> */}
                <button
                  onClick={handleLogout}
                  type="button"
                  className="float-right p-[10px] text-sm hover:underline"
                >
                  Шығу
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </ModalBody>

      <CropImageModal
        isOpen={cropperIsOpen}
        onClose={cropperOnClose}
        image={cropImage}
        applyCrop={applyCrop}
      />
      <Toast isOpen={toastIsOpen} onClose={toastOnClose} />
    </Modal>
  );
}
