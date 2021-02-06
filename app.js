require('dotenv').config();

const {
  response,
  request
} = require('express');
const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/', (request, response) => {
  response.render('home.hbs');
})

app.get('/artist-search', (request, response) => {
  const artist = request.query.theArtistName;

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      response.render('search-results.hbs', {
        artists: data.body.artists.items
      })

    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});


app.get('/albums/:artistName/:artistId', (request, response) => {
  const artistId = request.params.artistId;
  const artistName = request.params.ArtistName;

  spotifyApi.getArtistAlbums(artistId)
    .then((data) => {
      const albums = data.body.items;
      response.render('albums.hbs', {
        albums,
        artistName
      });
    })
    .catch(err => console.log(err));
});

app.get('/tracks/:albumId', (request, response) => {
  const albumId = request.params.albumId;

  spotifyApi.getAlbumTracks(albumId)

    .then((data) => {
      const tracks = data.body.items;
      response.render('tracks.hbs', {
        tracks});
    })
    .catch(err => console.log(err));

});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));