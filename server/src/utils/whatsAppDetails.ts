import fetch from 'node-fetch';
import 'dotenv/config';
import { insertUserIntoDb } from './queries';
export const getUserWhatsAppDetails = async (waId: string) => {
    const response = await fetch('https://fimple.authlink.me/', {
        method: 'POST',
        body: JSON.stringify({ waId }),
        headers: {
            'Content-Type': 'application/json',
            clientId: process.env.OTP_LESS_CLIENT_ID ?? '',
            clientSecret: process.env.OTP_LESS_CLIENT_SECRET ?? '',
        }
    });
    const json = await response.json();
    if (json.status === 'FAILED') throw new Error('Auth Failed');
    const { data } = json;
    const user = await insertUserIntoDb(data.userMobile, data.userName)
    return user;
};