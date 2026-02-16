// pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, systemPrompt, documents } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    // Build the request to Anthropic
    const requestBody = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: systemPrompt,
      messages: messages
    };

    // Handle PDF documents if present
    if (documents && documents.length > 0) {
      const pdfDocs = documents.filter(d => d.type === 'pdf');
      
      if (pdfDocs.length > 0) {
        const lastMessage = requestBody.messages[requestBody.messages.length - 1];
        const userText = typeof lastMessage.content === 'string' 
          ? lastMessage.content 
          : lastMessage.content.find(c => c.type === 'text')?.text || '';
        
        lastMessage.content = [
          ...pdfDocs.map(doc => ({
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: doc.content
            }
          })),
          {
            type: 'text',
            text: userText
          }
        ];
      }
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
