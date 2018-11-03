import React, { Component } from 'react';
// Selected material-ui drawer (https://material-ui.com/demos/drawers/ Doug Brown also uses 
// this in walkthrough) after looking at several less functional and less well-designed drawer libraries
import Drawer from '@material-ui/core/Drawer';

class LocationsDrawer extends Component {
    state = {
        //set initial states of open drawer and user query
        open: false,
        query: "" //TODO
    }
    
    styles = {
        //TODO: add CSS styles
    }
    
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
                            
                        >
                            {}
                        </input>
                        <ul>

                            <button>{'render one button'}</button>

                        </ul>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default LocationsDrawer;