import Mailgun from "mailgun-js";

const mailGunClient = new Mailgun({
  apiKey: process.env.MAILGUN_API || "",
  domain: process.env.MAILGUN_DOMAIN || ""
});

const sendEmail = (to: string, subject: string, html: string) => {
  const emailData = {
    from: "dantalian04@gmail.com",
    to,
    subject,
    html
  };
  return mailGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (email:string, fullName: string, key: string) => {
  const emailSubject = `안녕하세요 ${fullName}님 가입해주셔서 감사합니다.`;
  const emailBody = `이메일을 인증해주세요 <a href="http://nuber.com/verification/${key}/"> 이메일 인증 </a>`;
  return sendEmail(email,emailSubject,emailBody);
};
