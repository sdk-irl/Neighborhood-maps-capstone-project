import React, { Component } from "react";
// bootstrapped this app with google-maps-react and now importing necessary items from this API
import { Map, InfoWindow, GoogleApiWrapper } from "google-maps-react";

// set the API key here to use later and change easier if needed
const API_KEY = "AIzaSyAVIlVT1r_WJh4Ru7aIAU8NAd7GPxPtQC8";
const FourSquare_CLIENT_ID = "PVZVSGGBQZNENEBHDC5DW1VCALWA1CCUNLL42ZE0XRZOXNKL";
const FourSquare_SECRET = "VDI51N2LGSWHZ2NN531VPDZ5DK1XWKCHROGVGC4TUBEIFTKP";
// set FourSquare version to date of writing, FourSquare says to update every couple of months to ensure on latest version
const FourSquare_VERSION = "20181102";

// MAPCONTAINER COMPONENT THAT RENDERS IMPORTED MAP AND INFOWINDOW COMPONENTS
// Credit: Used this documentation extensively to write this component https://www.npmjs.com/package/google-maps-react
class MapContainer extends Component {
  state = {
    map: null,
    markers: [],
    selectedMarker: null,
    markerProps: [],
    selectedMarkerProps: null,
    showingInfoWindow: false
  };

  // when the map is loaded, this function runs
  componentDidMount() {
    // listening for authentication failures from Google maps
    window.gm_authFailure = () => {
      alert("Failed to obtain Google Maps.");
    };
  }

  // Used componentWillUpdate here, spent several days debugging; I realize this will be deprecated soon, so any suggestions are welcome
  componentWillMount = () => {
    console.log(this.state.markers);
    this.setState({ firstDrop: false });
    // If there's a change in the number of locations in the list, update the markers
    if (this.state.markers.length !== this.props.locations.length) {
      this.resetMarkers(this.props.locations);
      this.setState({ selectedMarker: null });
      this.hideInfoWindow();
    }

    if (
      this.props.selectedRestaurant === null ||
      typeof this.props.selectedRestaurant === "undefined"
    ) {
      return;
    }
    // If there is a selected item in the listDrawer, filter the markers on the page, then activate the onMarkerClick for that selected item
    if (this.props.selectedRestaurant) {
      //filter markers on the page
      console.log(this.state.markerProps);
      let filteredMarkerProp = this.state.markerProps.filter(
        thisMarkerProp =>
          thisMarkerProp.restaurantName === this.props.selectedRestaurant
      );
      let filteredMarker = this.state.markers.filter(
        thisMarker =>
          thisMarker.restaurantName === filteredMarkerProp[0].restaurantName
      );
      console.log(filteredMarker);
      this.setState({
        markerProps: filteredMarkerProp,
        markers: filteredMarker
      });
      // Act as if the marker has been clicked (note: could not use marker state here because it hadn't set yet)
      this.onMarkerClick(filteredMarkerProp[0], filteredMarker[0], null);
    }
  };

  // when the map is loaded, set the map state and reset the markers
  onMapReady = (props, map) => {
    this.setState({ map });
    this.resetMarkers(this.props.locations);
    console.log(this.state.markers);
  };

  // close the info window and make the active marker null when this is called (which is when the next marker is clicked)
  hideInfoWindow = () => {
    this.state.selectedMarker && this.state.selectedMarker.setAnimation(null);
    this.setState({
      showingInfoWindow: false,
      selectedMarker: null
    });
  };

  // find businesses in foursquare data that match my locations.json
  findBusinessMatch = (markerProps, fsData) => {
    // checking for both restaurant names from the foursquare data restaurant names that include location.json restaurant names,
    // or restaurant names from location.json that include the foursquare data restaurant names.
    // Both are needed because one is sometimes longer than the other in the data.
    // Does not check for inexact matches except for length.
    let BusinessMatch = fsData.response.venues.filter(
      item =>
        item.name.includes(markerProps.restaurantName) ||
        markerProps.restaurantName.includes(item.name)
    );
    return BusinessMatch;
  };

