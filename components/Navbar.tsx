import app from "@/config/firebase";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import React from "react";

const firebaseLogout = () => {
	const auth = getAuth(app);
	auth.signOut();
};

const Navbar = () => {
	return (
		<nav>
			<h1>NammaYatri</h1>

			<div className="links">
				<Link href="/dashboard">Dashboard</Link>
				<Link href="/rides">Rides</Link>

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
		</nav>
	);
};

export default Navbar;
