type Podcast = {
    category?: string;
    episode_number?: number;
    title: string;
    description: string;
    run_time?: number;
    upload_date: string;
    videoId: string;
    shortSuck?: boolean;
  };

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

interface Item {
    id: string,
    catagory: Category,
    episode_number: number,
    title: string,
    description: string,
    run_time: string,
    upload_date: Date,
    link: string
}

interface Videos {
    title: string;
    description: string;
    videoId: string;
    upload_date: string;
    position: number;
    shortSuck: boolean;
}

interface Category {
    value: string,
}

interface Params {
    id: string;
}

interface RequestProps {
    videoId: string;
}