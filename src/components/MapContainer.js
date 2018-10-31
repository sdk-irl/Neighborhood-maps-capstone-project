import React, {Component} from 'react'
//bootstrapped this app with google-maps-react and now importing necessary items from this API
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react'

//Used this documentation extensively to write this component https://www.npmjs.com/package/google-maps-react
class MapContainer extends Component {
    state = {
        map: null
    }

    //componentDidMount() 
    
    mapClicked(mapProps, map, clickEvent) {
      // ...
    }

    render() {
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
    apiKey: 'AIzaSyAVIlVT1r_WJh4Ru7aIAU8NAd7GPxPtQC8'
  })(MapContainer)