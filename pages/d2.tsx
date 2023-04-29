import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import { useUser } from "@/utils/auth";
import { getAuth } from "firebase/auth";
import app from "@/config/firebase";
import MapComponent from "./map";

export default function DashboardPage() {
	const { user, loading } = useUser();
	const [source, setSource] = useState("");
	const [destination, setDestination] = useState("");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const router = useRouter();

	const auth = getAuth(app);
	const firebaseLogout = () => auth.signOut();
	if (loading) {
		return <p>Loading...</p>;
	}

	if (user == null) {
		router.replace("/login");
		return;
	}

	return (
		<div className="flex flex-col h-screen">
			<div className="flex items-center justify-between bg-gray-800 text-white p-4 md:hidden">
				<button
					className="text-white focus:outline-none"
					onClick={() => setSidebarOpen(!sidebarOpen)}
				>
					<svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
						{sidebarOpen ? (
							<path d="M6 18L18 6M6 6l12 12" />
						) : (
							<path d="M4 6h16M4 12h16M4 18h16" />
						)}
					</svg>
				</button>
				<h1 className="text-2xl font-bold">Dashboard</h1>
				<div></div>
			</div>
			<div className="flex-1 flex flex-col md:flex-row">
				<div
					className={`bg-gray-800 text-white w-full md:w-64 flex-shrink-0 ${
						sidebarOpen ? "block" : "hidden"
					}`}
				>
					<div className="p-4">
						<h2 className="text-lg font-bold mb-2">Profile</h2>
						<p>{user.email}</p>
					</div>
					<div className="p-4">
						<h2 className="text-lg font-bold mb-2">
							Previous Rides
						</h2>
						<ul>
							<li>Ride 1</li>
							<li>Ride 2</li>
							<li>Ride 3</li>
						</ul>
					</div>
					<div className="p-4">
						<button
							className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
							onClick={firebaseLogout}
						>
							Logout
						</button>
					</div>
				</div>
				<div className="flex-1 flex flex-col">
					<div className="bg-gray-800 text-white p-4 md:hidden">
						<button
							className="text-white focus:outline-none"
							onClick={() => setSidebarOpen(!sidebarOpen)}
						>
							<svg
								className="h-6 w-6 fill-current"
								viewBox="0 0 24 24"
							>
								{sidebarOpen ? (
									<path d="M6 18L18 6M6 6l12 12" />
								) : (
									<path d="M4 6h16M4 12h16M4 18h16" />
								)}
							</svg>
						</button>
						<h1 className="text-2xl font-bold">Dashboard</h1>
						<div></div>
					</div>
					<div className="flex-1 flex flex-col">
						<div className="p-4">
							<h2 className="text-lg font-bold mb-2">
								Auto Driving
							</h2>
							<form>
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
										onChange={(e) =>
											setSource(e.target.value)
										}
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
										onChange={(e) =>
											setDestination(e.target.value)
										}
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
							<MapComponent />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
