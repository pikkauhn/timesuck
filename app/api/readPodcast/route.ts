import { SupabaseClient } from "@/app/components/system/SupaConx";
import { NextRequest, NextResponse } from "next/server";

const supabase = SupabaseClient.getSupabaseClient();

export async function POST(req: NextRequest) {
    const columns = ['category', 'episode_number', 'title', 'description', 'run_time', 'upload_date', 'videoId', 'shortSuck', 'position'];
    const { data: podcasts, error: readPodcastError } = await supabase
        .from('Podcasts')
        .select(columns.join(', '));

    if (readPodcastError) {
        console.error('Error fetching data: ', readPodcastError);
        return NextResponse.json({ message: 'Failed to fetch data' }, { status: 500 })
    }

    return NextResponse.json(podcasts)
}