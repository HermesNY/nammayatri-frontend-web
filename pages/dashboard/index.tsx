import { useUser } from "@/utils/auth";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { getAuth } from "firebase/auth";
import {
	getFirestore,
	collection,
	query,
	where,
	onSnapshot,
	addDoc,
} from "firebase/firestore";
import app from "@/config/firebase";
import Layout from "@/components/MainLayout";
// import MapComponent from "../map";

import { v4 as uuidv4 } from "uuid";

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
	if (!validateMap() || true) {
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

			// calculate route

			directionsManager.calculateDirections();
		});
	} else {
		notifyError("Unable to get directions");
	}
};

const auth = getAuth(app);
const db = getFirestore(app);

export default function Dashboard() {
	const { user, loading } = useUser();
	const router = useRouter();
	const [source, setSource] = useState(null);
	const [destination, setDestination] = useState(null);

	const mapRef = useRef(null);
	const [dist, setDist] = useState(4);

	// const [source, setSource] = useState("");
	// const [destination, setDestination] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [selectedCab, setSelectedCab]: any = useState(null);
	const [currentStep, setCurrentStep] = useState(0);
	const [cabs, setCabs] = useState([]);

	useEffect(() => {
		if (!mapRef.current) return;
		setTimeout(() => {
			loadMap();
			suggestSource();
			suggestDestination();
		}, 1000);
	}, [mapRef]);

	// get cabs from Firestore based on source location
	useEffect(() => {
		if (source) {
			const q = query(
				collection(db, "cabs"),
				where("source", "==", source.label)
			);
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const cabs = [];
				querySnapshot.forEach((doc) => {
					cabs.push({ id: doc.id, ...doc.data() });
				});
				setCabs(cabs);
			});
			return () => unsubscribe();
		}
	}, [source]);

	// start booking
	const handleBooking = (e: any) => {
		// e.preventDefault();
		if (!source?.label || !destination?.label) {
			alert("Please select source and destination");
			return;
		}
		setShowModal(true);
	};

	const handleModalClose = () => {
		setShowModal(false);
		setCurrentStep(0);
		setSelectedCab(null);
	};

	const handleCabSelect = (cab) => {
		setSelectedCab(cab);
		setCurrentStep(1);
	};

	const [loadBooking, setLoadBooking] = useState(false);

	const handleConfirmation = async () => {
		setLoadBooking(true);
		try {
			const bookingRef = collection(db, "bookings");

			if (selectedCab == null) {
				return;
			}
			const uid = await crypto?.randomUUID();
			const date = new Date();

			await addDoc(bookingRef, {
				id: uid,
				cabId: selectedCab.id,
				userId: user.uid,
				source,
				destination,
				time: date,
				status: "in-progress",
				price: selectedCab.price * dist,
			});
			setCurrentStep(2);

			// call api for sending whatsapp update
			const res = await fetch("/api/sendWhatsApp", {
				method: "POST",
				body: JSON.stringify({
					id: uid,
					cabId: selectedCab.id,
					userId: user.uid,
					driverName: selectedCab.name,
					from: source.label,
					to: destination.label,
					fareAmount: selectedCab.price * dist,
					driverContact: "+918901523579", //random
					time: date,
					status: "in-progress",
					price: selectedCab.price * dist,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			setLoadBooking(false);
		} catch (error) {
			console.error(error);
		}
	};

	const handleBack = () => {
		if (currentStep <= 0) {
			setCurrentStep(0);
			handleModalClose();
		}
		setCurrentStep(currentStep - 1);
	};

	const handleNext = () => {
		if (currentStep >= 2) {
			return;
		}
		setCurrentStep(currentStep + 1);
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!user) {
		router.replace("/login");
		return null;
	}

	console.log(currentStep);

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

	return (
		<Layout>
			<div className="p-md-4">
				<form
					className="m-4"
					onSubmit={(e) => {
						e.preventDefault();
						if (!source || !destination) return;
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
								placeholder="Try typing Bengaluru East and select from the dropdown"
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
					<button
						type="button"
						onClick={(e) => {
							handleBooking(e);
						}}
						className="disabled:bg-neutral-500 mx-1"
						disabled={!source?.label || !destination?.label}
					>
						Book now
					</button>
				</form>
			</div>
			<div className="flex-1">
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
						<div className="mapContainer max-w-full max-h-full">
							<div
								style={{
									width: "800px",
									height: "400px",
									maxWidth: "100%",
									maxHeight: "100%",
								}}
								id="myMap"
								ref={mapRef}
							></div>
						</div>

						<div></div>
					</div>
				</>
			</div>
			{showModal && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-4 rounded-md max-w-lg">
						<h2 className="text-lg font-bold mb-2">Book a Cab</h2>
						{currentStep === 0 && (
							<div>
								<p className="mb-4">
									Please select a cab for your ride from{" "}
									{source?.label || source} to{" "}
									{destination?.label || destination}
								</p>

								<div>
									{cabs.length === 0 ? (
										<p className="py-4">
											No Cabs Available
										</p>
									) : (
										cabs.map((cab) => (
											<div
												key={cab.id}
												className="w-1/2 px-2 mb-4"
											>
												<div
													className={`bg-white p-4 rounded-md border ${
														selectedCab === cab
															? "border-blue-500"
															: ""
													}`}
													onClick={() => {
														handleCabSelect(cab);
													}}
												>
													<h3 className="text-lg font-bold mb-2">
														{cab.name}
													</h3>
													<p className="text-gray-700">
														{cab.desc}
													</p>
													<p className="text-gray-700 font-bold mt-2">
														{cab.price * dist}
													</p>
												</div>
											</div>
										))
									)}
								</div>
							</div>
						)}
						{currentStep === 1 && (
							<p className="mb-4">
								You have selected {selectedCab.name} for your
								ride from {source.label} to {destination.label}.
							</p>
						)}
						{currentStep === 2 && (
							<p className="mb-4">
								Your booking has been confirmed.
							</p>
						)}
						{
							<div className="flex">
								{currentStep === 1 ? (
									<>
										<button
											disabled={loadBooking}
											className="bg-blue-500 disabled:bg-slate-600  hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
											onClick={() => {
												if (
													selectedCab == null ||
													source == null ||
													destination == null
												) {
													return;
												}

												if (loadBooking) {
													return;
												}

												handleConfirmation();
											}}
										>
											Confirm
										</button>

										<button
											className={`bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ${
												loadBooking ? "hidden" : ""
											} `}
											disabled={loadBooking}
											onClick={handleBack}
										>
											Back
										</button>
									</>
								) : null}

								{/* {currentStep === 1 && (
									
								)} */}
							</div>
						}
						{(currentStep === 0 || currentStep === 2) && (
							<button
								className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
								onClick={handleModalClose}
							>
								Close
							</button>
						)}
					</div>
				</div>
			)}
		</Layout>
	);
}
