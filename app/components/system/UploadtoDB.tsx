export async function UploadtoDB(videos: any[] | any) {
    try {
        const response = await fetch('/api/createPodcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(videos),
        });

        const responseData = await response.json();
        console.log(responseData)
        if (responseData.message === 'Data processed successfully') {
            console.log('Podcasts upserted successfully!');
        } else {
            console.error('Error upserting podcasts: ', responseData.message);
        }
    } catch (error) {
        console.error('Error sending data: ', error);
    }
}