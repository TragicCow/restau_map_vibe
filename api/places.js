// Vercel Serverless API route for Google Places Autocomplete (v1)
export default async function handler(req, res) {
  const { query, type = ['establishment', 'address', 'geocode'], country = ['GE'] } = req.body; // Parameters from request body
  const apiKey = "AIzaSyDpqgu2XeA4peLoQk0gO0rTLBWkrDTIdSA";//process.env.GOOGLE_MAPS_API_KEY; // Use correct env variable

  if (!query || !apiKey) {
    return res.status(400).json({ error: 'Missing query or API key' });
  }

  try {
    const url = 'https://places.googleapis.com/v1/places:autocomplete';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
      },
      body: JSON.stringify({
        input: query,
        includedPrimaryTypes: type,
        includedRegionCodes: country,
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Failed to fetch from Google Places API (v1):', err);
    res.status(500).json({ error: 'Failed to fetch from Google Places API (v1)' });
  }
}
