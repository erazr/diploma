import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { register } from "api/handler/auth";
import { RegSchema } from "utils/validation/user.schema";
import toErrorMap from "utils/toErrorMap";
import userStore from "stores/userStore";
import { InputField } from "components/InputFields/InputField";
import { PasswordField } from "components/InputFields/PasswordField";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const setUser = userStore((state) => state.setUser);
  async function handleRegister(values, { setErrors }) {
    try {
      const { data } = await register(values);
      if (data) {
        setUser(data);
        navigate("/channels/me");
      }
    } catch (e) {
      setErrors(toErrorMap(e));
      console.log(e);
    }
  }

  return (
    <div className="flex h-[31rem] w-[550px] flex-col rounded-lg bg-[#1e293b] px-[1.7rem] py-[1.2rem]">
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
        validationSchema={RegSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleRegister}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-[1.5rem] mt-[.5rem] text-center">
              <p className="text-[1.4rem] tracking-wider">
                Тіркелгіңізді жасаңыз
              </p>
            </div>
            <InputField name="email" type="email" label="Пошта" />
            <InputField name="username" type="text" label="пайдаланушы аты" />
            <PasswordField name="password" type="password" label="құпия сөз" />
            <button
              disabled={isSubmitting}
              type="submit"
              className="mb-[1.2rem] mt-[1rem] w-full cursor-pointer rounded-md border-none bg-[#4295ff] p-[.6rem] text-center text-base text-[#fff] hover:bg-[#549eff] active:bg-[#447cd5] active:text-[#d5d4d4] disabled:bg-[#3266b9] disabled:text-[#d5d4d4]"
            >
              Тіркелу
            </button>
            <Link
              to="/login"
              className="text-base text-[#0A98D1] hover:text-[#5ebce2]"
            >
              Кіру
            </Link>
          </Form>
        )}
      </Formik>
    </div>
  );
};
