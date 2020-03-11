import React from 'react';
import './bus.css'
export default function Bus(props) {
    return (
        <div className="bus-info">
            <span>Route: {props.bus.route}</span>
            <span>Speed: {props.bus.state.speed} km/h</span>
            <span>Fuel: {props.bus.state.fuel} litres</span>
        </div>
    )
}