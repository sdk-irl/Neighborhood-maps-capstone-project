import React, { Component } from "react";
import "./App.css";
import MapContainer from "./components/MapContainer";
import locations from "./data/locations.json";
import LocationsDrawer from "./components/LocationsDrawer";
import escapeRegExp from "escape-string-regexp";
import sortBy from "sort-by";

// APP COMPONENT THAT RENDERS MAP CONTAINER AND LOCATIONS DRAWER
class App extends Component {
  state = {
    all: locations,
    lat: 40.117243,
    lng: -88.240827,
    zoom: 16,
    drawerOpen: true,
    query: "",
    showingRestaurants: locations,
    selectedRestaurant: ""
  };

  styles = {
    menuButton: {
      //TODO
    },
    hide: {
      display: "none"
    }
  };

  //  query that user types in to filter restaurants
  updateQuery = userRestaurantQuery => {
    let showingRestaurants;
    // Credit: Helped by code and regex explanation from Udacity controlled components video
    // (https://www.youtube.com/watch?v=xIlkBGmRq0g)
    if (userRestaurantQuery) {
      const match = new RegExp(escapeRegExp(userRestaurantQuery), "i");
      showingRestaurants = locations.filter(location =>
        match.test(location.name)
      );
    } else {
      showingRestaurants = locations;
    }
    showingRestaurants.sort(sortBy("name"));
    this.setState({
      query: userRestaurantQuery,
      showingRestaurants
    });
  };

  // when an item is clicked in the locations drawer, this fires
  // we take the onClick event target, the button, and set the state to reflect selected location
  onListItemClick = e => {
    let selectedRestaurant = e.target.innerText;
    console.log(selectedRestaurant);
    this.setState({
      selectedRestaurant: selectedRestaurant
      //drawerOpen: false
    });
  };

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
          selectedIndex={this.state.selectedIndex}
          selectedRestaurant={this.state.selectedRestaurant}
        />
        <LocationsDrawer
          open={this.state.drawerOpen}
          query={this.state.query}
          updateQuery={this.updateQuery}
          showingRestaurants={this.state.showingRestaurants}
          onListItemClick={this.onListItemClick}
        />
      </div>
    );
  }
}

export default App;
