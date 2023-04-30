import Head from "next/head";
import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";

var map: any = null;

type LocationType = "source" | "destination";

const notifyError: (message: string) => void = (message) => {
	//   alert(message);
};

const validateMicrosoft: () => boolean = () => {
	return true;
};

const validateMap: () => boolean = () => {
	if (validateMicrosoft() && map) return true;
	return false;
};

const loadMap: () => void = () => {
	if (!validateMicrosoft()) {
		notifyError("Maps SDK not loaded");
		return;
	}
	if (!validateMap()) {
		try {
			map = new Microsoft.Maps.Map(document.getElementById("myMap"), {
				center: new Microsoft.Maps.Location(12.97194, 77.59369),
				zoom: 12,
			});
		} catch (e) {
			console.error(e);
		}
	} else {
		notifyError("Map already loaded");
	}
};

type Directions = {
	sourceLoc: { label: string; lat: number; lng: number };
	destinationLoc: { label: string; lat: number; lng: number };
};

const loadDirections: (directions: Directions) => void = (
	directions: Directions
) => {
	if (validateMap() || true) {
		const { sourceLoc, destinationLoc } = directions;
		Microsoft.Maps.loadModule("Microsoft.Maps.Directions", () => {
			var directionsManager =
				new Microsoft.Maps.Directions.DirectionsManager(map);
			directionsManager.setRequestOptions({
				routeMode: Microsoft.Maps.Directions.RouteMode.driving,
				maxRoutes: 1,
				optimize: 1,
				routeDraggable: false,
			});
			var waypoint1 = new Microsoft.Maps.Directions.Waypoint({
				address: sourceLoc.label || "Redmond",
				location: new Microsoft.Maps.Location(
					sourceLoc.lat || 47.67683029174805,
					sourceLoc.lng || -122.1099624633789
				),
			});
			var waypoint2 = new Microsoft.Maps.Directions.Waypoint({
				address: destinationLoc.label || "Seattle",
				location: new Microsoft.Maps.Location(
					destinationLoc.lat || 47.59977722167969,
					destinationLoc.lng || -122.33458709716797
				),
			});
			directionsManager.addWaypoint(waypoint1);
			directionsManager.addWaypoint(waypoint2);
		});
	} else {
		notifyError("Unable to get directions");
	}
};

const MapComponent = () => {
	const [source, setSource] = useState(null);
	const [destination, setDestination] = useState(null);

	const mapRef = useRef(null);

	const selectedSuggestion = (
		suggestionResult: any,
		locationDesc: LocationType
	) => {
		const { latitude, longitude } = suggestionResult.location;
		const label = suggestionResult.formattedSuggestion;
		const location = { label, lat: latitude, lng: longitude };
		if (locationDesc === "source") {
			setSource(location);
		} else {
			setDestination(location);
		}
	};

	const autosuggestLocation: (locationDesc: LocationType) => void = (
		locationDesc
	) => {
		const locInput = document.getElementById(`${locationDesc}Loc`);
		const locInputContainer = document.getElementById(
			`${locationDesc}LocContainer`
		);
		if (!locInput || !locInputContainer) {
			throw Error("The input or container don't exist");
		}
		if (validateMicrosoft() && validateMap()) {
			Microsoft.Maps.loadModule(
				"Microsoft.Maps.AutoSuggest",
				function () {
					var options = {
						maxResults: 4,
						map: map,
					};
					var manager = new Microsoft.Maps.AutosuggestManager(
						options
					);
					manager.attachAutosuggest(
						locInput,
						locInputContainer,
						(suggestionResult) =>
							selectedSuggestion(suggestionResult, locationDesc)
					);
				}
			);
		}
	};

	const suggestSource: () => void = () => {
		autosuggestLocation("source");
	};

	const suggestDestination: () => void = () => {
		autosuggestLocation("destination");
	};

	useEffect(() => {
		if (!mapRef.current) return;
		setTimeout(() => {
			loadMap();
			suggestSource();
			suggestDestination();
		}, 1000);
	}, [mapRef]);

	return (
		<>
			<Script
				type="text/javascript"
				onLoad={() => {
					setTimeout(() => {
						loadMap();
					}, 1000);
				}}
				src={`https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=${process.env.NEXT_PUBLIC_MAPS_KEY}`}
			/>

			<div>
				<div>
					<form
						className="m-4"
						onSubmit={(e) => {
							e.preventDefault();
							loadDirections({
								sourceLoc: source,
								destinationLoc: destination,
							});
						}}
					>
						<div className="mb-4">
							<label
								htmlFor="source"
								className="block text-gray-700 font-bold mb-2"
							>
								Source
							</label>
							<div id="sourceLocContainer">
								<input
									type="text"
									id="sourceLoc"
									name="sourceLoc"
									className="w-full px-3 py-2 border rounded"
									value={source?.label || ""}
									onChange={(e) =>
										setSource({
											...source,
											label: e.target.value,
										})
									}
									autoComplete="none"
								/>
							</div>
						</div>
						<div className="mb-4">
							<label
								htmlFor="destination"
								className="block text-gray-700 font-bold mb-2"
							>
								Destination
							</label>
							<div id="destinationLocContainer">
								<input
									type="text"
									id="destinationLoc"
									name="destinationLoc"
									className="w-full px-3 py-2 border rounded"
									value={destination?.label || ""}
									onChange={(e) =>
										setDestination({
											...destination,
											label: e.target.value,
										})
									}
									autoComplete="none"
								/>
							</div>
						</div>
						<button type="submit">Get Directions</button>
					</form>
				</div>

				<div className="mapContainer">
					<div
						style={{
							width: "800px",
							height: "400px",
						}}
						id="myMap"
						ref={mapRef}
					></div>
				</div>

				{/* <div id="printoutPanel"> </div> */}
				<div>
					Distance: <span id="distance"></span>
				</div>
			</div>
		</>
	);
};

export default MapComponent;
