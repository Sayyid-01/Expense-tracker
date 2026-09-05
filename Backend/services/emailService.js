import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';

dotenv.config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SIB_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendForgotPasswordMail = async (email, resetLink) => {
    try {
        const sendSmtpEmail = {
            sender: {
                email: "sayyid216s@gmail.com",
                name: "Expense Tracker",
            },
            to: [
                {
                    email: email,
                },
            ],
            subject: "Password Reset Request",
            textContent: `Your password reset request was received. Click the link to reset your password: ${resetLink}`
        };
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        return true;
    } catch (error) {
        return false;
    }
};
