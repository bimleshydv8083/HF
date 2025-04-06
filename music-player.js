class MusicPlayer {
  constructor() {
    this.player = null;
    this.isPlaying = false;
    this.currentTrack = null;
  }

  async initialize() {
    return new Promise((resolve) => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const token = localStorage.getItem('spotify_access_token');
        this.player = new Spotify.Player({
          name: 'Music Player',
          getOAuthToken: cb => cb(token),
          volume: 0.7
        });

        this.player.addListener('ready', ({ device_id }) => {
          console.log('Player ready with Device ID:', device_id);
          resolve();
        });

        this.player.addListener('player_state_changed', state => {
          this.isPlaying = !state.paused;
          this.currentTrack = state.track_window.current_track;
          this.updateUI();
        });

        this.player.connect();
      };

      // Load the Web Playback SDK if not already loaded
      if (!window.Spotify) {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        document.head.appendChild(script);
      }
    });
  }

  async playTrack(trackUri) {
    if (!this.player) await this.initialize();
    await this.player.play({ uris: [trackUri] });
  }

  async togglePlay() {
    if (!this.player) await this.initialize();
    await this.player.togglePlay();
  }

  updateUI() {
    // Update play/pause button
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
      playBtn.innerHTML = this.isPlaying 
        ? '<i class="fas fa-pause"></i>' 
        : '<i class="fas fa-play"></i>';
    }

    // Update track info
    const trackInfo = document.getElementById('current-track');
    if (trackInfo && this.currentTrack) {
      trackInfo.textContent = `${this.currentTrack.name} - ${this.currentTrack.artists[0].name}`;
    }
  }
}

const musicPlayer = new MusicPlayer();