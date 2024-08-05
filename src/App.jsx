import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tracks, setTracks] = useState([]);
  const [keyword, setKeyword] = useState("trending");
  const [selectedTracks, setSelectedTracks] = useState({});
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const getTracks = async (searchKeyword) => {
    let data = await fetch(`https://v1.nocodeapi.com/riyaverma2025/spotify/XqfLKxeqkqXWUemi/search?q=${searchKeyword}&type=track`);
    let convertedData = await data.json();
    console.log(convertedData.tracks.items);
    setTracks(convertedData.tracks.items);
  };

  useEffect(() => {
    getTracks(keyword);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    getTracks(keyword);
  };

  const handleCheckboxChange = (track) => {
    setSelectedTracks((prevSelectedTracks) => ({
      ...prevSelectedTracks,
      [track.id]: track,
    }));
  };

  const handleCreatePlaylist = () => {
    if (playlistName && Object.keys(selectedTracks).length > 0) {
      setPlaylists((prevPlaylists) => [
        ...prevPlaylists,
        {
          name: playlistName,
          tracks: Object.values(selectedTracks),
        },
      ]);
      setSelectedTracks({});
      setPlaylistName("");
    }
  };

  const handlePlaylistClick = (playlist) => {
    setCurrentPlaylist(playlist);
  };

  const handleHomeClick = () => {
    setCurrentPlaylist(null);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? "dark-mode" : "light-mode"}>
      <nav className={`navbar navbar-expand-lg ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#" onClick={handleHomeClick}>
            MusicOnTip
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse d-flex justify-content-center" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#" onClick={handleHomeClick}>
                  Home
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Playlists
                </a>
                <ul className="dropdown-menu">
                  {playlists.map((playlist, index) => (
                    <li key={index}>
                      <a className="dropdown-item" href="#" onClick={() => handlePlaylistClick(playlist)}>
                        {playlist.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            <form className="d-flex" role="search" onSubmit={handleSearch}>
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                className="form-control me-2"
                type="search"
                placeholder="Search Songs Here"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
            <button className="btn btn-outline-secondary ms-3" onClick={toggleDarkMode}>
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      </nav>

      <div className="container my-4">
        <h3>Create Playlist</h3>
        <input
          type="text"
          value={playlistName}
          onChange={(event) => setPlaylistName(event.target.value)}
          className="form-control"
          placeholder="Playlist Name"
        />
        <button onClick={handleCreatePlaylist} className="btn btn-primary mt-2">
          Create Playlist
        </button>
      </div>

      <div className="container">
        <div className="row">
          {!currentPlaylist ? (
            tracks.map((track) => {
              return (
                <div key={track.id} className="col-lg-3 col-md-6 py-3">
                  <div className="card">
                    <img src={track.album.images[1].url} className="card-img-top" alt="..." />
                    <div className="card-body">
                      <h5 className="card-title">{track.name}</h5>
                      <p className="card-text">
                        Artist: {track.album.artists[0].name}
                      </p>
                      <p className="card-text">
                        Release Date: {track.album.release_date}
                      </p>
                      <audio src={track.preview_url} controls className='w-100'></audio>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={track.id}
                          onChange={() => handleCheckboxChange(track)}
                          checked={!!selectedTracks[track.id]}
                        />
                        <label className="form-check-label">
                          Add to Playlist
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            currentPlaylist.tracks.map((track) => {
              return (
                <div key={track.id} className="col-lg-3 col-md-6 py-3">
                  <div className="card">
                    <img src={track.album.images[1].url} className="card-img-top" alt="..." />
                    <div className="card-body">
                      <h5 className="card-title">{track.name}</h5>
                      <p className="card-text">
                        Artist: {track.album.artists[0].name}
                      </p>
                      <p className="card-text">
                        Release Date: {track.album.release_date}
                      </p>
                      <audio src={track.preview_url} controls className='w-100'></audio>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="container my-4">
        <h3>Your Playlists</h3>
        {playlists.map((playlist, index) => (
          <div key={index} className="card my-2">
            <div className="card-body">
              <h5 className="card-title">{playlist.name}</h5>
              <button type="button" className="btn btn-success" onClick={() => handlePlaylistClick(playlist)}>View Playlist</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
