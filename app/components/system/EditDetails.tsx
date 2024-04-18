import { format } from 'date-fns'

function removeWords(str: string, word1: string, word2: string, word3: string, word4: string): string {
    let newString = str;
    newString = newString.replace(new RegExp(/\|/g, ''), '');
    if (newString.includes(word1)) {
        newString = newString.replace(new RegExp(word1, 'gi'), '');
    }
    if (newString.includes(word2)) {
        newString = newString.replace(new RegExp(word2, 'gi'), '');
    }
    if (newString.includes(word3)) {
        newString = newString.replace(new RegExp(word3, 'gi'), '');
    }
    if (newString.includes(word4)) {
        newString = newString.replace(new RegExp(word4, 'gi'), '');
    }
    return newString;
}

export async function convertItems(videos: YoutubeVideoItem[]): Promise<YoutubeVideos[]> {
    const details: YoutubeVideos[] = [];
    if (videos) {
        videos.map((data: any, idx: number) => {            
            if (data.snippet.description !== 'This video is private.' && data.snippet.title !== 'Deleted video') {
                const reversedIdx = videos.length - idx;
                const dateString = data.snippet.publishedAt;
                const date: Date = new Date(dateString);
                const formattedDate: string = format(date, "MM-dd-yyyy");
                const title = data.snippet.title;
                const newTitle = removeWords(title, "Timesuck", "Timesuck Podcast", "Podcast", '-'
                )

                details.push({
                    'title': newTitle,
                    'description': data.snippet.description,
                    'videoId': data.snippet.resourceId.videoId,
                    'upload_date': formattedDate,
                    'position': reversedIdx,
                    'shortSuck': false
                });
            }
        });
    }
    return details;
}

//Video Links = https://www.youtube.com/watch?v=