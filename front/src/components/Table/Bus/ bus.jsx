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
        const hoveredBus = this.props.bus.object_id
        this.props.onHover(null, hoveredBus);
    }
    render() {
        console.log("bus rendered");
        let { bus, hoveredBusId, clickedBusId } = this.props
        return (
            <tr style={clickedBusId && clickedBusId === bus.object_id ?
                selectionStyle
                : hoveredBusId && hoveredBusId === bus.object_id ?
                    hoverStyle
                    : {}
            }
                onClick={this.onClick}
                onMouseEnter={this.handleOnHover}
                onMouseOut={this.props.onHoverLeave
                }>
                <td>{bus.route}</td>
                <td>{bus.state.speed} km/h</td>
                <td>{bus.state.fuel} litres</td>
            </tr>
        )
    }
}