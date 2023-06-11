import { Form, Formik } from "formik";
import { forgotPassword } from "api/handler/auth";
import { ForgotPasswordSchema } from "utils/validation/user.schema";
import toErrorMap from "utils/toErrorMap";
import { InputField } from "components/InputFields/InputField";

export const ForgotPasswordForm = () => {
  async function handleSubmit(values, { setErrors }) {
    try {
      await forgotPassword(values.email);
    } catch (e) {
      setErrors(toErrorMap(e));
    }
  }
  return (
    <div className="flex h-[15rem] w-[500px] flex-col rounded-lg bg-[#1e293b] px-[1.7rem] py-[1.2rem]">
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={handleSubmit}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-5 mt-2 inline-block text-center text-[1.2rem] tracking-wide">
              <p>Электронды мекен-жайыңызды енгізіңіз</p>
            </div>
            <InputField name="email" type="email" label="пошта" />
            <button
              className="mt-1 rounded-md bg-[#387fdb] p-[10px] font-['gg_Sans'] text-sm font-[500] tracking-wide hover:bg-[#346eb9] active:bg-[#285999] disabled:bg-[#274f83]"
              disabled={isSubmitting}
              type="submit"
            >
              Қалпына келтіру
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
