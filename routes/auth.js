const express = require('express');
const router = express.Router();
const axios = require('axios');

// Spotify OAuth Login
router.get('/login', (req, res) => {
  const scopes = 'user-read-private user-read-email streaming user-library-read';
  const redirectUri = process.env.REDIRECT_URI || 'http://localhost:8000/auth/callback';
  
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', process.env.SPOTIFY_CLIENT_ID);
  authUrl.searchParams.append('scope', scopes);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  
  res.redirect(authUrl.toString());
});

// Spotify OAuth Callback
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) throw new Error('Authorization code missing');

    const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.REDIRECT_URI,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    // Return tokens to frontend
    res.redirect(`/?access_token=${response.data.access_token}&refresh_token=${response.data.refresh_token}`);
  } catch (error) {
    console.error('Authentication error:', error);
    res.redirect('/?error=authentication_failed');
  }
});

module.exports = router;