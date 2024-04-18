import { convertItems } from "./EditDetails";


export async function GetDBVideos() {
    const allVideos: YoutubeVideoItem[] = [];
    try {
        const response = await fetch('/api/readPodcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const responseData = await response.json();
        console.log(responseData);
        if (responseData) {
            return responseData;
        } else {
            console.error('Error retrieving podcasts: ', responseData.message);
        }
    } catch (error) {
        console.error('Error getting data: ', error);
    }
}