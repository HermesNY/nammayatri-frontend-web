import Head from "next/head";
import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";

var map: any = null;

let mapLoaded: boolean = false;

const notifyError: (message: string) => void = (message) => {
	alert(message);
};

const validateMicrosoft: () => boolean = () => {
	// try {
	// 	if (!Microsoft) {
	// 		return false;
	// 	}
	// 	return true;
	// } catch (err) {
	// 	console.error(err);
	// 	return false;
	// }
	return true;
};

const validateMap: () => boolean = () => {
	if (validateMicrosoft()) if (map) return true;

	return false;
};

const loadMap: () => void = () => {
	// if map is already loaded or Microsoft is not defined, return
	if (!validateMicrosoft()) {
		notifyError("maps sdk not loaded");
		return;
	}
	if (!validateMap()) {
		map = new Microsoft.Maps.Map(document.getElementById("myMap"), {
			/* No need to set credentials if already passed in URL */
			center: new Microsoft.Maps.Location(47.606209, -122.332071),
			zoom: 12,
		});
	} else {
		notifyError("Map already loaded");
	}
};

const loadDirections: () => void = () => {
	console.log(map);
	if (validateMap()) {
		console.log("direction");

		Microsoft.Maps.loadModule("Microsoft.Maps.Directions", () => {
			var directionsManager =
				new Microsoft.Maps.Directions.DirectionsManager(map);
			// Set Route Mode to driving
			directionsManager.setRequestOptions({
				routeMode: Microsoft.Maps.Directions.RouteMode.driving,
			});
			var waypoint1 = new Microsoft.Maps.Directions.Waypoint({
				address: "Redmond",
				location: new Microsoft.Maps.Location(
					47.67683029174805,
					-122.1099624633789
				),
			});
			var waypoint2 = new Microsoft.Maps.Directions.Waypoint({
				address: "Seattle",
				location: new Microsoft.Maps.Location(
					47.59977722167969,
					-122.33458709716797
				),
			});
			directionsManager.addWaypoint(waypoint1);
			directionsManager.addWaypoint(waypoint2);
			// Set the element in which the itinerary will be rendered
			directionsManager.setRenderOptions({
				itineraryContainer: document.getElementById("printoutPanel"),
			});
			directionsManager.calculateDirections();
		});
	} else {
		notifyError("Unable to direct   ");
	}
};

const MapComponent = () => {
	const [location, setLocation] = useState(null);
	const mapRef = useRef(null);
	function GetMap() {
		loadMap();
	}
	console.log(process.env.MAPS_KEY);
	useEffect(() => {}, []);
	return (
		<>
			<Script
				type="text/javascript"
				src={`https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=${process.env.NEXT_PUBLIC_MAPS_KEY}`}
			/>

			<div>
				<div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							loadDirections();
						}}
					>
						<input
							type="text"
							id="sourceLoc"
							name="sourceLoc"
							placeholder="Enter Source "
						/>
						<input
							type="text"
							id="destinationLoc"
							name="destinationLoc"
							placeholder="Enter Destination "
						/>
						<button type="button" onClick={GetMap}>
							Load Map{" "}
						</button>
						<button type="submit">Get Directions</button>
					</form>
				</div>

				<div className="mapContainer">
					<div
						style={{
							width: "800px",
							height: "500px",
						}}
						id="myMap"
						ref={mapRef}
					></div>
				</div>
			</div>
		</>
	);
};

export default MapComponent;
