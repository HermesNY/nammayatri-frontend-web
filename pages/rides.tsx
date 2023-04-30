import { useUser } from "@/utils/auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
	getAuth,
	onAuthStateChanged,
	signInWithEmailAndPassword,
} from "firebase/auth";
import {
	getFirestore,
	collection,
	query,
	where,
	onSnapshot,
	deleteDoc,
	doc,
	getDoc,
	updateDoc,
} from "firebase/firestore";
import app from "@/config/firebase";
import Layout from "@/components/MainLayout";

const auth = getAuth(app);
const db = getFirestore(app);

type Booking = {
	cabId: number;
	destination: string;
	id: string;
	price: number;
	source: string;
	time: any;
	status: "in-progress" | "cancelled" | "fullfilled";
	userId: string;
};

export default function Rides() {
	const { user, loading } = useUser();
	const router = useRouter();

	const [bookings, setBookings]: [Booking[], any] = useState([]);

	// get bookings from Firestore based on user ID
	useEffect(() => {
		if (user) {
			const q = query(
				collection(db, "bookings"),
				where("userId", "==", user.uid)
			);
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const bookings: any[] = [];
				querySnapshot.forEach((doc) => {
					bookings.push({ id: doc.id, ...doc.data() });
				});
				setBookings(bookings);
			});
			return () => unsubscribe();
		}
	}, [user]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!user) {
		router.replace("/login");
		return null;
	}

	return (
		<Layout>
			<div className="p-4">
				<h2 className="text-lg font-bold mb-4">Your Bookings</h2>
				{bookings.length === 0 && <p>You have no bookings yet.</p>}
				{bookings.map((booking) => (
					<Booking key={booking.id} booking={booking} />
				))}
			</div>
		</Layout>
	);
}

const Booking = ({ booking }) => {
	const handleCancelBooking = async (bookingId) => {
		try {
			await updateDoc(doc(db, "bookings", booking.id), {
				cancelled: true,
				status: "cancelled",
			});
		} catch (e) {
			console.error("Error deleting document: ", e);
		}
	};
	const [driverName, setDriverName] = useState(null);

	useEffect(() => {
		// get dtiver name by query id = cabId
		const getDriverName = async (cabId) => {
			const q = query(collection(db, "cabs"), where("id", "==", cabId));

			// get name
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				querySnapshot.forEach((doc) => {
					setDriverName(doc.data().name);
				});
			});
			return () => unsubscribe();
		};
		if (booking.cabId) {
			getDriverName(booking.cabId);
		}
	}, [booking.cabId]);
	return (
		<div
			key={booking.id}
			className={`mb-4 ${booking.cancelled ? "bg-gray-200" : ""} p-4`}
		>
			<div className="flex justify-between items-center mb-2 space-x-2">
				<p className="text-gray-700 max-w-sm min-w-xs p-1">
					{booking.source?.label?.slice(0, 15) + "..." ||
						booking.source}{" "}
					to{" "}
					{booking.destination?.label?.slice(0, 15) + "..." ||
						booking.destination}
				</p>
				<p className="text-gray-700 font-bold">
					Cost : {booking.price}
				</p>
				{booking.cabId && (
					<p className="text-gray-700">Driver: {driverName}</p>
				)}
				{booking.cancelled && (
					<p className="text-red-500 font-bold">Cancelled</p>
				)}
				<h3 className="text-lg font-bold">{booking.cabName}</h3>
				{/* {!booking.cancelled && (
					<button
						className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
						onClick={() => handleCancelBooking(booking.id)}
					>
						Cancel
					</button>
				)} */}
				{/* 
					show how long ago booking occured from booking.time
					eg. 2 hours ago


				*/}

				<p className="text-gray-700">
					{booking.time.toDate().toLocaleString()}
				</p>
			</div>
		</div>
	);
};
