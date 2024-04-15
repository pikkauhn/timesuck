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
    shortSuck: boolean;
}

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

async function fetchItems(url: URL): Promise<YoutubeVideoItem[]> {
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

    return allVideos;
}

async function convertItems(videos: YoutubeVideoItem[]): Promise<YoutubeVideos[]> {
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

export async function getUploads(): Promise<YoutubeVideos[]> {
    const apiKey: string = process.env.NEXT_PUBLIC_YOUTUBE_API as string;
    const playlistId: string = process.env.NEXT_PUBLIC_PLAYLISTID as string;
    const playlistId2: string = process.env.NEXT_PUBLIC_PLAYLISTID2 as string;

    let url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('playlistId', playlistId);
    url.searchParams.set('type', 'podcast');
    url.searchParams.set('maxResults', '50');

    const longVideos = await fetchItems(url);
    const converted = await convertItems(longVideos);    

    url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('playlistId', playlistId2);
    url.searchParams.set('type', 'podcast');
    url.searchParams.set('maxResults', '50');

    const shortVideos = await fetchItems(url);
    const converted2 = await convertItems(shortVideos);

    const shortSucks = converted2.map((data, idx) => {
        return { ...data, position: 0, shortSuck: true};
    })

    const allVideos = [...converted, ...shortSucks];

    return allVideos;
}

//Video Links = https://www.youtube.com/watch?v=