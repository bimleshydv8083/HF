class SpotifyPlayer {
  constructor() {
    this.player = null;
    this.deviceId = null;
  }

  async initialize() {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No access token available');

    this.player = new Spotify.Player({
      name: 'HarmonyFinder Player',
      getOAuthToken: cb => cb(token),
      volume: 0.5
    });

    this._setupEventListeners();
    await this.player.connect();
  }

  _setupEventListeners() {
    this.player.addListener('ready', ({ device_id }) => {
      this.deviceId = device_id;
      console.log('Player ready with device ID:', device_id);
    });

    this.player.addListener('player_state_changed', state => {
      console.log('Player state changed:', state);
    });

    this.player.addListener('initialization_error', ({ message }) => {
      console.error('Initialization Error:', message);
    });
  }

  async playTrack(trackUri) {
    if (!this.player) await this.initialize();
    
    try {
      await this.player.play({
        uris: [trackUri]
      });
      return true;
    } catch (error) {
      console.error('Playback failed:', error);
      return false;
    }
  }
}

const spotifyPlayer = new SpotifyPlayer();