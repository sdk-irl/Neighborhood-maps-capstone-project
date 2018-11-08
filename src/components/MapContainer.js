import React, { Component } from "react";
// bootstrapped this app with google-maps-react and now importing necessary items from this API
import { Map, InfoWindow, GoogleApiWrapper } from "google-maps-react";
import OfflineMapContainer from "./OfflineMapContainer";

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
    showingInfoWindow: false,
  };

  // when the map is loaded, this function runs
  componentDidMount() {
    // listening for authentication failures from Google maps
    window.gm_authFailure = () => {
      alert("Failed to obtain Google Maps.");
    };
  }

  componentWillMount = () => {
    this.setState({ firstDrop: false });
    if (
      this.props.selectedRestaurant === null ||
      typeof this.props.selectedRestaurant === "undefined"
    ) {
      return;
    }
  };

  // when the map is loaded, set the map state and reset the markers
  onMapReady = (props, map) => {
    this.setState({ map });
    this.resetMarkers(this.props.locations);
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

  getFourSquareData = marker => {
    // variable declaring foursquare URL that embeds the client ID, secret, and version variables
    let FS_url = `https://api.foursquare.com/v2/venues/search?client_id=${FourSquare_CLIENT_ID}&client_secret=${FourSquare_SECRET}&v=${FourSquare_VERSION}&radius=250&ll=${
      marker.position.lat
    },${marker.position.lng}&limit=10`;

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
        let restaurant = this.findBusinessMatch(marker, result);
        fsProps.fsRestaurant = restaurant[0];

        //if a restaurant matched, get its hours from foursquare
        //this is functional--it is unused to prevent from overfetching with the API key
        //if (false) {
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
              marker = {
                ...marker,
                ...fsProps
              };
              this.setState(
                {
                  selectedMarkerProps: marker,
                },
                () => {
                  console.log(marker);
                }
              );
            });
        }
      });
  }

  onMarkerClick = (markerProps, marker, e) => {
    // close any previous infoWindows before opening the next one
    this.hideInfoWindow();

    this.getFourSquareData(markerProps);

    // set the state to show marker info (google maps react documentation https://www.npmjs.com/package/google-maps-react)
    this.setState({
      selectedMarker: marker,
      selectedMarkerProps: markerProps,
      showingInfoWindow: true
    });
  };

  // update the marker from the null state to the locations from data
  resetMarkers(locations) {
    // if no locations exist or they've all been filtered, return without resetting
    // credit: https://stackoverflow.com/questions/2647867/how-to-determine-if-variable-is-undefined-or-null
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

      let marker = new this.props.google.maps.Marker({
        map: this.state.map,
        position: location.pos,
        restaurantName: location.name,
        animation: this.props.google.maps.Animation.DROP
      });

      // add event listener to marker
      marker.addListener("click", () => {
        this.onMarkerClick(markerData, marker, null);
      });

      return marker;
    });
    this.setState({ markers, markerProps });
  }

  componentWillReceiveProps = (props) => {
    // restaurants properties are displayed when list item is clicked by matching the selected 
    // restaurant property from the App component to the restaurant name of the marker
    // Also recalls the FS data function to display that on the window
    this.state.markers.forEach(marker => {
      if (props.selectedRestaurant === marker.restaurantName) {
        this.setState(
          {selectedMarker: marker},
          () => {
            this.state.markerProps.forEach(markerProp => {
              if (props.selectedRestaurant === markerProp.restaurantName) {
                this.setState({
                  selectedMarkerProps: markerProp,
                  showingInfoWindow: true,
                });
                this.getFourSquareData(markerProp);
              }
            });
          }
        );
        // Adds a bounce to the already displayed marker
        marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
        // credit: for next line of code, with my own modification for second bounce
        // https://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
        setTimeout(() => {
          marker.setAnimation(null);
        }, 1400);
      }
    });
  };

  componentDidUpdate = () => {
    // If there's a change in the number of locations in the list, update the markers
    this.setState(
      () => {
        if (this.props.locations.length !== this.state.markers.length) 
        {
          this.resetMarkers(this.props.locations);
          this.setState({ selectedMarker: null });
          this.hideInfoWindow();
        }
      }
    )
  }

  render() {
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
      //These markers will not tab appropriately, but I've done everything that suggested in the following articles and several others:
      // https://developers.google.com/web/fundamentals/accessibility/focus/using-tabindex
      // http://web-accessibility.carnegiemuseums.org/content/maps/
      // If you do not accept this, I would appreciate some help

      <Map
        role="application"
        aria-label="map"
        google={this.props.google}
        onReady={this.onMapReady}
        style={style}
        initialCenter={mapCenter}
        zoom={this.props.zoom}
        onClick={this.hideInfoWindow}
        tabIndex="0">
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
  apiKey: API_KEY,
  LoadingContainer: OfflineMapContainer
})(MapContainer);
