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
      hoveredBus: null,
    };
  }
  handleClickedBus = (clickedBusId) => {
    this.setState({ clickedBusId: clickedBusId });
  }

  onHover = (event, hoveredBus) => {
    if (event) {
      if (event.features.length > 0) {
        hoveredBus = {
          id: event.features[0].properties.object_id,
          reg_number: event.features[0].properties.reg_number,
          route: event.features[0].properties.route,
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
        }
      }
    }
    this.setState({ hoveredBus })
};

  onHoverLeave = () => {
    if (this.state.hoveredBus) {
      this.setState({ hoveredBus: null });
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
              hoveredBus = {this.state.hoveredBus}
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
                      hoveredBus={this.state.hoveredBus} />
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