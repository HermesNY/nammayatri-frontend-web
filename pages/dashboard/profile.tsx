import { useUser } from "@/utils/auth";
import { useRouter } from "next/router";
import React from "react";

const Profile = () => {
	const { user, loading } = useUser();
	const router = useRouter();
	if (loading) {
		return <p>Loading...</p>;
	}

	if (user == null) {
		router.replace("/login");
		return;
	}
	return (
		<div>
			Profile
			<p>{user.email}</p>
		</div>
	);
};

export default Profile;
