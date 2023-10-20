import ApiVideoClient from '@api.video/nodejs-client'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const defaultApiKey = process.env.API_KEY

    const sortBy = 'publishedAt'; // Allowed: publishedAt, title. You can search by the time videos were published at, or by title.
    const sortOrder = 'asc'; // Allowed: asc, desc. asc is ascending and sorts from A to Z. desc is descending and sorts from Z to A.
    const pageSize = 10; // Results per page. Allowed values 1-100, default is 25.


    const { videoId, metadata } = req.body
    const { method } = req.query
    const client = new ApiVideoClient({
        apiKey: defaultApiKey,
    })

    if (method == 'get') {
        const result = await client.videos.list({sortBy, sortOrder, pageSize})
        return res.status(200).json({ ...result })
    }

    // UPDATE DATA
    if (method === 'patch') {
        const videoUpdatePayload = {
            metadata, // A list (array) of dictionaries where each dictionary contains a key value pair that describes the video. As with tags, you must send the complete list of metadata you want as whatever you send here will overwrite the existing metadata for the video.
        }

        const result = await client.videos.update(videoId, videoUpdatePayload)
        res.status(204).send(result)
        return
    }
}
export default handler
