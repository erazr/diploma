import { useState } from "react";
import { useField } from "formik";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
// import {
//     InputContainer,
//     Label,
//     InputField,
//     StyledErrrorMessage,
// } from "../../utils/styles";

export const PasswordField = ({ label, ...props }) => {
  const [field, { error, touched }] = useField(props);
  const [isHidden, setIsHidden] = useState(true);

  // function show() {
  // 	if (type === 'password') {
  // 		setType('text');
  // 	}
  // 	if (type === 'text') {
  // 		setType('password');
  // 	}
  // }
  return (
    <div className="mb-[1.4rem] w-full">
      <label
        className="mb-1 inline-block align-baseline font-['gg_sans'] text-[.85rem] uppercase tracking-wide text-[#bac9dd]"
        htmlFor="password"
      >
        {label}
        {error && touched ? (
          <span className="ml-2 inline-block animate-fade align-baseline normal-case text-[#c94646]">
            {error}
          </span>
        ) : null}
      </label>
      <div className="relative">
        <input
          className="box-border w-full rounded bg-[#0f172a] py-[.64rem] pl-[.7rem] pr-[.8rem] text-base font-light text-[#fff] outline-none"
          {...field}
          {...props}
          type={isHidden ? "password" : "text"}
        />
        {isHidden ? (
          <div className="absolute right-0 top-0 inline h-full w-[40px] cursor-pointer text-center">
            <AiFillEye
              onClick={() => setIsHidden((isHidden) => !isHidden)}
              style={{ width: "23px", height: "100%" }}
            />
          </div>
        ) : (
          <div className="absolute right-0 top-0 inline h-full w-[40px] cursor-pointer text-center">
            <AiFillEyeInvisible
              onClick={() => setIsHidden((isHidden) => !isHidden)}
              style={{ width: "23px", height: "100%" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
