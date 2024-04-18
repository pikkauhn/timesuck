export async function UploadtoDB(videos: any[]) {
    const formattedVideos = videos.map((obj) => {
        const { ['position']: _, ...rest } = obj;
        return rest;
    })
    try {
        const response = await fetch('/api/createPodcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formattedVideos),
        });

        const responseData = await response.json();
        if (responseData.message === 'Data processed successfully') {
            console.log('Podcasts upserted successfully!');
        } else {
            console.error('Error upserting podcasts: ', responseData.message);
        }
    } catch (error) {
        console.error('Error sending data: ', error);
    }
}