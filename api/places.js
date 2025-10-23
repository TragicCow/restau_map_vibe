// Vercel Serverless API route for Google Places Autocomplete (NEW API v1)
export default async function handler(req, res) {
  const { input } = req.body; // Use 'input' parameter as per NEW API v1
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY; // Try both env var names

  if (!input || !apiKey) {
    return res.status(400).json({ error: 'Missing input or API key' });
  }

  try {
    const url = 'https://places.googleapis.com/v1/places:autocomplete';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'suggestions.placePrediction.text,suggestions.placePrediction.placeId',
      },
      body: JSON.stringify({
        input: input,
        includedRegionCodes: ['GE'], // Focus on Georgia
        languageCode: 'en',
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Failed to fetch from Google Places API (v1):', err);
    res.status(500).json({ error: 'Failed to fetch from Google Places API (v1)' });
  }
}
