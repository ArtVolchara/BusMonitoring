import React from 'react';
import openSocket from 'socket.io-client'
import MapGL, { Source, Layer, FeatureState, Popup } from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css'
import { pointDataLayer } from './BusGeoJSON/pointDataLayer';
import getPointFeatures from './BusGeoJSON/getPointFeatures'
import updatePointPercentiles from './BusGeoJSON/updatePointPercentiles';
import { lineDataLayer } from './LineGeoJSON/lineDataLayer';
import getLineFeatures from './LineGeoJSON/getLineFeatures';
import updateLinePercentiles from './LineGeoJSON/updateLinePercentiles';
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYXJ0dm9sY2hhcmEiLCJhIjoiY2s3bHJ2NjU4MGFjbDNtczJnam10aDU1aSJ9.oH_RWYjKfrKGC77mYIQ8oA';

export default class Map extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pointsData: null,
            linesData: null,
            busTelemetry: null,
            viewport: {
                longitude: 37.4067,
                latitude: 55.7187,
                zoom: 15,
                bearing: 0,
            },
        };

    }

    onViewportChange = viewport => this.setState({ viewport });

    onClick = event => {
        const {
            features,
        } = event;
        const clickedPoint = features && features.find(f => f.layer.id === 'Point-data');
        if (clickedPoint) {
            const clickedBusId = clickedPoint.properties.object_id;
            this.props.handleClickedBus(clickedBusId);
        }
    };
    renderTooltip() {
        const { hoveredBusId, buses } = this.props;
        const hoveredBus = hoveredBusId && buses.find(bus => bus.object_id === hoveredBusId);
        return (
            hoveredBusId && (
                <Popup
                    longitude={hoveredBus.state.position.coordinates[0]}
                    latitude={hoveredBus.state.position.coordinates[1]}
                    closeButton={false} closeOnClick={false}
                    className='busPopup'>
                    <div>Type: Bus</div>
                    <div>Registration number: {hoveredBus.reg_number}</div>
                    <div>Route: {hoveredBus.route}</div>
                </Popup>
            )
        );
    }
    componentDidMount() {
        // console.log("map mounted")
        this.busTelemetrySocket = openSocket(`http://localhost:8000/buses/telemetry`, { query: `object_id=${this.props.clickedBusId}` });
        this.busTelemetrySocket.on("busTelemetry", (busTelemetry) => this.setState({ telemetry: busTelemetry }));
    }
    componentDidUpdate(prevProps, prevState) {
        // console.log("map updated");
        if (prevProps.clickedBusId !== this.props.clickedBusId) {
            this.busTelemetrySocket.disconnect()
            this.busTelemetrySocket = openSocket(`http://localhost:8000/buses/telemetry`, { query: `object_id=${this.props.clickedBusId}` });
            this.busTelemetrySocket.on("busTelemetry", (busTelemetry) => {
                const features = getLineFeatures(busTelemetry)
                this.setState({ busTelemetry: busTelemetry, linesData: updateLinePercentiles(features) })
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        const features = getPointFeatures(nextProps.buses)
        this.setState({ pointsData: updatePointPercentiles(features) })
    }
    componentWillUnmount() {
        this.busTelemetrySocket.disconnect()
    }

    render() {
        console.log("map rendered");
        return (
            <>
                <div className='sidebarStyle'>
                    <span>Longitude: {this.state.viewport.longitude}</span><span>Latitude: {this.state.viewport.latitude}</span><span>Zoom: {this.state.viewport.zoom}</span>
                </div>
                <MapGL
                    {...this.state.viewport}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/artvolchara/ck7ujql690k1a1ipaa5h7hr3o"
                    onViewportChange={this.onViewportChange}
                    accessToken={MAPBOX_TOKEN}
                    cursorStyle={this.props.hoveredBusId ?
                        'pointer'
                        : null
                    }
                >
                    {this.props.clickedBusId ?
                        <>
                            <Source id='Line-data' type="geojson" data={this.state.linesData} />
                            <Layer id='Line-data'{...lineDataLayer} />
                        </>
                        : <></>
                    }
                    <Source id='Point-data' type="geojson" data={this.state.pointsData} promoteId="object_id" />
                    <Layer {...pointDataLayer}
                        onHover={this.props.onHover}
                        onLeave={this.props.onHoverLeave}
                        onClick={this.onClick} />
                    {this.renderTooltip()}
                    {this.props.hoveredBusId && (
                        <FeatureState
                            id={this.props.hoveredBusId}
                            source='Point-data'
                            state={{
                                hover: true,
                            }}
                        />
                    )}
                    {this.props.clickedBusId && (
                        <FeatureState
                            id={this.props.clickedBusId}
                            source='Point-data'
                            state={{
                                selected: true,
                            }}
                        />
                    )}
                </MapGL>
            </>
        )
    }
}