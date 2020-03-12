import React from 'react';
import openSocket from 'socket.io-client'
import Bus from '../Bus/bus'
import Map from '../Map/map'
const busesSocket = openSocket('http://localhost:8000/buses');

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buses: null
    };
  }
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
      <>{this.state.buses ?
        <>
          <Map buses={this.state.buses} />
          <div className="bus-table">
            {this.state.buses && this.state.buses.map((bus, i) =>
              <Bus bus={bus} key={i} />
            )}
          </div>
        </>
        :<></>
      }
      </>
    )
  }
}

export default Home;