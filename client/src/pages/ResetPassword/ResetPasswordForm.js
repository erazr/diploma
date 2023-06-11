import { Form, Formik } from "formik";
import { resetPassword } from "api/handler/auth";
import { ResetPasswordSchema } from "utils/validation/user.schema";
import { Link, useNavigate, useParams } from "react-router-dom";
import userStore from "stores/userStore";
import { useState } from "react";
import toErrorMap from "utils/toErrorMap";
import { PasswordField } from "components/InputFields/PasswordField";

export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const setUser = userStore((state) => state.setUser);
  const [tokenError, setTokenError] = useState();

  async function handleSubmit(values, { setErrors }) {
    try {
      const { data } = await resetPassword({ ...values, token });
      if (data) {
        setUser(data);
        navigate("/channels/me");
      }
    } catch (e) {
      const errors = toErrorMap(e);
      if ("token" in errors) {
        setTokenError(errors.token);
      }
      setErrors(errors);
    }
  }
  return (
    <div className="flex h-[21.5rem] w-[500px] flex-col rounded-lg bg-[#1e293b] px-[1.7rem] py-[1.2rem]">
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
        validationSchema={ResetPasswordSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4 mt-2 inline-block text-center text-[1.4rem]">
              <p>Құпия сөз қалпына келтіру</p>
            </div>
            <PasswordField
              name="newPassword"
              type="password"
              label="жаңа құпия сөз"
            />
            <PasswordField
              name="confirmNewPassword"
              type="password"
              label="қайта теріңіз"
            />
            <button
              className="mt-2 rounded-md bg-[#4295ff] p-2 px-4 font-['gg_Sans'] text-[15px] font-[500] hover:bg-[#397fda] active:bg-[#348bfd] disabled:bg-[#295c9e]"
              disabled={isSubmitting}
              type="submit"
            >
              Қалпына келтіру
            </button>
            {tokenError ? (
              <Link
                to="/forgot-password"
                className="text-base text-[#0A98D1] hover:text-[#5ebce2]"
              >
                <span className="mt-[.6rem] inline-block align-baseline text-[#d45252] hover:text-[#aa3b3b] ">
                  Токен уақыты өтті. Қайтадан жасау үшін басыңыз
                </span>
              </Link>
            ) : null}
          </Form>
        )}
      </Formik>
    </div>
  );
};
