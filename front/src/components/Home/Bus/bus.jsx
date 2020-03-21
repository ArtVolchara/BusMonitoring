import React from 'react';
const hoverStyle = {
    "backgroundColor": "#556577",
}
const selectionStyle = {
    "backgroundColor": "#081217",
}
export default class Bus extends React.PureComponent {
    onClick = () => {
        this.props.handleClickedBus(this.props.bus.object_id);
    }
    handleOnHover = () => {
        const hoveredBus = {
            id: this.props.bus.object_id,
            reg_number: this.props.bus.reg_number,
            route: this.props.bus.route,
            longitude: this.props.bus.state.position.coordinates[0],
            latitude: this.props.bus.state.position.coordinates[1],
        };
        this.props.onHover(null, hoveredBus);
    }
    render() {
        console.log("bus rendered");
        let { bus, hoveredBus, clickedBusId } = this.props
        return (
            <tr style={clickedBusId && clickedBusId === this.props.bus.object_id?
                selectionStyle
                : hoveredBus && hoveredBus.id === this.props.bus.object_id ?
                hoverStyle
                : {}}
                onClick={this.onClick}
                onMouseEnter={this.handleOnHover}
                onMouseOut={this.props.onHoverLeave
                }>
                <td>{this.props.bus.route}</td>
                <td>{this.props.bus.state.speed} km/h</td>
                <td>{this.props.bus.state.fuel} litres</td>
            </tr>
        )
    }
}