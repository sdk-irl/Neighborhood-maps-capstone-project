import React, {Component} from 'react'
//bootstrapped this app with google-maps-react and now importing necessary items from this API
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react'

class MapContainer extends Component {
    state = {
        map: null
    }

    //componentDidMount() 


    render() {
      let mapCenter =  {
        lat: this.props.lat,
        lng: this.props.lng
      }
      return (

        <Map 
          google={this.props.google}
          zoom={this.props.zoom}
          initialCenter={mapCenter}
          >
   
          {/* <Marker 
                onClick={this.onMarkerClick}
                name={'Current location'} />
   
          <InfoWindow 
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
    apiKey: 'AIzaSyAVIlVT1r_WJh4Ru7aIAU8NAd7GPxPtQC8'
  })(MapContainer)