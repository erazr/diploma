import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { LogInSchema } from "utils/validation/user.schema";
import { login } from "api/handler/auth";
import toErrorMap from "utils/toErrorMap";
import userStore from "stores/userStore";
import { InputField } from "components/InputFields/InputField";
import { PasswordField } from "components/InputFields/PasswordField";

export const LoginForm = () => {
  const navigate = useNavigate();
  const setUser = userStore((state) => state.setUser);
  async function handleLogin(values, { setErrors }) {
    try {
      const { data } = await login(values);
      if (data) {
        setUser(data);
        navigate("/channels/me");
      }
    } catch (e) {
      if (e?.response?.status === 401) {
        setErrors({ email: "Invalid Credentials" });
      } else if (e?.response?.status === 404) {
        setErrors({ email: "No user found" });
      } else {
        setErrors(toErrorMap(e));
      }
    }
  }

  return (
    <div className="flex h-[25rem] w-[500px] flex-col rounded-lg bg-[#1e293b] px-[1.7rem] py-[1.2rem]">
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
        validationSchema={LogInSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-[.8rem] mt-[.6rem] inline-block text-center text-[1.4rem]">
              <p>Қош келдіңіз</p>
            </div>
            <InputField name="email" label="пошта" />
            <PasswordField name="password" label="құпия сөз" />
            <Link
              to="/forgot-password"
              className="text-base text-[#0A98D1] hover:text-[#5ebce2]"
            >
              Құпия сөзді ұмыттыңыз ба?
            </Link>
            <button
              disabled={isSubmitting}
              type="submit"
              className="my-[.9rem] w-full cursor-pointer rounded-md border-none bg-[#4295ff] p-[.6rem] text-center text-base text-[#fff] hover:bg-[#549eff] active:bg-[#447cd5] active:text-[#d5d4d4] disabled:bg-[#3266b9] disabled:text-[#d5d4d4]"
            >
              Кіру
            </button>

            <Link
              to="/register"
              className="text-base text-[#0A98D1] hover:text-[#5ebce2]"
            >
              Тіркелу
            </Link>
          </Form>
        )}
      </Formik>
    </div>
  );
};
