import React, {Component} from 'react'
// bootstrapped this app with google-maps-react and now importing necessary items from this API
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react'
import { linkSync } from 'fs';

// set the API key here to use later and change easier if needed
const API_KEY = 'AIzaSyAVIlVT1r_WJh4Ru7aIAU8NAd7GPxPtQC8';
const FourSquare_CLIENT_ID = 'PVZVSGGBQZNENEBHDC5DW1VCALWA1CCUNLL42ZE0XRZOXNKL';
const FourSquare_SECRET = 'GKFEBJIWGEZDXWUANQPVQTPOITCVS451ZEJ2YK1CYEGMN3QU';
// set FourSquare version to date of writing, FourSquare says to update every couple of months to ensure on latest version
const FourSquare_VERSION = '20181102';


// Used this documentation extensively to write this component https://www.npmjs.com/package/google-maps-react
class MapContainer extends Component {
  state = {
      map: null,
      markers: [],
      selectedMarker: null,
      markerProps: [],
      selectedMarkerProps: null,
      showingInfoWindow: false
  }

  // when the map is loaded, run this function
  componentDidMount() {
    //TODO
    // listening for authentication failures from Google maps
    //window.gm_authFailure = () => {
    //  alert('ERROR!! \nFailed to get Google maps.')
    //  console.log('ERROR!! \nFailed to get Google maps.')
   }

  // when the map is loaded, set the state and fetch the places
  fetchPlaces = (mapProps, map) => {
    this.setState({map});
    this.setState({mapProps});
    this.resetMarkers(this.props.locations);
  }

  // close the info window and make the active marker null when this is called (which is when the next marker is clicked)
  hideInfoWindow = () => {
    this.state.selectedMarker && this.state.selectedMarker.setAnimation(null);
    this.setState({
      showingInfoWindow: false,
      selectedMarker: null
    })
  }

  // find businesses in foursquare data that match my locations.json
  findBusinessMatch = (markerProps, fsData) => {
      // checking for both restaurant names from the foursquare data restaurant names that include location.json restaurant names, 
      // or restaurant names from location.json that include the foursquare data restaurant names.
      // Both are needed because one is sometimes longer than the other in the data.
      // Does not check for inexact matches except for length. 
    let BusinessMatch = fsData.response.venues.filter(item => 
      item.name.includes(markerProps.restaurantName) || 
      markerProps.restaurantName.includes(item.name));
    return BusinessMatch;
  }

  onMarkerClick = (markerProps, marker, e) => {
    // close any previous infoWindows before opening the next one
    this.hideInfoWindow();

    // variable declaring foursquare URL that embeds the client ID, secret, and version variables
    let FS_url = `https://api.foursquare.com/v2/venues/search?client_id=${FourSquare_CLIENT_ID}&client_secret=${FourSquare_SECRET}&v=${FourSquare_VERSION}&radius=250&ll=${markerProps.position.lat},${markerProps.position.lng}&limit=10`

    let headers = new Headers();
    // variable declaring a new request that inputs the foursquare URL
    let request = new Request(FS_url, {
      method: 'GET',
      headers
    });
    let selectedMarkerProps; 
    // fetch FourSquare data from API for a restaurant using previously declared request
    fetch(request)
      .then(response => response.json())
      .then(result => {
        // obtain the individual restaurant from FourSquare that matches the marker that was clicked and adds it to selectedMarkerProps array
        let restaurant = this.findBusinessMatch(markerProps, result);
        selectedMarkerProps = {
          fsRestaurant: restaurant[0],
          ...markerProps
        };

      //if a restaurant matched, get its hours from foursquare
      if (selectedMarkerProps.fsRestaurant) {
        let venueId = selectedMarkerProps.fsRestaurant.id; 
        let headers = new Headers();
        let url = `https://api.foursquare.com/v2/venues/${venueId}/hours?client_id=${FourSquare_CLIENT_ID}&client_secret=${FourSquare_SECRET}&v=${FourSquare_VERSION}`;
        let request = new Request(url, {
          method: 'GET',
          headers
        });
        fetch(request)
          .then(response => response.json())
          .then(result => {
            console.log(result);
            //TODO: need to handle exceptions that don't have an includesToday when it's returning correct thing
            //if it is open today
            //TODO: DOES NOT RETURN APPROPRIATE THINGS
            let today = result.response.hours.timeframes.filter(item => (item.days.includesToday));
            console.log(today);
            //else to capture those that aren't open today
          })   
      }
      
    });

    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    // credit: for next line of code, with my own modification for second bounce 
    // https://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
    setTimeout(function(){ marker.setAnimation(null); }, 1400);
    // set the state to show marker info (google maps react documentation https://www.npmjs.com/package/google-maps-react) 
    this.setState({
      selectedMarker: marker,
      selectedMarkerProps: markerProps,
      showingInfoWindow: true
  });
  console.log(this.state.selectedMarker, this.state.selectedMarkerProps);
  }
  // update the marker from the null state to the locations from data
  resetMarkers(locations) {
    // if no locations exist or they've all been filtered, we're done--credit: https://stackoverflow.com/questions/2647867/how-to-determine-if-variable-is-undefined-or-null
    if (!locations) 
      return;
    
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
        bestKnownFor: location.bestKnownFor,
      };
      markerProps.push(markerData);

      // declaring new google maps marker (for each mapped location) to have the position of the location data
      let marker = new this.props.google.maps.Marker({
        map: this.state.map,
        position: location.pos,
      });

      marker.addListener('click', () => {
        this.onMarkerClick(markerData, marker, null);
      });
      return marker;
    });
    this.setState({markers, markerProps});
  }

  render () {
    let mapCenter =  {
      lat: this.props.lat,
      lng: this.props.lng
    }
    const style = {
      width: '100%',
      height: '100%'
    }

    return (
      <Map
        aria-label='map'
        google={this.props.google}
        onReady={this.fetchPlaces}
        style={style}
        initialCenter={mapCenter}
        zoom={this.props.zoom}
        onClick={this.hideInfoWindow}
      >
        <InfoWindow
          marker={this.state.selectedMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.state.hideInfoWindow}
        >
          <div>
            <h3>{this.state.selectedMarkerProps && this.state.selectedMarkerProps.restaurantName}</h3>
            <p>Best known for: {this.state.selectedMarkerProps && this.state.selectedMarkerProps.bestKnownFor}</p>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

  export default GoogleApiWrapper({
    apiKey: API_KEY
  })(MapContainer)