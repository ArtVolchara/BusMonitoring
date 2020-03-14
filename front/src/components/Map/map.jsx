import React from 'react';
import openSocket from 'socket.io-client'
import MapGL, { Source, Layer } from 'react-map-gl';
import './BusGeoJSON/tooltip.css'
import 'mapbox-gl/dist/mapbox-gl.css';
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
            hoveredFeature: null,
            clickedBusId: '',
            busTelemetry: null,
            viewport: {
                longitude: 37.4067,
                latitude: 55.7187,
                zoom: 15,
                bearing: 0,
            },
        };

    }

    _onViewportChange = viewport => this.setState({ viewport });

    _onHover = event => {
        const {
            features,
            srcEvent: { offsetX, offsetY }
        } = event;
        const hoveredFeature = features && features.find(f => f.layer.id === 'Point-data');
        this.setState({ hoveredFeature, x: offsetX, y: offsetY });
    };
    _getCursor = ({ isHovering, isDragging }) => {
        return isHovering ? 'pointer' : 'default';
    };
    _onClick = event => {
        const {
            features,
        } = event;
        const clickedPoint = features && features.find(f => f.layer.id === 'Point-data');
        if (clickedPoint) {
            this.setState({ clickedBusId: clickedPoint.properties.object_id });
        }

    };
    _renderTooltip() {
        const { hoveredFeature, x, y } = this.state;
        const tooltipStyle = {
            position: "absolute",
            left: x,
            top: y,
            margin: "8px",
            padding: "4px",
            background: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            maxWidth: "300px",
            fontsize: "10px",
            zIndex: 9,
            pointerEvents: "none",
        }
        return (
            hoveredFeature && (
                <div style={tooltipStyle}>
                    <div>Type: Bus</div>
                    <div>Registration number: {hoveredFeature.properties.reg_number}</div>
                    <div>Route: {hoveredFeature.properties.route}</div>
                </div>
            )
        );
    }
    componentDidMount() {
        console.log("map mounted")
        this.busTelemetrySocket = openSocket(`http://localhost:8000/buses/telemetry`, { query: `object_id=${this.state.clickedBusId}` });
        this.busTelemetrySocket.on("busTelemetry", (busTelemetry) => this.setState({ telemetry: busTelemetry }));
    }
    componentDidUpdate(prevProps, prevState) {
        console.log("map updated");
        if (prevState.clickedBusId !== this.state.clickedBusId) {
            this.busTelemetrySocket.disconnect()
            this.busTelemetrySocket = openSocket(`http://localhost:8000/buses/telemetry`, { query: `object_id=${this.state.clickedBusId}` });
            this.busTelemetrySocket.on("busTelemetry",  (busTelemetry) => {
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
            <div className="mapContainer">
                <div className='sidebarStyle'>
                    <div>Longitude: {this.state.viewport.longitude} | Latitude: {this.state.viewport.latitude} | Zoom: {this.state.viewport.zoom}</div>
                </div>
                <MapGL
                    {...this.state.viewport}
                    width="100%"
                    height="100%"
                    mapStyle="mapbox://styles/mapbox/dark-v9"
                    onViewportChange={this._onViewportChange}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                    onHover={this._onHover}
                    onClick={this._onClick}
                    clickRadius={2}
                    interactiveLayerIds = {['Point-data']}
                    getCursor={this._getCursor}
                >
                    <Source type="geojson" data={this.state.pointsData}>
                        <Layer {...pointDataLayer} />
                    </Source>
                    {this._renderTooltip()}
                    {this.state.clickedBusId ?
                        <Source type="geojson" data={this.state.linesData}>
                            <Layer {...lineDataLayer} />
                        </Source>
                        : <></>
                    }
                </MapGL>
            </div>
        )
    }
}