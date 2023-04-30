import { useUser } from "@/utils/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
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
import MapComponent from "../map";

import { v4 as uuidv4 } from "uuid";

const auth = getAuth(app);
const db = getFirestore(app);

export default function Dashboard() {
	const { user, loading } = useUser();
	const router = useRouter();

	const [dist, setDist] = useState(4);

	const [source, setSource] = useState("");
	const [destination, setDestination] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [selectedCab, setSelectedCab]: any = useState(null);
	const [currentStep, setCurrentStep] = useState(0);
	const [cabs, setCabs] = useState([]);

	// get cabs from Firestore based on source location
	useEffect(() => {
		if (source) {
			const q = query(
				collection(db, "cabs"),
				where("source", "==", source)
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
		e.preventDefault();
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
	return (
		<Layout>
			<div className="p-4">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleBooking(e);
					}}
				>
					<div className="mb-4">
						<label
							htmlFor="source"
							className="block text-gray-700 font-bold mb-2"
						>
							Source
						</label>
						<input
							type="text"
							id="source"
							className="w-full px-3 py-2 border rounded"
							value={source}
							onChange={(e) => setSource(e.target.value)}
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="destination"
							className="block text-gray-700 font-bold mb-2"
						>
							Destination
						</label>
						<input
							type="text"
							id="destination"
							className="w-full px-3 py-2 border rounded"
							value={destination}
							onChange={(e) => setDestination(e.target.value)}
						/>
					</div>
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
					>
						Start Driving
					</button>
				</form>
			</div>
			<div className="flex-1">
				<MapComponent source={source} destination={destination} />
			</div>
			{showModal && (
				<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-4 rounded-md">
						<h2 className="text-lg font-bold mb-2">Book a Cab</h2>
						{currentStep === 0 && (
							<div>
								<p className="mb-4">
									Please select a cab for your ride from{" "}
									{source} to {destination}
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
								ride from {source} to {destination}.
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
