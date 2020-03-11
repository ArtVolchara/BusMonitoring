import React, { PureComponent } from 'react';
import { Marker,Popup } from 'react-map-gl';
import  getColor from '../Marker/getColor'
import "./marker.css";

export default class BusMarker extends PureComponent {
  render() {
    const { bus, index } = this.props;
    return (
      <Marker key={`marker-${index}`} longitude={+bus.state.position.coordinates[0]} latitude={+bus.state.position.coordinates[1]} className="mapboxgl-marker">
          <svg><circle radius="10" stroke="none" fill={getColor(this.props.bus)} /></svg>
      </Marker>
    );
  }
}