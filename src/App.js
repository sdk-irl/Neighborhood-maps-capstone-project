import React, { Component } from 'react'
import './App.css'
import MapContainer from './components/MapContainer'
import locations from './data/locations.json'
import LocationsDrawer from './components/LocationsDrawer'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'


class App extends Component {
  state = {
    all: locations,
    lat: 40.117243, 
    lng: -88.240827,
    zoom: 16,
    drawerOpen: true,
    query: '',
    showingRestaurants: locations
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

      //  query that user types in to filter restaurants
    updateQuery = (userRestaurantQuery) => {
      let showingRestaurants;
      // Credit: Helped by code and regex explanation from Udacity controlled components video 
      // (https://www.youtube.com/watch?v=xIlkBGmRq0g)
      if (userRestaurantQuery) {
          const match = new RegExp(escapeRegExp(userRestaurantQuery), 'i')
          showingRestaurants = locations.filter(
              (location) => match.test(location.name)
          )
      } else {
          showingRestaurants = locations
      }
      showingRestaurants.sort(sortBy('name'))
      this.setState({query: userRestaurantQuery, showingRestaurants});
    }

  render() {
    return (
      <div className="App">
        <div>
          <h1 className="heading">FoodFinder</h1>
        </div>
        <MapContainer
          locations={this.state.showingRestaurants}
          lat={this.state.lat}
          lng={this.state.lng}
          zoom={this.state.zoom}
        />
        <LocationsDrawer
          open={this.state.drawerOpen}
          handleDrawerOpen={this.handleDrawerOpen}
          query={this.state.query}
          updateQuery={this.updateQuery}
          showingRestaurants={this.state.showingRestaurants}
        />
      </div>
    );
  }
}

export default App