  onMarkerClick = (markerProps, marker, e) => {
    // close any previous infoWindows before opening the next one
    this.hideInfoWindow();

    // variable declaring foursquare URL that embeds the client ID, secret, and version variables
    let FS_url = `https://api.foursquare.com/v2/venues/search?client_id=${FourSquare_CLIENT_ID}&client_secret=${FourSquare_SECRET}&v=${FourSquare_VERSION}&radius=250&ll=${
      markerProps.position.lat
    },${markerProps.position.lng}&limit=10`;

    let headers = new Headers();
    // variable declaring a new request that inputs the foursquare URL
    let request = new Request(FS_url, {
      method: "GET",
      headers
    });
    let fsProps = {};
    //fetch FourSquare data from API for a restaurant using previously declared request
    fetch(request)
      .then(response => response.json())
      .then(result => {
        // obtain the individual restaurant from FourSquare that matches the marker that was clicked and adds it to fsprops object
        let restaurant = this.findBusinessMatch(markerProps, result);
        fsProps.fsRestaurant = restaurant[0];

        //if a restaurant matched, get its hours from foursquare
        //this is functional--it is unused to prevent from overfetching with the API key
        // if (false) {
        if (fsProps.fsRestaurant) {
          // building the fs request
          let venueId = fsProps.fsRestaurant.id;
          let headers = new Headers();
          let url = `https://api.foursquare.com/v2/venues/${venueId}/hours?client_id=${FourSquare_CLIENT_ID}&client_secret=${FourSquare_SECRET}&v=${FourSquare_VERSION}`;
          let request = new Request(url, {
            method: "GET",
            headers
          });
          // fetch the fs hours request
          fetch(request)
            .then(response => response.json())
            .then(result => {
              console.log("HOURS WERE FETCHED");
              //if fs result returns the hours object and timeframes object then we filter the timeframes
              // for those that include today. We set the variable to reflect whether it is open
              if (result.response.hours && result.response.hours.timeframes) {
                let today = result.response.hours.timeframes.filter(
                  item => item.includesToday
                );
                fsProps.isOpenToday =
                  today.length > 0 ? "Open today" : "Closed today";
              } else {
                //else to capture those that there is no data about whether they are open
                fsProps.isOpenToday = "Unknown if restaurant is open today";
              }
            })
            .then(() => {
              markerProps = {
                ...markerProps,
                ...fsProps
              };
              this.setState(
                {
                  selectedMarkerProps: markerProps
                },
                () => {
                  console.log(this.state.markerProps);
                }
              );
            });
        }
      });

    // set the state to show marker info (google maps react documentation https://www.npmjs.com/package/google-maps-react)
    this.setState({
      selectedMarker: marker,
      selectedMarkerProps: markerProps,
      showingInfoWindow: true
    });
  };
  // update the marker from the null state to the locations from data
  resetMarkers(locations) {
    // if no locations exist or they've all been filtered, return without resetting--credit: https://stackoverflow.com/questions/2647867/how-to-determine-if-variable-is-undefined-or-null
    if (!locations) return;

    // remove any existing markers
    this.state.markers.forEach(marker => marker.setMap(null));

    // declare marker properties as an array inside this function
    let markerProps = [];
    // iterate over locations to create markers and properties
    // credit this article for using .map instead of forEach (https://jjude.com/react-array/)
    let markers = locations.map((location, index) => {
      let markerData = {
        key: index,
        index,
        restaurantName: location.name,
        position: location.pos,
        bestKnownFor: location.bestKnownFor
      };
      markerProps.push(markerData);

      // declaring new google maps marker (for each mapped location) to have the position of the location data
      let animation = this.props.google.maps.Animation.BOUNCE;
      // credit: for next line of code, with my own modification for second bounce
      // https://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
      setTimeout(() => {
        marker.setAnimation(null);
      }, 1400);

      let marker = new this.props.google.maps.Marker({
        map: this.state.map,
        position: location.pos,
        restaurantName: location.name,
        animation: animation
      });

      // add event listener to marker
      marker.addListener("click", () => {
        this.onMarkerClick(markerData, marker, null);
        //toggleBounce(marker);
      });

      return marker;
    });
    this.setState({ markers, markerProps });
  }

  componentWillReceiveProps = props => {
    this.state.markers.forEach(marker => {
      if (props.selectedRestaurant === marker.restaurantName) {
        this.setState(
          {
            selectedMarker: marker
          },
          () => {
            this.state.markerProps.forEach(markerProp => {
              if (props.selectedRestaurant === markerProp.restaurantName) {
                this.setState({
                  selectedMarkerProps: markerProp,
                  showingInfoWindow: true
                });
              }
            });
          }
        );
      }
    });
  };

  render() {
    console.log(this.props.selectedRestaurant);
    let mapCenter = {
      lat: this.props.lat,
      lng: this.props.lng
    };
    const style = {
      width: "100%",
      height: "100%"
    };

    // Credit: Charles Kline for explaining JSX fragment to eliminate errors
    return (
      <Map
        aria-label="map"
        google={this.props.google}
        onReady={this.onMapReady}
        style={style}
        initialCenter={mapCenter}
        zoom={this.props.zoom}
        onClick={this.hideInfoWindow}>
        <InfoWindow
          marker={this.state.selectedMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.state.hideInfoWindow}>
          <div>
            {this.state.selectedMarkerProps && (
              <>
                <h3>{this.state.selectedMarkerProps.restaurantName}</h3>
                <p>
                  Best known for:
                  {this.state.selectedMarkerProps.bestKnownFor}
                </p>
                <p>{this.state.selectedMarkerProps.isOpenToday}</p>
              </>
            )}
            {!this.state.selectedMarkerProps && <p>Waiting for results...</p>}
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: API_KEY
})(MapContainer);
