class SpotifyPlayerController {
  constructor() {
    this.player = null;
    this.deviceId = null;
    this.currentTrack = null;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('spotify_access_token');
      if (!token) return reject('No access token available');

      // Load Spotify Web Playback SDK if not already loaded
      if (!window.Spotify) {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.onload = () => this._setupPlayer(token, resolve, reject);
        document.head.appendChild(script);
      } else {
        this._setupPlayer(token, resolve, reject);
      }
    });
  }

  _setupPlayer(token, resolve, reject) {
    this.player = new Spotify.Player({
      name: 'HarmonyFinder Player',
      getOAuthToken: cb => cb(token),
      volume: 0.8
    });

    // Error handling
    this.player.addListener('initialization_error', ({ message }) => {
      console.error('Initialization Error:', message);
      reject(message);
    });

    // Ready event
    this.player.addListener('ready', ({ device_id }) => {
      this.deviceId = device_id;
      console.log('Player ready with Device ID:', device_id);
      resolve();
    });

    this.player.connect();
  }

  async playTrack(trackUri) {
    if (!this.player) await this.initialize();
    await this.player.play({ uris: [trackUri] });
  }

  async togglePlay() {
    if (!this.player) await this.initialize();
    await this.player.togglePlay();
  }
}

const spotifyPlayer = new SpotifyPlayerController();