document.addEventListener('DOMContentLoaded', async () => {
  // Connect player to track elements
  document.querySelectorAll('.track').forEach(track => {
    track.addEventListener('click', async () => {
      try {
        await spotifyPlayer.playTrack(track.dataset.trackUri);
        // Update UI to show currently playing track
        document.querySelectorAll('.track').forEach(t => {
          t.classList.toggle('now-playing', t === track);
        });
      } catch (error) {
        console.error('Playback failed:', error);
      }
    });
  });
    // Check authentication
    if (!localStorage.getItem('spotify_access_token')) {
        window.location.href = 'login.html';
        return;
    }

    // Load user profile
    try {
        const user = await spotifyAPI.getCurrentUser();
        if (user) {
            document.querySelectorAll('.user-name').forEach(el => {
                el.textContent = user.display_name || 'User';
            });
            
            if (user.images && user.images.length > 0) {
                document.querySelectorAll('.user-avatar').forEach(el => {
                    el.src = user.images[0].url;
                });
            }
        }
    } catch (error) {
        console.error('Failed to load user profile:', error);
    }

    // Setup search functionality
    const searchInput = document.querySelector('input[type="text"]');
    const searchButton = document.querySelector('button .fa-search').parentElement;
    
    const performSearch = async () => {
        const query = searchInput.value.trim();
        const resultsContainer = document.getElementById('search-results');
        const recommendationsGrid = document.getElementById('recommendations-grid');
        
        if (query.length < 2) {
            resultsContainer.classList.add('hidden');
            recommendationsGrid.classList.remove('hidden');
            return;
        }
        
        try {
            resultsContainer.classList.remove('hidden');
            recommendationsGrid.classList.add('hidden');
            resultsContainer.innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin text-green-500"></i></div>';
            
            const results = await spotifyAPI.search(query);
            if (results?.tracks?.items) {
                generateMusicCards(results.tracks.items, 'search-results');
            } else {
                resultsContainer.innerHTML = '<div class="text-center py-4 text-gray-400">No results found</div>';
            }
        } catch (error) {
            console.error('Search failed:', error);
            document.getElementById('search-results').innerHTML = `
                <div class="text-center py-4 text-red-400">
                    <i class="fas fa-exclamation-circle"></i> Search failed. Please try again.
                </div>
            `;
        }
    };

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    searchButton.addEventListener('click', performSearch);

    // Load initial recommendations
    loadRecommendations();
    
    // Setup player controls
    setupPlayerControls();
});

function generateMusicCards(tracks, containerId = 'recommendations-grid') {
    const container = document.getElementById(containerId);
    if (!container || !tracks) return;

    container.innerHTML = '';
    
    tracks.forEach(track => {
        const card = document.createElement('div');
        card.className = 'search-result bg-gray-800 p-4 rounded-lg transition duration-300 cursor-pointer';
        card.innerHTML = `
            <div class="relative mb-4 group">
                <img src="${track.album.images[0]?.url || 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg'}" 
                     alt="${track.name}" 
                     class="w-full aspect-square object-cover rounded">
                <button class="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <i class="fas fa-play text-white"></i>
                </button>
            </div>
            <h3 class="font-semibold truncate">${track.name}</h3>
            <p class="text-gray-400 text-sm truncate">${track.artists.map(a => a.name).join(', ')}</p>
        `;
        container.appendChild(card);
    });
}

async function loadRecommendations() {
    try {
        const recommendations = await spotifyAPI.getRecommendations(
            '4gzpq5DPGxSnKTe4SA8HAU', // Coldplay artist ID as seed
            'pop,rock',                // Genres
            '0rTVFDoAu1bEkLz2a6x2U6',  // Fix You track ID as seed
            10                         // Limit
        );
        
        if (recommendations?.tracks) {
            generateMusicCards(recommendations.tracks);
        }
    } catch (error) {
        console.error('Failed to load recommendations:', error);
        document.getElementById('recommendations-grid').innerHTML = `
            <div class="col-span-full text-center text-gray-400 py-8">
                <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
                <p>Failed to load recommendations. Please try again later.</p>
            </div>
        `;
    }
}

// Player controls
function setupPlayerControls() {
    const playBtn = document.querySelector('#play-btn');
    const prevBtn = document.querySelector('#prev-btn');
    const nextBtn = document.querySelector('#next-btn');
    const progressBar = document.querySelector('#progress-bar');
    const progressContainer = document.querySelector('#progress-container');
    const currentTimeEl = document.querySelector('#current-time');
    const durationEl = document.querySelector('#duration');
    
    let isPlaying = false;
    let currentTrack = null;

    // Toggle play/pause
    function togglePlay() {
        isPlaying = !isPlaying;
        playBtn.innerHTML = isPlaying 
            ? '<i class="fas fa-pause"></i>' 
            : '<i class="fas fa-play"></i>';
        
        // In a real app, this would control actual audio playback
        console.log(isPlaying ? 'Playing' : 'Paused');
    }

    // Update progress bar
    function updateProgress(e) {
        if (isPlaying) {
            const { duration, currentTime } = e.target;
            const progressPercent = (currentTime / duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            // Update time display
            currentTimeEl.textContent = formatTime(currentTime);
            durationEl.textContent = formatTime(duration);
        }
    }

    // Set progress when clicked on progress bar
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = currentTrack?.duration || 180; // Default 3 mins if no track
        const newTime = (clickX / width) * duration;
        
        // In a real app, this would seek the audio
        console.log(`Seek to: ${newTime}s`);
        progressBar.style.width = `${(clickX / width) * 100}%`;
    }

    // Format time as MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Event listeners
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', () => console.log('Previous track'));
    nextBtn.addEventListener('click', () => console.log('Next track'));
    progressContainer.addEventListener('click', setProgress);

    // Initialize
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '3:30'; // Default duration
}
