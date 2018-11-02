import React, {Component} from 'react'
//bootstrapped this app with google-maps-react and now importing necessary items from this API
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react'

//set the API key here to use later and change easier if needed
const API_KEY = 'AIzaSyAVIlVT1r_WJh4Ru7aIAU8NAd7GPxPtQC8';
const FourSquare_CLIENT = '';
const FourSquare_SECRET = '';
const FourSquare_VERSION = '';


//Used this documentation extensively to write this component https://www.npmjs.com/package/google-maps-react
class MapContainer extends Component {
  state = {
      map: null,
      markers: [],
      selectedMarker: null,
      markerProps: [],
      selectedMarkerProps: null,
      showingInfoWindow: false
  }

  //when the map is loaded, run this function
  componentDidMount() {
    //TODO
  }

  //when the map is loaded, set the state and fetch the places
  fetchPlaces = (mapProps, map) => {
    this.setState({map});
    this.setState({mapProps});
    this.resetMarkers(this.props.locations);
  }

  //close the info window and make the active marker null when this is called (which is when the next marker is clicked)
  hideInfoWindow = () => {
    this.state.selectedMarker && this.state.selectedMarker.setAnimation(null);
    this.setState({
      showingInfoWindow: false,
      selectedMarker: null
    })
  }

  onMarkerClick = (markerProps, marker, e) => {
    //close any previous infoWindows before opening the next one
    this.hideInfoWindow();
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    //set the state to show marker info (google maps react documentation https://www.npmjs.com/package/google-maps-react) 
    this.setState({
      selectedMarker: marker,
      selectedMarkerProps: markerProps,
      showingInfoWindow: true
  });
  console.log(this.state.selectedMarker, this.state.selectedMarkerProps);
  }
  //update the marker from the null state to the locations from data
  resetMarkers(locations) {
    // If no locations exist or they've all been filtered, we're done--credit: https://stackoverflow.com/questions/2647867/how-to-determine-if-variable-is-undefined-or-null
    if (!locations) 
      return;
      console.log(locations);
    
    //remove any existing markers
    this.state.markers.forEach(marker => marker.setMap(null));

    //declare marker properties as an array inside this function
    let markerProps = [];
    //iterate over locations to create markers and properties
    //Credit this article for using .map instead of forEach (https://jjude.com/react-array/)
    let markers = locations.map((location, index) => {
      let markerData = {
        key: index,
        index,
        restaurantName: location.name,
        position: location.pos,
        bestKnownFor: location.bestKnownFor,
      };
      markerProps.push(markerData);

      //declaring new google maps marker (for each mapped location) to have the position of the location data
      let marker = new this.props.google.maps.Marker({
        map: this.state.map,
        position: location.pos,
      });

      marker.addListener('click', () => {
        this.onMarkerClick(markerProps, marker, null);
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
            <h3>Something's wrong with this data {this.state.selectedMarkerProps && this.state.selectedMarkerProps.name}</h3>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

   
  export default GoogleApiWrapper({
    apiKey: API_KEY
  })(MapContainer)