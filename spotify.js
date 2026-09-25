// Flujo PKCE Spotify para SPA
// Basado en: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

const redirectUri = window.location.origin + window.location.pathname;

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

import CryptoJS from 'crypto-js';

async function generateCodeChallenge(codeVerifier) {
  const hash = CryptoJS.SHA256(codeVerifier);
  const base64 = CryptoJS.enc.Base64.stringify(hash);
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function loginSpotify(clientId) {
  const verifier = generateRandomString(128);
  localStorage.setItem('spotify_verifier', verifier);
  const challenge = await generateCodeChallenge(verifier);

  const scope = 'user-read-currently-playing user-read-playback-state';
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  window.localStorage.setItem('spotify_client_id_temp', clientId); // Temporal para el callback

  const params =  {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}

async function fetchToken(code) {
  const verifier = localStorage.getItem('spotify_verifier');
  const clientId = localStorage.getItem('spotify_client_id_temp');
  
  const payload = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    }),
  };

  const body = await fetch('https://accounts.spotify.com/api/token', payload);
  const response = await body.json();
  
  if (response.access_token) {
    localStorage.setItem('spotify_access_token', response.access_token);
    localStorage.setItem('spotify_refresh_token', response.refresh_token);
    
    // Limpiar URL
    window.history.replaceState({}, document.title, redirectUri);
    return true;
  }
  return false;
}

async function refreshToken(clientId) {
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  const payload = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId
    }),
  };
  const body = await fetch('https://accounts.spotify.com/api/token', payload);
  const response = await body.json();
  if (response.access_token) {
    localStorage.setItem('spotify_access_token', response.access_token);
    if (response.refresh_token) {
      localStorage.setItem('spotify_refresh_token', response.refresh_token);
    }
  }
}

export async function initSpotify(config) {
  const btn = document.getElementById('spotify-login-btn');
  const status = document.getElementById('spotify-status');
  const title = document.getElementById('spotify-title');
  const artist = document.getElementById('spotify-artist');
  const pulse = document.getElementById('spotify-pulse');
  const cover = document.getElementById('spotify-cover');
  const placeholder = document.getElementById('spotify-placeholder');
  const bg = document.getElementById('spotify-bg');

  // Si volvemos del login
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');
  if (code) {
    await fetchToken(code);
  }

  if (!config || !config.spotifyId) {
    title.textContent = "Falta Client ID";
    artist.textContent = "Configura en Ajustes";
    btn.classList.add('hidden');
    return;
  }

  const accessToken = localStorage.getItem('spotify_access_token');
  
  if (!accessToken) {
    status.textContent = "Requiere Login";
    title.textContent = "Vincular Cuenta";
    artist.textContent = "Inicia sesión con Spotify";
    btn.classList.remove('hidden');
    
    btn.onclick = () => loginSpotify(config.spotifyId);
    return;
  }

  btn.classList.add('hidden');
  
  async function pollSpotify() {
    try {
      let token = localStorage.getItem('spotify_access_token');
      let res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { 'Authorization': 'Bearer ' + token }
      });

      if (res.status === 401) {
        // Token vencido, refrescar
        await refreshToken(config.spotifyId);
        token = localStorage.getItem('spotify_access_token');
        res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
      }

      if (res.status === 200) {
        const data = await res.json();
        if (data.is_playing && data.item) {
          status.textContent = "Now Playing";
          pulse.classList.remove('hidden');
          title.textContent = data.item.name;
          artist.textContent = data.item.artists.map(a => a.name).join(', ');
          
          if (data.item.album.images.length > 0) {
            const imgUrl = data.item.album.images[0].url;
            cover.src = imgUrl;
            bg.style.backgroundImage = `url(${imgUrl})`;
            
            cover.classList.remove('hidden');
            bg.classList.remove('hidden');
            placeholder.classList.add('hidden');
          }
          return;
        }
      }
      
      // No está escuchando nada (204) o pausado
      status.textContent = "En pausa";
      pulse.classList.add('hidden');
      title.textContent = "Nada sonando";
      artist.textContent = "Abre Spotify para escuchar";
      
      cover.classList.add('hidden');
      bg.classList.add('hidden');
      placeholder.classList.remove('hidden');

    } catch (e) {
      console.error(e);
      status.textContent = "Error";
      title.textContent = "Error de conexión";
    }
  }

  pollSpotify();
  setInterval(pollSpotify, 5000); // Polling cada 5s
}
