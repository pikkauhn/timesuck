import { format } from 'date-fns'

interface YoutubeVideoSnippet {
    publishedAt: string;
    channelId: string;
    title: string;
    thumbnails: { [key: string]: { url: string } };
    description: string;
}

interface YoutubeVideoItem {
    kind: string;
    etag: string;
    id: { kind: string; videoId: string; };
    snipped: YoutubeVideoSnippet;
}

interface YoutubePlaylistItemsListResponse {
    kind: string;
    etag: string;
    nextPageToken?: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: YoutubeVideoItem[];
}

interface YoutubeVideos {
    title: string;
    description: string;
    videoId: string;
    upload_date: string;
    position: number;
}

function removeWords(str: string, word1: string, word2: string, word3: string): string {
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
    return newString;
}

export async function getUploads(): Promise<YoutubeVideos[]> {
    let details: YoutubeVideos[] = [];
    const apiKey: string = process.env.NEXT_PUBLIC_YOUTUBE_API as string;
    const playlistId: string = process.env.NEXT_PUBLIC_PLAYLISTID as string;

    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('playlistId', playlistId);
    url.searchParams.set('type', 'podcast');
    url.searchParams.set('maxResults', '50');

    let nextPageToken: string | undefined | null = null;
    const allVideos: YoutubeVideoItem[] = [];

    do {
        if (nextPageToken) {
            url.searchParams.set('pageToken', nextPageToken);
        }

        const response = await fetch(url.toString());
        const data: YoutubePlaylistItemsListResponse = await response.json();

        allVideos.push(...data.items);
        nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    if (allVideos) {
        allVideos.map((data: any, idx: number) => {
            if (data.snippet.description !== 'This video is private.' && data.snippet.title !== 'Deleted video') {
                const reversedIdx = allVideos.length - idx;
                const dateString = data.snippet.publishedAt;
                const date: Date = new Date(dateString);
                const formattedDate: string = format(date, "MM-dd-yyyy");
                const title = data.snippet.title;
                const newTitle = removeWords(title, "Timesuck", "Timesuck Podcast", "Podcast")
                details.push({
                    'title': newTitle,
                    'description': data.snippet.description,
                    'videoId': 'https://www.youtube.com/watch?v=' + data.snippet.resourceId.videoId,
                    'upload_date': formattedDate,
                    'position': reversedIdx
                });
            }
        });
    }
    return details;
}

//Video Links = https://www.youtube.com/watch?v=