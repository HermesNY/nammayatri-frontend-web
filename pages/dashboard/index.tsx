import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/utils/auth";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import MapComponent from "../map";
import app from "@/config/firebase";

const firebaseLogout = () => {
	const auth = getAuth(app);
	auth.signOut();
};

export default function Dashboard() {
	const { user, loading } = useUser();
	const [source, setSource] = useState("");
	const [destination, setDestination] = useState("");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const router = useRouter();
	const auth = getAuth();

	const handleLogout = async () => {
		try {
			await auth.signOut();
			router.replace("/login");
		} catch (error) {
			console.error(error);
		}
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	if (user == null) {
		router.replace("/login");
		return;
	}

	return (
		<div className="flex flex-col h-screen">
			<div className="flex items-center justify-between bg-gray-800 text-white p-4">
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
							className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 "
							onClick={(e) => {
								e.preventDefault();
								localStorage.removeItem("user");
								firebaseLogout();
							}}
						>
							Logout
						</button>
					</div>
				</div>
				<div className="flex-1 flex flex-col">
					<div className="p-4">
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
									onChange={(e) =>
										setDestination(e.target.value)
									}
								/>
							</div>
							<button type="submit">Start Driving</button>
						</form>
					</div>
					<div className="flex-1">
						<MapComponent />
					</div>
				</div>
			</div>
		</div>
	);
}
