import * as yup from 'yup';

//@ts-ignore
export const MessageSchema = yup.object().shape({
  content: yup.string().optional().max(2000),
});
