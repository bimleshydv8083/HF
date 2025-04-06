
Built by https://www.blackbox.ai

---

```markdown
# HarmonyFinder

## Project Overview
HarmonyFinder is a web application designed to help users discover their perfect music match with Spotify integration. The application allows users to log in with their Spotify account, search for musical content, and manage their playback experience efficiently. With an emphasis on a modern and user-friendly design, HarmonyFinder leverages the Spotify API to deliver personalized music recommendations and playback controls.

## Installation
To set up HarmonyFinder locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/harmonyfinder.git
   cd harmonyfinder
   ```

2. Open the `login.html`, `register.html`, or `index.html` file in a web browser. Make sure to serve the files over a local server to enable the OAuth flow properly.

3. Replace the `CLIENT_ID` in `auth.js` with your actual Spotify Application Client ID, which you can create in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

## Usage
1. Open `login.html` in your browser.
2. Log in using your email and password or click on the "Continue with Spotify" button to use your Spotify account.
3. Once logged in, you can search for songs, artists, or genres and manage your music playback through the interface.

## Features
- **Spotify Integration:** Seamlessly log in with your Spotify account to access personalized music recommendations.
- **User Authentication:** Register and log in with email/password or via Spotify OAuth.
- **Search Functionality:** Search for songs, artists, and albums using an intuitive search bar.
- **Music Playback Control:** Play, pause, skip, and seek through tracks with on-screen controls.
- **Responsive Design:** Built with Tailwind CSS for a modern and responsive user interface.

## Dependencies
This project utilizes the following dependencies:
- [Tailwind CSS](https://tailwindcss.com) - For styling and layout.
- [Font Awesome](https://fontawesome.com) - For icons.

No additional dependencies are specified in a `package.json` file since this is a front-end application.

## Project Structure
The project directory contains the following files:

```
/harmonyfinder
│
├── index.html         # Main application interface
├── login.html         # User login page
├── register.html      # User registration page
├── auth.js            # JavaScript for authentication and Spotify login
├── spotify-api.js     # API interaction logic with Spotify
├── player.js          # Controls for the Spotify Player
├── app.js             # Main application logic for loading user data and search
├── styles.css         # Custom styles (if applicable)
└── music-player.js    # Logic to manage music playback
```

### File Descriptions:
- **index.html**: The main view where users can discover music.
- **login.html**: Login interface for the application.
- **register.html**: Registration page for new users.
- **auth.js**: Handles authentication with the Spotify API.
- **spotify-api.js**: Contains methods to interact with the Spotify API.
- **player.js**: Manages playback functionalities and controls.
- **app.js**: Central logic for initializing components and user interactions.
- **styles.css**: Additional custom styles for the application.

## Contributing
Contributions are welcome! If you have suggestions for improvements or new features, please feel free to fork the repository and submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```