import * as nodemailer from 'nodemailer';

export const sendMail = async (to, html) => {
  const transporter = nodemailer.createTransport({
    port: 587,
    service: 'gmail',
    secure: true,
    auth: {
      user: 'nodemailer.mine@gmail.com',
      pass: 'ajyejxzwuypghind',
    },
    debug: true,
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: `"Discord Team" <nodemailer.mine@gmail.com>`, // sender address
    to: to, // list of receivers
    subject: 'Change Password', // Subject line
    html,
  });
};
