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
			await deleteDoc(doc(db, "bookings", bookingId));
		} catch (e) {
			console.error("Error deleting document: ", e);
		}
	};
	const [driverName, setDriverName] = useState(null);

	useEffect(() => {
		const getDriverName = async (driverId) => {
			const docRef = doc(db, "drivers", driverId);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				setDriverName(docSnap.data().name);
			} else {
				console.log("No such document!");
			}
		};
		if (booking.driverId) {
			getDriverName(booking.driverId);
		}
	}, [booking.driverId]);
	return (
		<div
			key={booking.id}
			className={`mb-4 ${booking.cancelled ? "bg-gray-200" : ""}`}
		>
			<div className="flex justify-between items-center mb-2">
				<h3 className="text-lg font-bold">{booking.cabName}</h3>
				{!booking.cancelled && (
					<button
						className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
						onClick={() => handleCancelBooking(booking.id)}
					>
						Cancel
					</button>
				)}
			</div>
			<p className="text-gray-700">
				{booking.source} to {booking.destination}
			</p>
			<p className="text-gray-700 font-bold">{booking.price}</p>
			{booking.driverId && (
				<p className="text-gray-700">Driver: {driverName}</p>
			)}
			{booking.cancelled && (
				<p className="text-red-500 font-bold">Cancelled</p>
			)}
		</div>
	);
};
