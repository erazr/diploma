import { useField } from "formik";

export const InputField = ({ label, className, ...props }) => {
  const [field, { error, touched }] = useField(props);
  return (
    <div className="mb-[1.4rem] w-full">
      <label
        className="mb-1 inline-block align-baseline font-['gg_sans'] text-[.85rem] uppercase tracking-wide text-[#bac9dd]"
        htmlFor={field.name}
      >
        {label}
        {error && touched ? (
          <span className="ml-2 inline-block animate-fade align-baseline capitalize text-[#c94646]">
            {error}
          </span>
        ) : null}
      </label>
      <input
        className={`${className} box-border w-full rounded bg-[#0f172a] py-[.64rem] pl-[.7rem] pr-[.8rem] text-base font-light text-[#fff] outline-none`}
        {...field}
        {...props}
      />
      {/* <motion.div
                className="absolute bottom-0 box-border block h-[0.128rem] w-0 bg-[#6396cb]"
                variants={variant}
                animate={isFocus ? "focused" : "initial"}
            ></motion.div> */}
    </div>
  );
};
