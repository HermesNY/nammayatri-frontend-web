import { useUser } from "@/utils/auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import app from "@/config/firebase";
import Layout from "@/components/MainLayout";
import MapComponent from "../map";

const auth = getAuth(app);

export default function Dashboard() {
	const { user, loading } = useUser();
	const router = useRouter();

	const [source, setSource] = useState("");
	const [destination, setDestination] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [selectedCab, setSelectedCab] = useState(null);
	const [currentStep, setCurrentStep] = useState(0);

	// start booking
	const handleBooking = (e) => {
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

	const handleConfirmation = () => {
		// TODO: Implement confirmation logic
		setCurrentStep(2);
	};

	const handleBack = () => {
		setCurrentStep(currentStep - 1);
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!user) {
		router.replace("/login");
		return null;
	}

	let cabs = [{ name: "uday", description: "AZ*@2343", price: 12.32 }];
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
							<p className="mb-4">
								Please select a cab for your ride from {source}{" "}
								to {destination}
							</p>
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
						<div className="flex flex-wrap -mx-2">
							{currentStep === 0 &&
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
												{cab.description}
											</p>
											<p className="text-gray-700 font-bold mt-2">
												{cab.price}
											</p>
										</div>
									</div>
								))}
						</div>
						{currentStep === 1 && (
							<div className="flex">
								<button
									className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
									onClick={handleConfirmation}
								>
									Confirm
								</button>
								<button
									className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
									onClick={handleBack}
								>
									Back
								</button>
							</div>
						)}
						{currentStep === 2 && (
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
