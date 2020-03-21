import React from 'react';
import Bus from '../Table/Bus/ bus'
import './table.css'
export default class Table extends React.PureComponent {
    render() {
        return (
                <table className='bus-table'>
                    <thead>
                        <tr>
                            <th>Route</th>
                            <th>Speed</th>
                            <th>Fuel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.buses && this.props.buses.map((bus, i) =>
                            <Bus
                                bus={bus}
                                key={i}
                                handleClickedBus={this.props.handleClickedBus}
                                clickedBusId={this.props.clickedBusId}
                                onHover={this.props.onHover}
                                onHoverLeave={this.props.onHoverLeave}
                                hoveredBusId={this.props.hoveredBusId} />
                        )}
                    </tbody>
                </table>
        )
    }
}