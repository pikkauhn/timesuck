import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { UploadtoDB } from "./UploadtoDB";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLEAI_API);

export async function GetCategories(videos: Videos[]) {
    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE
        },
    ];

    const model = genAI.getGenerativeModel({ model: 'gemini-pro', safetySettings });
    const prefix = "Consider the following description: "
    const suffix = "which one of these categories best fits that description?  True Crime, History, Serial Killer, Cult, Religion, Science, Conspiracies, Unsolved Mystery, Cryptids and Legends, Ladies, Human Interest"

    for (let i=0; i < videos.length; i++) {
        const data = videos[i];
        let text: string = '';
        let timer: number = 5000;
        
        if (!data.category) {
            timer = 5000;
            const message = `${prefix}${data.description} ${suffix}`
            const result = await model.generateContent(message);
            const response = await result.response;
            try {
                text = response.text();
            } catch (error) {
                console.error(error);
            }            

            videos[i].category = text;
            await UploadtoDB(videos[i]);            
        }
        if (data.category) {
            console.log(data.position + 'Categorized');
            timer = 100;
        }
        await new Promise((resolve) => setTimeout(resolve, timer));
    }   
}