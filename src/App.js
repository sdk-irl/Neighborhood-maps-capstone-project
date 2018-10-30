import React, { Component } from 'react';
import './App.css';
import Map from './components/Map';

class App extends Component {
  state = {
    lat: 40.1164, 
    lng: 88.2434,
    zoom: 12,
//    all: locations
  }

  render() {
    return (
      <div className="App">
        <Map
          lat={this.state.lat}
          lng={this.state.lng}
          zoom={this.state.zoom}
//          locations={this.state.all}
        />
      </div>
    );
  }
}

export default App;
