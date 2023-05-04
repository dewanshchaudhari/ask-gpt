import { prisma } from "../utils/initPrimsa";
import { RequestHandler } from 'express';
import { checkCredit, decrementCredit } from "../utils/queries";
export const checkDb: RequestHandler = async (req, res, next) => {
    try {
        //@ts-ignore
        const hasCredit = await checkCredit(req['phone']);
        if (!hasCredit) throw new Error("No Credits");
        const { subject, lang, age, type } = req.body;
        let record = await prisma.results.findFirst(
            {
                where: {
                    subject,
                    lang,
                    age: +age,
                    type
                }
            }
        );
        console.log(record);
        if (!record) {
            next();
        } else {
            //@ts-ignore
            await decrementCredit(req['phone']);
            res.json(record);
        }
    } catch (error) {
        next(error)
    }
}