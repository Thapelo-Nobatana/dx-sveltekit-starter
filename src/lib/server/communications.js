import { env } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";
// @ts-ignore
import { cons } from "effect/List";
import { createTransport } from "nodemailer";

const transporter = createTransport({
    service: env.SMTP_EMAIL_SERVICE,
    auth: {
        user: env.SMTP_EMAIL_ADDRESS,
        pass: "jjef kvlh glko gbts"
    }
});

console.log("env.SMTP_EMAIL_SERVICE:", env.SMTP_EMAIL_SERVICE);
console.log("env.SMTP_EMAIL_ADDRESS:", env.SMTP_EMAIL_ADDRESS);
console.log("env.SMTP_EMAIL_PASSWORD:", env.SMTP_EMAIL_PASSWORD);
console.log("publicEnv.PUBLIC_BASE_URL:", env.SMTP_EMAIL_PASSWORD);

// @ts-ignore
export const sendPasswordResetEmail = async (userAccount, oneTimeTokenValue) => {
    let formatted = `Hi ${userAccount.first_name || "User"}! <br><br>
    A request to reset your password has been received.<br>
    If this was not you, you can safely ignore this email.<br><br><br>
    
    <a href="${publicEnv.PUBLIC_BASE_URL}/confirm-password-reset?token=${oneTimeTokenValue}">Reset Password</a>`;

    const mailOptions = {
        from: env.SMTP_EMAIL_ADDRESS,
        to: userAccount.email_address,
        subject: `Password Reset Requested`,
        html: formatted
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};
