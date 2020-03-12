import React from 'react';
import openSocket from 'socket.io-client'
import MapGL, { Source, Layer } from 'react-map-gl';
// import './tooltip.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import { dataLayer } from './dataLayer';
import getFeatures from './getFeatures'
import updatePercentiles from './updatePercentiles';
import BusMarker from './Marker/marker';
import MARKER_STYLE from './Marker/marker-style';
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYXJ0dm9sY2hhcmEiLCJhIjoiY2s3bHJ2NjU4MGFjbDNtczJnam10aDU1aSJ9.oH_RWYjKfrKGC77mYIQ8oA';



export default class Map extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            hoveredFeature: null,
            clickedBusId: '',
            telemetry: null,
            viewport: {
                longitude: 37.4067,
                latitude: 55.7187,
                zoom: 15,
                bearing: 0,
                pitch: 50
            },
        };

    }
    componentDidMount() {
        console.log("map mounted")
        this.busTelemetrySocket = openSocket(`http://localhost:8000/buses/telemetry`, { query: `object_id=${this.state.clickedBusId}` });
        this.busTelemetrySocket.on("busTelemetry", (busTelemetry) => this.setState({ telemetry: busTelemetry }));
    }
    componentDidUpdate(prevProps, prevState) {
        console.log("map updated");     
        if (prevState.clickedBusId !== this.state.clickedBusId) {
            console.log(prevState.clickedBusId, this.state.clickedBusId);
            this.busTelemetrySocket.disconnect()
            this.busTelemetrySocket = openSocket(`http://localhost:8000/buses/telemetry`, { query: `object_id=${this.state.clickedBusId}` });
            this.busTelemetrySocket.on("busTelemetry", (busTelemetry) => this.setState({ telemetry: busTelemetry }));
        }
    }
    componentWillReceiveProps(nextProps) {
        const features = getFeatures(nextProps.buses)
        this.setState({ data: updatePercentiles(features) })
    }
    _onViewportChange = viewport => this.setState({ viewport });

    // _onHover = event => {
    //     const {
    //         features,
    //         srcEvent: { offsetX, offsetY }
    //     } = event;
    //     const hoveredFeature = features && features.find(f => f.layer.id === 'data');
    //     this.setState({ hoveredFeature, x: offsetX, y: offsetY });
    // };
    _onClick = event => {
        const {
            features,
        } = event;
        const clickedPoint = features && features.find(f => f.layer.id === 'data');
        if (clickedPoint) {
            console.log(clickedPoint.properties.object_id);
            this.setState({ clickedBusId: clickedPoint.properties.object_id });
        }

    };
    handleMarkerClick = (event) => {

    }
    // _renderTooltip() {
    //     const { hoveredFeature, x, y } = this.state;
    //     const tooltipStyle = {
    //         position: "absolute",
    //         left: x,
    //         top: y,
    //         margin: "8px",
    //         padding: "4px",
    //         background: "rgba(0, 0, 0, 0.8)",
    //         color: "#fff",
    //         maxWidth: "300px",
    //         fontsize: "10px",
    //         zIndex: 9,
    //         pointerEvents: "none",
    //         cursor: "pointer",
    //     }
    //     return (
    //         hoveredFeature && (
    //             <div style={tooltipStyle}>
    //                 <div>Type: Bus</div>
    //                 <div>Registration number: {hoveredFeature.properties.reg_number}</div>
    //                 <div>Route: {hoveredFeature.properties.route}</div>
    //             </div>
    //         )
    //     );
    // }

    render() {
        console.log("map rendered");
        return (
            <div className="mapContainer">
                <div className='sidebarStyle'>
                    <div>Longitude: {this.state.viewport.longitude} | Latitude: {this.state.viewport.latitude} | Zoom: {this.state.viewport.zoom}</div>
                </div>
                <MapGL
                    {...this.state.viewport}
                    {...this.state.settings}
                    width="100%"
                    height="100%"
                    mapStyle="mapbox://styles/mapbox/dark-v9"
                    onViewportChange={this._onViewportChange}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                    onHover={this._onHover}
                    onClick={this._onClick}
                >
                    <style>{MARKER_STYLE}</style>
                    {this.props.buses.map((bus,index) => 
                        <BusMarker bus={bus} index={index} key={index}/>
                    )}
                    {/* <Source type="geojson" data={this.state.data}>
                        <Layer {...dataLayer} />
                    </Source>
                    {this._renderTooltip()} */}
                </MapGL>
            </div>
        )
    }
}