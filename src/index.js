// import React from "react";
// import ReactDOM from "react-dom";
// import mapboxgl from "mapbox-gl";

import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import "./index.css";
//import d3 from "d3";

var MAPBOX_ID = process.env.REACT_APP_MAPBOX_KEY;

mapboxgl.accessToken = MAPBOX_ID;

class Application extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lng: 31.4606,
			lat: 20.7927,
			zoom: 0.5,
		};
	}

	componentDidMount() {
		const map = new mapboxgl.Map({
			container: this.mapContainer,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [this.state.lng, this.state.lat],
			zoom: this.state.zoom,
		});

		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		map.on("move", () => {
			this.setState({
				lng: map.getCenter().lng.toFixed(4),
				lat: map.getCenter().lat.toFixed(4),
				zoom: map.getZoom().toFixed(2),
			});
		});

		map.on("load", function () {
			function filterBy(month) {
				var filters = ["==", "month", month];
				map.setFilter("earthquake-circles", filters);
				map.setFilter("earthquake-labels", filters);
				// Set the label to the month
				document.getElementById("month").textContent = months[month];
				document.getElementById("slider").value = `${month}`;
			}
			// Data courtesy of http://earthquake.usgs.gov/
			// Query for significant earthquakes in 2015 URL request looked like this:
			// http://earthquake.usgs.gov/fdsnws/event/1/query
			//    ?format=geojson
			//    &starttime=2015-01-01
			//    &endtime=2015-12-31
			//    &minmagnitude=6'
			//
			// Here we're using d3 to help us make the ajax request but you can use
			// Any request method (library or otherwise) you wish.
			fetch(
				"https://docs.mapbox.com/mapbox-gl-js/assets/significant-earthquakes-2015.geojson"
			)
				.then((res) => res.json())
				.then((data, err) => {
					if (err) throw err;
					// Create a month property value based on time
					// used to filter against.
					data.features = data.features.map(function (d) {
						d.properties.month = new Date(d.properties.time).getMonth();
						return d;
					});
					map.addSource("earthquakes", {
						type: "geojson",
						data: data,
					});
					map.addLayer({
						id: "earthquake-circles",
						type: "circle",
						source: "earthquakes",
						paint: {
							"circle-color": [
								"interpolate",
								["linear"],
								["get", "mag"],
								6,
								"#FCA107",
								8,
								"#7F3121",
							],
							"circle-opacity": 0.75,
							"circle-radius": [
								"interpolate",
								["linear"],
								["get", "mag"],
								6,
								20,
								8,
								40,
							],
						},
					});
					map.addLayer({
						id: "earthquake-labels",
						type: "symbol",
						source: "earthquakes",
						layout: {
							"text-field": ["concat", ["to-string", ["get", "mag"]], "m"],
							"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
							"text-size": 12,
						},
						paint: {
							"text-color": "rgba(0,0,0,0.5)",
						},
					});
					// Set filter to first month of the year
					// 0 = January
					filterBy(0);
					document
						.getElementById("slider")
						.addEventListener("input", function (e) {
							var month = parseInt(e.target.value, 10);
							filterBy(month);
						});
				});
		});
	}

	render() {
		return (
			<div>
				<div className="sidebarStyle">
					{/* <div>
						Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom:{" "}
						{this.state.zoom}
					</div> */}
				</div>
				<div ref={(el) => (this.mapContainer = el)} className="mapContainer" />
				<div className="map-overlay top">
					<div className="map-overlay-inner">
						<h2>Significant earthquakes in 2015</h2>
						<label id="month"></label>
						<input
							id="slider"
							type="range"
							min="0"
							max="11"
							step="1"
							value="0"
						/>
					</div>
					<div className="map-overlay-inner">
						<div id="legend" className="legend">
							<div className="bar"></div>
							<div>Magnitude (m)</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<Application />, document.getElementById("app"));
