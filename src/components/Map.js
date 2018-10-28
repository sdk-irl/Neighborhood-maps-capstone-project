import React from 'react'
//Credit to https://tomchentw.github.io/react-google-maps/#installation for instructions on adding react-google-maps
import { GoogleMap } from "google-maps-react"


const mapComponent = (props) => {
    <GoogleMap
        defaultZoom={12}
        defaultCenter={{ lat: 40.117243, lng: -88.240827 }}
    >
    </GoogleMap>
}

const Map = (props) => {
    return(
    <MapComponent
    />
    )}


export default Map