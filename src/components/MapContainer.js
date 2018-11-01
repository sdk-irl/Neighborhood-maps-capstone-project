import React, {Component} from 'react'
//bootstrapped this app with google-maps-react and now importing necessary items from this API
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react'

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

  }

  //update the marker from the null state
  resetMarkers(locations) {
    // If no locations exist or they've all been filtered, we're done--credit: https://stackoverflow.com/questions/2647867/how-to-determine-if-variable-is-undefined-or-null
    if (!locations) 
      return;
    
    //TODO: remove existing markers
    
    //iterate over locations to create markers and properties
    let markerProps = this.state.markerProps;
    let markers = locations.map((location, index) => {
      let markerPropsIn = {
        key: index,
        index,
        name: location.name,
      }
      markerProps.push(markerPropsIn);
    }) 
  } 

    //TODO: add markers to the map


  //when the map is loaded...
  mapStart = (mapProps, map, clickEvent) => {
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
        onReady={this.mapStart}
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