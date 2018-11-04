import React, { Component } from 'react'
import './App.css'
import MapContainer from './components/MapContainer'
import locations from './data/locations.json'
import LocationsDrawer from './components/LocationsDrawer';

class App extends Component {
  state = {
    all: locations,
    lat: 40.117243, 
    lng: -88.240827,
    zoom: 16,
    open: true
  }

  styles = {
    menuButton: {
        //TODO
    },
    hide: {
      display: 'none'
    },

  }

  // open or shut the LocationsDrawer (help from demos listed here: https://material-ui.com/demos/drawers/)
  handleDrawerOpen = () => {
    this.setState({
      open: !this.state.open
    });
  };

  //TODO query function for filtering the list

  render() {
    return (
      <div className="App">
        <div>
          <h1 className="heading">FoodFinder</h1>
        </div>
        <MapContainer
          locations={this.state.all}
          lat={this.state.lat}
          lng={this.state.lng}
          zoom={this.state.zoom}
        />
        <LocationsDrawer
          locations={this.state.all}
          open={this.state.open}
          handleDrawerOpen={this.handleDrawerOpen}
          //to pass in the filtered locations
        />
      </div>
    );
  }
}

export default App
