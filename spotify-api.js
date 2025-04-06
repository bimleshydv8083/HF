class SpotifyAPI {
    constructor() {
        this.accessToken = localStorage.getItem('spotify_access_token');
        this.baseUrl = 'https://api.spotify.com/v1';
    }

    async fetchWithAuth(url, options = {}) {
        if (!this.accessToken) {
            console.error('No access token available');
            return null;
        }

        const headers = {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            ...options.headers
        };

        try {
            const response = await fetch(`${this.baseUrl}${url}`, {
                ...options,
                headers
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired, redirect to login
                    localStorage.removeItem('spotify_access_token');
                    window.location.href = 'login.html';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            return null;
        }
    }

    // User endpoints
    async getCurrentUser() {
        return this.fetchWithAuth('/me');
    }

    // Search endpoints
    async search(query, types = ['track', 'artist', 'album'], limit = 10) {
        const typeParam = types.join(',');
        return this.fetchWithAuth(`/search?q=${encodeURIComponent(query)}&type=${typeParam}&limit=${limit}`);
    }

    // Track endpoints
    async getTrack(id) {
        return this.fetchWithAuth(`/tracks/${id}`);
    }

    // Artist endpoints
    async getArtist(id) {
        return this.fetchWithAuth(`/artists/${id}`);
    }

    async getArtistTopTracks(id, country = 'US') {
        return this.fetchWithAuth(`/artists/${id}/top-tracks?market=${country}`);
    }

    // Recommendations
    async getRecommendations(seed_artists, seed_genres, seed_tracks, limit = 20) {
        return this.fetchWithAuth(`/recommendations?seed_artists=${seed_artists}&seed_genres=${seed_genres}&seed_tracks=${seed_tracks}&limit=${limit}`);
    }
}

// Initialize API client
const spotifyAPI = new SpotifyAPI();