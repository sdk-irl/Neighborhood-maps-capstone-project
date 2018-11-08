import React, { Component } from "react";
// Selected material-ui drawer (https://material-ui.com/demos/drawers/ Doug Brown also uses
// this in walkthrough) after looking at several less functional and less well-designed drawer libraries
import Drawer from "@material-ui/core/Drawer";

// LOCATIONSDRAWER COMPONENT THAT RENDERS IMPORTED DRAWER COMPONENT
class LocationsDrawer extends Component {
  state = {
    // TODO, check to see if you still need to set initial state of user query
    drawerOpen: true
  };

  // Drawer list styles
  styles = {
    filter: {
      width: "90%",
      border: ".5px solid blue",
      margin: "10px 0px 10px 5px",
      padding: "5px"
    },
    list: {
      width: "200px",
      padding: "20px 15px 0px",
      listStyle: "none"
    },
    listLink: {
      background: "transparent",
      border: "none",
      color: "black"
    }
    
  };

  handleDrawerClick = () => {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    });
  };

  render = () => {
    return (
      // Credit: Followed Doug Brown's organization here with using the Drawer component and the button because as
      // I reviewed the API, this ordering made the most sense for a responsive, highly accessible design.
      // Used buttons specifically for accessibility purposes, for better tabbing
      // https://www.youtube.com/watch?v=NVAVLCJwAAo&feature=youtu.be
      <div>
        {this.state.drawerOpen && (
          <Drawer
            open={this.props.open}
            width={200}
            onClose={this.props.handleDrawerOpen}>
            <div>
              <input
                style={this.styles.filter}
                value={this.state.query}
                type="text"
                placeholder="Search restaurants"
                onChange={e => {
                  this.props.updateQuery(e.target.value);
                }}
              />
              <ul style={this.styles.list}>
                {this.props.showingRestaurants.map((location, index) => {
                  return (
                    <li key={index}>
                      <button
                        key={index}
                        onClick={this.props.onListItemClick}
                        style={this.styles.listLink}>
                        {location.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <input
                type="button"
                onClick={() => this.handleDrawerClick()}
                value={this.state.drawerOpen ? "Hide Restaurants" : "Show Restaurants"}
                style={{
                  position: "fixed",
                  top: "5em",
                  left: "10px"
                }}
              />
            </div>
          </Drawer>
        )}
        <input
          type="button"
          onClick={() => this.handleDrawerClick()}
          style={{
            position: "fixed",
            top: "5em",
            left: "10px"
          }}
          value={this.state.drawerOpen ? "Hide Restaurants" : "Show Restaurants"}
        />
      </div>
    );
  };
}

export default LocationsDrawer;
