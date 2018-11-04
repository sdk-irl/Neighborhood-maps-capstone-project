import React, { Component } from 'react';
// Selected material-ui drawer (https://material-ui.com/demos/drawers/ Doug Brown also uses 
// this in walkthrough) after looking at several less functional and less well-designed drawer libraries
import Drawer from '@material-ui/core/Drawer';

class LocationsDrawer extends Component {
    state = {
        //set initial states of open drawer and user query
        query: "" //TODO
    }
    
    //borrowing styles from walkthrough to understand how they work
    styles = {
        list: {
            width: "200px",
            padding: "0px 15px 0px",
            listStyle: "none"
        },

        listItem: {
            margin: "10px 10px 10px"
        },
        listLink: {
            background: "transparent",
            border: "none",
            color: "black"
        },
        filter: {
            width: "100%",
            border: ".5px solid blue",
            //padding: "3px",
            //margin: "30px 0px 10px",
            
        }
    };
    
    updateQuery = () => {
        //TODO: 
    }
    

    render = () => {
        return (
            // Followed Doug Brown's organization here with Drawer/div/input/button because as 
            // I reviewed the API, this ordering made the most sense for a responsive, highly accessible design
            // https://www.youtube.com/watch?v=NVAVLCJwAAo&feature=youtu.be
            <div>
                <Drawer 
                    open={this.props.open}
                    width={200}
                >
                    <div>
                        <input
                            style={this.styles.filter}
                        >
                            {}
                        </input>
                        <ul style={this.styles.list}>
                            {/* Used buttons here for accessibility purposes, for better tabbing*/}
                            {this.props.locations.map(
                                (location, index) => {
                                    return(
                                        <li>
                                            <button key={index} style={this.styles.listLink}>{location.name}</button>
                                        </li>
                                    )
                                })
                            }

                        </ul>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default LocationsDrawer;