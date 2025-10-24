// Vercel Serverless API route for Google Places Autocomplete (NEW API v1)
export default async function handler(req, res) {
  const { input } = req.body; // Use 'input' parameter as per NEW API v1
  
  // Try to get API key from environment variables
  let apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
  
  console.log('Places API handler called with input:', input);
  console.log('API Key available:', !!apiKey);

  if (!input) {
    return res.status(400).json({ error: 'Missing input' });
  }

  if (!apiKey) {
    console.error('No API key found in environment variables');
    return res.status(400).json({ error: 'API key not configured' });
  }

  try {
    const url = 'https://places.googleapis.com/v1/places:autocomplete';
    console.log('Calling Google Places API...');
    
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

    if (!response.ok) {
      console.error('Google Places API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return res.status(response.status).json({ error: 'Google Places API error' });
    }

    const data = await response.json();
    console.log('Google Places API response:', data);
    res.status(200).json(data);
  } catch (err) {
    console.error('Failed to fetch from Google Places API (v1):', err);
    res.status(500).json({ error: 'Failed to fetch from Google Places API (v1)', details: err.message });
  }
}
