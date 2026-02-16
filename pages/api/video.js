// pages/api/video.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, imageBase64, action } = req.body;

    if (!process.env.KLING_ACCESS_KEY || !process.env.KLING_SECRET_KEY) {
      throw new Error('Kling API credentials not configured');
    }

    const klingEndpoint = process.env.KLING_API_ENDPOINT || 'https://api.klingai.com/v1';

    if (action === 'create') {
      // Step 1: Create video generation task
      const createResponse = await fetch(`${klingEndpoint}/videos/text2video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.KLING_ACCESS_KEY,
          'X-API-Secret': process.env.KLING_SECRET_KEY
        },
        body: JSON.stringify({
          model: "kling-v1",
          prompt: text,
          image: `data:image/jpeg;base64,${imageBase64}`,
          duration: 5,
          aspect_ratio: "16:9"
        })
      });

      if (!createResponse.ok) {
        const error = await createResponse.text();
        throw new Error(`Kling API error: ${error}`);
      }

      const createData = await createResponse.json();
      
      if (!createData.task_id) {
        throw new Error('No task_id returned from Kling API');
      }

      res.status(200).json({ 
        taskId: createData.task_id 
      });

    } else if (action === 'check') {
      // Step 2: Check task status
      const { taskId } = req.body;

      if (!taskId) {
        throw new Error('taskId is required for check action');
      }

      const statusResponse = await fetch(`${klingEndpoint}/videos/text2video/${taskId}`, {
        method: 'GET',
        headers: {
          'X-API-Key': process.env.KLING_ACCESS_KEY,
          'X-API-Secret': process.env.KLING_SECRET_KEY
        }
      });

      if (!statusResponse.ok) {
        const error = await statusResponse.text();
        throw new Error(`Kling status check error: ${error}`);
      }

      const statusData = await statusResponse.json();

      res.status(200).json({
        status: statusData.status,
        videoUrl: statusData.video_url || null,
        progress: statusData.progress || 0
      });

    } else {
      throw new Error('Invalid action. Use "create" or "check"');
    }

  } catch (error) {
    console.error('Video API error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}
