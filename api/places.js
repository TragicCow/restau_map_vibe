// Vercel Serverless API route for Google Places Autocomplete
export default async function handler(req, res) {
  const { query, type = 'establishment|address|geocode', country = 'GE' } = req.query;
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!query || !apiKey) {
    return res.status(400).json({ error: 'Missing query or API key' });
  }
  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}&types=${type}&components=country:${country}`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Google Places API' });
  }
}
