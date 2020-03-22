import React from 'react';
import openSocket from 'socket.io-client';
import Map from '../Map/map';
import Table from '../Table/table';
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
    if (this.state.clickedBusId === clickedBusId) {
      this.setState({ clickedBusId: null });
    } else {
      this.setState({ clickedBusId: clickedBusId });
    }
  }

  onHover = (event, hoveredBusId) => {
    if (event) {
      hoveredBusId = event.features && event.features.find(f => f.layer.id === 'Point-data').properties.object_id;
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
            <div className="mapContainer">
              <Map buses={this.state.buses} busesSocket={busesSocket}
                handleClickedBus={this.handleClickedBus}
                clickedBusId={this.state.clickedBusId}
                hoveredBusId={this.state.hoveredBusId}
                onHover={this.onHover}
                onHoverLeave={this.onHoverLeave}
              />
            </div>
            <div className='table-container'>
              <Table
                buses={this.state.buses}
                handleClickedBus={this.handleClickedBus}
                clickedBusId={this.state.clickedBusId}
                onHover={this.onHover}
                onHoverLeave={this.onHoverLeave}
                hoveredBusId={this.state.hoveredBusId}
              />
            </div>
          </>
          : <></>
        }
      </div>
    )
  }
}

export default Home;