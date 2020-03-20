import React from 'react';
import openSocket from 'socket.io-client';
import Bus from './Bus/bus'
import Map from '../Map/map';
import './homepage.css'

const busesSocket = openSocket('http://localhost:8000/buses');

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buses: null,
      clickedBusId: null,
      hoveredBusFeature: null,
    };
  }
  handleClickedBus = (clickedBusId) => {
    this.setState({ clickedBusId: clickedBusId });
  }

  onHover = event => {
        const {
            features,
            point
        } = event;
    if (features.length > 0) {
      const hoveredBusFeature = features[0];
      if(hoveredBusFeature) {
        if (!this.state.hoveredBusFeature) {
          console.log(hoveredBusFeature);
          this.setState({ hoveredBusFeature, x: point.x, y: point.y });
        }
      }
    }
  };

  onHoverLeave = () => {
    if (this.state.hoveredBusFeature) {
        this.setState({ hoveredBusFeature: null });
    }
};

  componentDidMount() {
    console.log("homepage mounted");
    busesSocket.on('buses', (buses) => this.setState({ buses: buses }));
  }
  componentWillUnmount() {
    busesSocket.disconnect()
  }
  render() {
    console.log("homepage rendered");
    return (
      <div className='general_container'>
        {this.state.buses ?
          <>
            <Map buses={this.state.buses} busesSocket={busesSocket}
             handleClickedBus={this.handleClickedBus}
             clickedBusId={this.state.clickedBusId}
             x={this.state.x}
             y={this.state.y}
             hoveredBusFeature={this.state.hoveredBusFeature} 
             onHover={this.onHover}
             onHoverLeave={this.onHoverLeave} 
             />
            <div className='table-container'>
              <table className='bus-table'>
                <thead>
                  <tr>
                    <th>Route</th>
                    <th>Speed</th>
                    <th>Fuel</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.buses && this.state.buses.map((bus, i) =>
                    <Bus bus={bus} key={i} handleClickedBus={this.handleClickedBus} 
                    clickedBusId={this.state.clickedBusId} 
                    hoveredBusFeature={this.state.hoveredBusFeature}/>
                  )}
                </tbody>
              </table>
            </div>
          </>
          : <></>
        }
      </div>
    )
  }
}

export default Home;