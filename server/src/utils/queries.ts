import { prisma } from "./initPrimsa";

export const insertIntoDb = async (result: string, subject: string, lang: string, age: string, type: string) => {
    try {
        const insertedResults = await prisma.results.create({
            data: {
                result,
                subject,
                lang,
                age: +age,
                type,
            }
        });
        console.log(insertedResults);
        return insertedResults;
    } catch (error) {
        return false;
    }
};
export const getResultsFromDb = async (id: number) => {
    try {
        const result = await prisma.results.findFirst({
            where: {
                id
            }
        });
        return result;
    } catch (error) {
        return false;
    }
}
export const insertUserIntoDb = async (phone: string, name: string) => {
    try {
        //need to change so that updated time gets updated every time user logins
        const user = await prisma.user.upsert({
            where: {
                phone
            },
            update: {
                name,
            },
            create: {
                phone,
                name,
                username: name,
            }
        });
        return user;
    } catch (error) {
        console.log(error);
        return false;
    }
}
export const checkCredit = async (phone: string) => {
    const record = await prisma.user.findUnique({
        where: {
            phone
        }
    });
    if (record && record.credit > 0)
        return true;
    else return false;
}
export const decrementCredit = async (phone: string) => {
    return await prisma.user.update({
        where: {
            //@ts-ignore
            phone,
        },
        data: {
            credit: {
                decrement: 1
            }
        }
    })
}
export const getSuggestions = async (query: any) => {
    try {
        return await prisma.results.findMany({
            where: {
                subject: {
                    startsWith: query
                }
            }
        })
    } catch (error) {
        console.log(error);
    }
};
export const addEmailToDb = async (email: string) => {
    return await prisma.emails.create({
        data: {
            email
        }
    })
}