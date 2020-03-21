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
      hoveredBusId: null,
    };
  }
  handleClickedBus = (clickedBusId) => {
    this.setState({ clickedBusId: clickedBusId });
  }

  onHover = (event, hoveredBusId) => {
    if (event) {
      if (event.features.length > 0) {
        hoveredBusId = event.features[0].properties.object_id
      }
    }
    this.setState({ hoveredBusId })
};

  onHoverLeave = () => {
    if (this.state.hoveredBusId) {
      this.setState({ hoveredBusId: null });
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
              hoveredBusId = {this.state.hoveredBusId}
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
                      onHover={this.onHover}
                      onHoverLeave={this.onHoverLeave}
                      hoveredBusId={this.state.hoveredBusId} />
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