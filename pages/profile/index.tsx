import Layout from "@/components/MainLayout";
import { useUser } from "@/utils/auth";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import app from "@/config/firebase";

const Profile = () => {
	const { user, loading } = useUser();
	const router = useRouter();
	const [name, setName] = useState(user?.displayName || "");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	useEffect(() => {
		setName(user?.displayName || "");
	}, [user]);

	if (loading) {
		return <p>Loading...</p>;
	}
	if (user == null) {
		router.replace("/login");
		return null;
	}

	const handleProfileUpdate = async (e: any) => {
		e.preventDefault();
		try {
			// UPDATE USER NAME

			// await auth.
			await updateProfile(user, {
				displayName: name,
			});
			setSuccess("Profile updated successfully!");
		} catch (error: any) {
			setError(error?.message);
		}
	};

	console.log(user, user.displayName);

	return (
		<Layout>
			<div className="max-w-lg mx-auto w-full ">
				<h2 className="text-2xl font-bold my-4 mx-2">Profile Page</h2>
				<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4min-w-full mx-2">
					<div className="mb-4 ">
						<label
							className="block text-gray-700 font-bold mb-2"
							htmlFor="email"
						>
							Email
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200 cursor-not-allowed"
							id="email"
							type="email"
							placeholder="Enter your email"
							value={user.email || "No Email?"}
							disabled
						/>
					</div>
					<div className="mb-4">
						<label
							className="block text-gray-700 font-bold mb-2"
							htmlFor="name"
						>
							Name
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="name"
							type="text"
							placeholder="Enter your name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="flex items-center justify-between">
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							type="button"
							onClick={handleProfileUpdate}
						>
							Update Profile
						</button>
					</div>

					<div>
						{success && (
							<p className="text-green-500 text-sm">{success}</p>
						)}
						{error && (
							<p className="text-red-500 text-sm">{error}</p>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default Profile;
