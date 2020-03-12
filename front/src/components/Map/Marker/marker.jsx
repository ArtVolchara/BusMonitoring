import React, { PureComponent } from 'react';
import { Marker, Popup } from 'react-map-gl';
import getColor from './getColor'


export default class BusMarker extends PureComponent {
  render() {
    const { bus, index } = this.props;
    return (
      <Marker
        key={index}
        longitude={+bus.state.position.coordinates[0]}
        latitude={+bus.state.position.coordinates[1]}
        captureDrag={false}
        captureDoubleClick={false}
      >
        <div className="bus" style={{ background: getColor(this.props.bus) }}>
          <span>
            <br/>
            <p>Transport type: Bus</p>
            <p>Route: {bus.route}</p>
            <p>Registration number: {bus.reg_number}</p>
          </span>
        </div>
      </Marker>
      // <Marker key={`marker-${index}`} longitude={+bus.state.position.coordinates[0]} latitude={+bus.state.position.coordinates[1]} className="mapboxgl-marker">
      //     <svg><circle radius="10" stroke="none" fill={getColor(this.props.bus)} /></svg>
      // </Marker>
    );
  }
}