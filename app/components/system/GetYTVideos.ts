import { convertItems } from "./EditDetails";

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

export async function getYTUploads(): Promise<YoutubeVideos[]> {
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