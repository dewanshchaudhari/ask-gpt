import { OpenAIStream, OpenAIStreamPayload } from "./openAIStreams";
if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing env var from OpenAI");
}
export const generate = async (subject: string, lang: string, age: string, type: string) => {
    let prompt = `Consider yourself a finance expert who is trying to ${type} a complex topic to `;
    if (age === '5') prompt += 'a 5 year old. ';
    if (age === '10') prompt += 'a 10 year old. ';
    if (age === '20') prompt += 'a 20 year old. ';
    if (age === '-1') prompt += 'another Expert. ';
    prompt += `You have to ${type} the topic in `;
    if (lang === 'en') prompt += 'english language. ';
    if (lang === 'hi') prompt += 'hindi language. ';
    prompt += `The topic to be explained is ${subject}. `;
    prompt += 'Limit your answer to 1000 words.'
    console.log(prompt);
    const payload: OpenAIStreamPayload = {
        model: "text-davinci-003",
        prompt,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 1000,
        stream: true,
        n: 1,
    };
    const stream = await OpenAIStream(payload);
    return stream;
}