import { SupabaseClient } from "@/app/components/system/SupaConx";
import { NextRequest, NextResponse } from "next/server";

const supabase = SupabaseClient.getSupabaseClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
console.log(body)
  if (!body || !Array.isArray(body)) {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  const podcasts = body as Podcast[];

  try {
    const { data: upsertedData, error: upsertError } = await supabase
      .from('Podcasts')
      .upsert(podcasts, { onConflict: 'id' });

    if (upsertError) {
      console.error('Error upserting data:', upsertError);
      return NextResponse.json({ message: 'Failed to process data' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Data processed successfully' });
  } catch (error) {
    console.error('Unexpected error: ', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}