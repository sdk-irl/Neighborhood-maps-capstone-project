import React, { Component } from 'react'
import './App.css'
import MapContainer from './components/MapContainer'
import locations from './data/locations.json'

class App extends Component {
  state = {
    all: locations,
    lat: 40.117243, 
    lng: -88.240827,
    zoom: 13,
  }

  render() {
    return (
      <div className="App">
        <div>
          <h1>Name of this app</h1>
        </div>
        <MapContainer
          locations={this.state.all}
          lat={this.state.lat}
          lng={this.state.lng}
          zoom={this.state.zoom}
        />
      </div>
    );
  }
}

export default App
