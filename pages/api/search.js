// pages/api/search.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { queries } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    if (!queries || !Array.isArray(queries)) {
      throw new Error('Queries array is required');
    }

    const allSources = [];

    // Process each search query
    for (const query of queries) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Search for: ${query}. Return only a JSON array of the top 3 most authoritative sources with this format: [{"title": "...", "url": "...", "summary": "..."}]. Only return valid JSON, no other text.`
          }],
          tools: [{
            type: "web_search_20250305",
            name: "web_search"
          }]
        })
      });

      if (!response.ok) {
        console.error(`Search failed for query: ${query}`);
        continue;
      }

      const data = await response.json();
      
      if (data.content) {
        const textContent = data.content
          .filter(item => item.type === 'text')
          .map(item => item.text)
          .join('');
        
        try {
          // Try to extract JSON from the response
          const jsonMatch = textContent.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const sources = JSON.parse(jsonMatch[0]);
            if (Array.isArray(sources)) {
              allSources.push(...sources.slice(0, 2));
            }
          }
        } catch (e) {
          console.log('Could not parse sources from query:', query);
        }
      }
    }

    // Remove duplicates based on URL
    const uniqueSources = allSources.filter((source, index, self) =>
      index === self.findIndex(s => s.url === source.url)
    );

    res.status(200).json({ 
      sources: uniqueSources.slice(0, 10) 
    });

  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}
