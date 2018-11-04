import React, { Component } from 'react'
import './App.css'
import MapContainer from './components/MapContainer'
import locations from './data/locations.json'
import LocationsDrawer from './components/LocationsDrawer'


class App extends Component {
  state = {
    all: locations,
    lat: 40.117243, 
    lng: -88.240827,
    zoom: 16,
    drawerOpen: true,
    query: ''
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
      drawerOpen: !this.state.drawerOpen
    });
  };

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
          open={this.state.drawerOpen}
          handleDrawerOpen={this.handleDrawerOpen}
          query={this.state.query}
        />
      </div>
    );
  }
}

export default App
