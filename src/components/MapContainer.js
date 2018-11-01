import React, {Component} from 'react'
//bootstrapped this app with google-maps-react and now importing necessary items from this API
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react'
import { homedir } from 'os';

//set the API key here to use later and change easier if needed
const API_KEY = 'AIzaSyAVIlVT1r_WJh4Ru7aIAU8NAd7GPxPtQC8';

//Used this documentation extensively to write this component https://www.npmjs.com/package/google-maps-react
class MapContainer extends Component {
  state = {
      map: null,
      markers: [],
      markerProps: [],
  }

  //when the map is loaded, run this function
  componentDidMount() {
    //TODO
  }

  //update the marker from the null state
  resetMarkers(locations) {
    // If no locations exist or they've all been filtered, we're done--credit: https://stackoverflow.com/questions/2647867/how-to-determine-if-variable-is-undefined-or-null
    if (!locations) 
      return;
      console.log(locations);
    //TODO: remove existing markers
    //declare marker properties as an array inside this function
    let markerProps = [];
    //iterate over locations to create markers and properties
    //Credit this article for using .map instead of forEach (https://jjude.com/react-array/)
    let markers = locations.map((location) => {
      let markerData = {
        restaurantName: location.name,
        position: location.pos,
        bestKnownFor: location.bestKnownFor,
      };
      markerProps.push(markerData);

      let marker = new this.props.google.maps.Marker({
        map: this.state.map,
        position: location.pos,
      })
      return marker;
    });  
    //marker.addListener('click', function() => {
    //  infowindow.open(map, marker);
    //}
    
  
  } 

  //when the map is loaded, set the state and fetch the places
  fetchPlaces = (mapProps, map) => {
    const {google} = mapProps;
    const service = new google.maps.places.PlacesService(map);
    console.log(service);
    this.setState({map});
    this.setState({mapProps});
    this.resetMarkers(this.props.locations);
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
        onClick={this.mapClicked}
        >
  
      <Marker 
        onClick={this.onMarkerClick}
        name={'Current location'} />

        {/* <InfoWindow 
          onClose={this.onInfoWindowClose}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow> */}
      </Map>
    );
  }
}
   
  export default GoogleApiWrapper({
    apiKey: API_KEY
  })(MapContainer)