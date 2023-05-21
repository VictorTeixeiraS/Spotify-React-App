import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { response } from 'express';

const CLIENT_ID = "5e76a01f67e644718806f177e596fac4";
const CLIENT_SECRET = "bd82509aaac045828890cc2c026c5122";
const REACT_APP_REDIRECT_URI="http://localhost:3000/callback";
const REACT_APP_BASE_URL="https://localhost:3000";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [artistInfo, setArtistInfo] = useState([]);



  useEffect(() => {
    //ACCESS TOKEN 
    var authParameters = {
      method : "POST",
      headers : {
        "Content-Type" : "application/x-www-form-urlencoded",
      },
      body : "grant_type=client_credentials&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET,
    }

    fetch("https://accounts.spotify.com/api/token", authParameters)
    .then(result => result.json())
    .then(data => setAccessToken(data.access_token))
  }, [])

  // Search
  async function search(){
    console.log("Buscando por: " + searchInput);

    //Get request using searchInput to get artist ID
    var searchParameters = {
      method : "GET",
      headers : {
        'content-type' : 'application/json',
        'Authorization' : 'Bearer ' + accessToken,
      }
    }
    var artistId = await fetch("https://api.spotify.com/v1/search?q=" + searchInput + '&type=artist',  searchParameters)
    .then(response => response.json())
    .then(data => data.artists.items[0].id)


    //Get request using artist ID to Display their information
    var returnedArtistInfo = await fetch("https://api.spotify.com/v1/artists/" + artistId + "/albums" + "?inlcude_groups=album&market=US&limit=50", searchParameters)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setArtistInfo(data.items);
    });
    //Display Genres, Images, Name, Followers, etc. to the user
  }


  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Procure por um artista"
            type="input"
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={handleSearch}>Procurar</Button>
        </InputGroup>
      </Container>
      <Container>
        {artistInfo && (
          <Card>
            <Card.Img src={artistInfo.images[0].url} />
            <Card.Body>
              <Card.Title>{artistInfo.name}</Card.Title>
              <Card.Text>Generos: {artistInfo.genres.join(', ')}</Card.Text>
              <Card.Text>Streamers: {artistInfo.listeners}</Card.Text>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default App;
