import React from 'react';
const hoverStyle = {
    "backgroundColor": "#556577",
}
export default class Bus extends React.PureComponent {
    state = {

    }
    render() {
        console.log("bus rendered");
        return (
            <tr style={this.props.hoveredBusFeature && 
                this.props.hoveredBusFeature.properties.object_id === this.props.bus.object_id ?
                hoverStyle
                : {}}>
                <td>{this.props.bus.route}</td>
                <td>{this.props.bus.state.speed} km/h</td>
                <td>{this.props.bus.state.fuel} litres</td>
            </tr>
        )
    }
}