import React, {Component} from 'react'

// Basic component to render when map is offline
class OfflineMapContainer extends Component {
    state = {
        show: false,
        timeout: null
    }

    // Credit: watched Doug Brown's webinar, so followed basic structure, 
    // but there is not much to it, so it probably looks very similar to his 
    // (https://www.youtube.com/watch?v=NVAVLCJwAAo&feature=youtu.be)

    //when if the map doesn't mount on the page within 1.5 seconds, we show the error message 
    // rendered below in the ternary operator
    componentDidMount = () => {
        let timeout = window.setTimeout(this.showError, 1500);
        this.setState({timeout});
    }

    // we clear the timeout 
    componentWillUnmount = () => {
        window.clearTimeout(this.state.timeout);
    }

    // this function shows the error message
    showError = () => {
        this.setState({show: true})
    }

    render =() => {
        return (
            <div>{
                this.state.show ? (
                    <div>
                        <h1>Error</h1>
                        <p>There was an error loading Google Maps due to network issues. Please try again.</p>
                    </div>
                )
                : (<div>
                    <h1>Loading Google Maps</h1>
                    </div>)
                } 
            </div>
        )
    }

}

export default OfflineMapContainer;