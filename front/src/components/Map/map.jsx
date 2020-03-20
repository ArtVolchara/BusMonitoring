import React from 'react';
import openSocket from 'socket.io-client'
import MapGL, { Source, Layer, FeatureState } from '@urbica/react-map-gl';
import './BusGeoJSON/tooltip.css'
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
            let clickedBusId = clickedPoint.properties.object_id;
            this.props.handleClickedBus(clickedBusId);
        }
    };
    renderTooltip() {
        const { hoveredBusFeature, x, y } = this.props;
        const tooltipStyle = {
            position: "absolute",
            left: x,
            top: y,
            margin: "8px",
            padding: "4px",
            background: '#081217',
            color: '#d3d6d9',
            opacity: 0.9,
            maxWidth: "300px",
            borderRadius: '5px',
            fontWeight: 'bold',
            fontFamily: 'DIN Pro Medium',
            zIndex: 1,
            pointerEvents: "none",
        }
        return (
            hoveredBusFeature && (
                <div style={tooltipStyle}>
                    <div>Type: Bus</div>
                    <div>Registration number: {hoveredBusFeature.properties.reg_number}</div>
                    <div>Route: {hoveredBusFeature.properties.route}</div>
                </div>
            )
        );
    }
    componentDidMount() {
        console.log("map mounted")
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
        // console.log("map rendered");
        return (
            <div className="mapContainer">
                <div className='sidebarStyle'>
                    <span>Longitude: {this.state.viewport.longitude}</span><span>Latitude: {this.state.viewport.latitude}</span><span>Zoom: {this.state.viewport.zoom}</span>
                </div>
                <MapGL
                    {...this.state.viewport}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/artvolchara/ck7ujql690k1a1ipaa5h7hr3o"
                    onViewportChange={this.onViewportChange}
                    accessToken={MAPBOX_TOKEN}
                    cursorStyle={this.props.hoveredBusFeature ?
                        'pointer'
                        : null}
                >
                    <Source id='Point-data' type="geojson" data={this.state.pointsData} promoteId="object_id" />
                    <Layer {...pointDataLayer}
                        onHover={this.props.onHover}
                        onLeave={this.props.onHoverLeave}
                        onClick={this.onClick} />
                    {this.renderTooltip()}
                    {this.props.clickedBusId ?
                        <>
                            <Source id='Line-data' type="geojson" data={this.state.linesData} />
                            <Layer id='Line-data'{...lineDataLayer} />
                        </>
                        : <></>
                    }
                    {this.props.hoveredBusFeature && (
                        <FeatureState
                            id={this.props.hoveredBusFeature.properties.object_id}
                            source='Point-data'
                            state={{
                                hover: true,
                            }}
                        />
                    )}
                </MapGL>
            </div>
        )
    }
}