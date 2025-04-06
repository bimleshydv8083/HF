// Spotify OAuth Configuration
// Register your app at https://developer.spotify.com/dashboard/
const CLIENT_ID = '1ae37e400c74464ea24b5bfdc5d21e89'; // Replace with your real client ID
const REDIRECT_URI = window.location.href.includes('localhost') 
    ? 'http://localhost:8000/index.html' 
    : 'https://your-production-domain.com/index.html';
const SCOPE = [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'streaming',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'app-remote-control'
].join(' ');

// Error states
const errorMap = {
    'access_denied': 'You need to grant permissions to use this app',
    'invalid_token': 'Session expired, please login again'
};

document.getElementById('spotify-login').addEventListener('click', () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}`;
    window.location.href = authUrl;
});

// Handle OAuth callback
if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (accessToken) {
        localStorage.setItem('spotify_access_token', accessToken);
        window.location.href = 'index.html';
    }
}

// Check for existing token on page load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('spotify_access_token')) {
        window.location.href = 'index.html';
    }
});