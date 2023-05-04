import { prisma } from "../utils/initPrimsa";
import { RequestHandler } from 'express';
import fetch from "node-fetch";
export const auth: RequestHandler = async (req, res, next) => {
    try {
        const { waId } = req.params;
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
        if (json.status !== 'SUCCESS')
            return next('Authentication Failed');
        else {
            //@ts-ignore
            req['phone'] = json.data.userMobile;
            next();
        }
    } catch (error) {
        next(error)
    }
}