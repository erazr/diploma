import * as yup from 'yup';

export const GuildSchema = yup.object().shape({
	name: yup.string().required('*'),
});
