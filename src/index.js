// import React from "react";
// import ReactDOM from "react-dom";
// import mapboxgl from "mapbox-gl";

import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";

var MAPBOX_ID = process.env.REACT_APP_MAPBOX_KEY;

mapboxgl.accessToken = MAPBOX_ID;

class Application extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lng: -73.9982,
			lat: 40.7498,
			zoom: 14.2,
		};
	}

	componentDidMount() {
		const map = new mapboxgl.Map({
			container: this.mapContainer,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [this.state.lng, this.state.lat],
			zoom: this.state.zoom,
		});

		map.on("move", () => {
			this.setState({
				lng: map.getCenter().lng.toFixed(4),
				lat: map.getCenter().lat.toFixed(4),
				zoom: map.getZoom().toFixed(2),
			});
		});
	}

	render() {
		return (
			<div>
				<div className="sidebarStyle">
					<div>
						Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom:{" "}
						{this.state.zoom}
					</div>
				</div>
				<div ref={(el) => (this.mapContainer = el)} className="mapContainer" />
			</div>
		);
	}
}

ReactDOM.render(<Application />, document.getElementById("app"));
