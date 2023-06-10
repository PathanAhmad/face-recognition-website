import './App.css';
import ParticlesBg from 'particles-bg'
import { Component } from 'react';
import Navigation from './Components/Navigation/Navigation.js';
import Logo from './Components/Logo/Logo.js'
import Rank from './Components/Rank/Rank.js'
import Clarifai from 'clarifai';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register'

const initialState = {
  input: '',
  imageURL: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (result) => {
    const clarifaiFace = result.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: (clarifaiFace.left_col * width),
      rightCol: width - (clarifaiFace.right_col * width),
      topRow: (clarifaiFace.top_row * height),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  }

  onInputChange = (event) => {
    this.setState({ imageURL: event.target.value });
  }

  onButtonSubmit = () => {
    this.fetchClarifai();
  }

  onRouteChange = (route) => {
    this.setState({ route: route })
  }

  setInitial = () => {
    this.setState(initialState)
  }

  fetchClarifai = () => {
    fetch('https://face-recognition-website-backend.onrender.com/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.imageURL
      })
    })
      .then(response => response.json())

      .then(result => {
        if (result) {
          fetch('https://face-recognition-website-backend.onrender.com/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
        }
        this.displayFaceBox(this.calculateFaceLocation(result))
        console.log(this.state.box)
      })

      .catch(error => console.log('error', error));

  }


  render() {
    return (
      <div className="App">
        <ParticlesBg type="circle" bg={true} />
        {this.state.route === 'home'
          ? <div>
            <Navigation onRouteChange={this.onRouteChange} setInitial={this.setInitial} />
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={this.state.box} imageURL={this.state.imageURL} />
          </div>
          : (
            this.state.route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
