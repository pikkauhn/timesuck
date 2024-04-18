import { SupabaseClient } from "@/app/components/system/SupaConx";
import { NextRequest, NextResponse } from "next/server";

const supabase = SupabaseClient.getSupabaseClient();

export async function POST(req: NextRequest) {
    const body = await req.json();

    if (!body || !body.category || !body.title || !body.videoId) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    };
    const podcast = body as Podcast;
    try {
        const { data: updateData, error: updateError } = await supabase
            .from('Podcasts')
            .update(podcast)
            .match({ videoId: podcast.videoId });
        if (updateError) {
            console.error('Error updating data: ', updateError);
            return NextResponse.json({ message: 'Failed to update Data' }, { status: 500 });
        };
        return NextResponse.json({ message: 'Data updated successfully' });
    } catch (error) {
        console.error('Unexpected error: ', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}