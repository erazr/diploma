// import { useState } from "react";
// import {
//   Divider,
//   Flex,
//   Box,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   ModalOverlay,
//   Text,
// } from "@chakra-ui/react";
// import { useFormik, Formik, Form } from "formik";
// import { MdAddAPhoto } from "react-icons/md";
// import { GiCircle } from "react-icons/gi";
// // import { Form } from "../forms";
// import { GuildSchema } from "../../utils/validation/guild.schema";
// import { Button, Label, StyledErrrorMessage } from "../../utils/styles";
// import InputField from "../InputField";
// import userStore from "../../stores/userStore";
// import { createGuild } from "../../api/handler/guild";
// import toErrorMap from "../../utils/toErrorMap";

import { useRef, useState } from "react";
import { Form, Formik } from "formik";
import { BsCircle } from "react-icons/bs";
import { MdAddAPhoto } from "react-icons/md";
import { createGuild } from "api/handler/guild";
import { InputField } from "components/InputFields/InputField";
import { Modal, ModalBody, ModalOverlay } from "components/Modal/Modal";
import userStore from "stores/userStore";
import toErrorMap from "utils/toErrorMap";
import { GuildSchema } from "utils/validation/guild.schema";
import { useNavigate } from "react-router-dom";

export const AddGuildModal = ({ isOpen, onClose }) => {
  const [screen, setScreen] = useState("START");
  const goBack = () => setScreen("START");
  const submitClose = () => {
    setScreen("START");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      {/* {screen === "INVITE" && <JoinServerModal goBack={goBack} />} */}
      {screen === "CREATE" && (
        <CreateServerModal goBack={goBack} submitClose={submitClose} />
      )}
      {screen === "START" && (
        <ModalBody className="w-[400px] bg-[#17212b]">
          <div className="flex h-full flex-col">
            <div className="flex grow flex-col p-[.9rem]">
              <div>
                <h2 className="pb-2 pt-1 text-center font-['gg_Sans'] text-xl">
                  Сервер жасаңыз
                </h2>
                <p className="mb-4 text-center text-base">
                  Сіздің серверіңіз сіз және сіздің достарыңыз уақыт өткізетін
                  орын.
                </p>
              </div>
              <button
                className="w-full rounded bg-[#4295ff] py-2 font-['gg_Sans'] text-sm font-[500] hover:bg-[#367cd8]"
                onClick={() => setScreen("CREATE")}
              >
                Өз серверіңізді жасау
              </button>
            </div>

            <div className="my-3 h-[2px] w-full bg-[#656972]"></div>
            <div className="flex flex-col items-center px-[.9rem] pb-5">
              <p className="pb-2 text-center font-['gg_Sans'] text-lg font-[500]">
                Сізде шақыру бар ма?
              </p>
              <button
                className="w-full rounded bg-[#344152] py-2 font-['gg_Sans'] text-sm font-[500] hover:bg-[#4e617a]"
                onClick={() => setScreen("INVITE")}
              >
                Серверге қосылыңыз
              </button>
            </div>
          </div>
        </ModalBody>
      )}
    </Modal>
  );
};

function CreateServerModal({ goBack, submitClose }) {
  const navigate = useNavigate();

  async function handleCreateServer(values, { setErrors }) {
    try {
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }
      const data = await createGuild(formData);
      submitClose();
      navigate(`/channels/${data._id}/${data.default_channel_id}`);
    } catch (e) {
      toErrorMap(setErrors(e));
    }
  }
  const user = userStore((state) => state.current);

  const inputFile = useRef(null);

  return (
    <ModalBody className="h-[400px] w-[400px]">
      <Formik
        initialValues={{
          name: `${user.username}'s server`,
          icon: "",
        }}
        validationSchema={GuildSchema}
        onSubmit={handleCreateServer}
      >
        {({
          isSubmitting,
          handleBlur,
          setFieldValue,
          touched,
          errors,
          values,
        }) => (
          <Form className="flex h-full flex-col">
            <input
              hidden
              type="file"
              name="icon"
              onChange={(e) => {
                setFieldValue("icon", e.currentTarget.files[0]);
              }}
              ref={inputFile}
            />
            <h2 className="pt-5 text-center">Серверіңізді орнатыңыз</h2>
            {/* <ModalCloseButton /> */}
            <div className="grow">
              <div className="flex grow flex-col p-3">
                <p className="m-0 text-center">
                  Жаңа серверге атау мен белгіше арқылы жеке тұлға беріңіз. Сіз
                  оны кейінірек өзгерте аласыз.
                </p>
                <div className="mt-5 flex h-[7rem] justify-center">
                  {!inputFile.current?.files[0] ? (
                    <div className="relative w-fit cursor-pointer">
                      <div
                        className="group relative flex max-h-[120px] max-w-[120px] cursor-pointer items-center justify-center rounded-[50%] 
                         after:pointer-events-auto after:absolute after:bottom-0 after:left-0 after:right-0 after:top-0 after:z-10 
                         after:flex after:rounded-[50%] after:hover:cursor-pointer after:hover:bg-[#192b3fc7]"
                        onClick={() => {
                          inputFile.current.click();
                        }}
                      >
                        <img
                          className="h-[120px] w-[120px] rounded-[50%] object-cover"
                          src={`https://ui-avatars.com/api/?name=${values.name}&uppercase=false&background=242f3d&color=4295ff&rounded=true&bold=true&format=svg`}
                        />
                        <p className="pointer-events-none invisible absolute left-[50%] top-[50%] z-20 -translate-x-2/4 -translate-y-2/4 text-center text-sm font-semibold uppercase text-[#e8ebff] group-hover:visible">
                          суретті өзгерту
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex max-h-[120px] max-w-[120px] cursor-pointer items-center justify-center rounded-[50%]"
                      onClick={() => {
                        inputFile.current.value = "";
                        inputFile.current.click();
                      }}
                    >
                      <img
                        className="h-[120px] w-[120px] rounded-[50%] object-cover"
                        src={URL.createObjectURL(inputFile.current.files[0])}
                      />
                    </div>
                  )}
                </div>
                <div className="mb-[.6rem] mt-[.25rem]">
                  <InputField
                    className="bg-[#1f2b38]"
                    name="name"
                    label="Сервер аты"
                  />
                </div>
              </div>
            </div>
            <div className="bg-[#0e1621] px-4 py-3">
              <button
                className="px-3 py-2 hover:underline"
                type="button"
                style={{ background: "transparent" }}
                onClick={goBack}
              >
                Артқа қайту
              </button>
              <div className="float-right flex h-full items-center">
                <button
                  className="rounded bg-[#4295ff] px-3 py-[7px] font-['gg_Sans'] text-sm font-[500] hover:bg-[#367cd8]"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Жасау
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </ModalBody>
  );
}
