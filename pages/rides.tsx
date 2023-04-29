import { useUser } from "@/utils/auth";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import app from "@/config/firebase";
import Layout from "@/components/MainLayout";

const auth = getAuth(app);

export default function Rides() {
	const { user, loading } = useUser();
	const router = useRouter();

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!user) {
		router.replace("/login");
		return null;
	}

	const handleLogout = async () => {
		try {
			await auth.signOut();
			router.replace("/login");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Layout>
			<div className="p-4">
				<h2 className="text-lg font-bold mb-2">Rides</h2>
				<p>No rides yet.</p>
				<button
					className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-4"
					onClick={handleLogout}
				>
					Logout
				</button>
			</div>
		</Layout>
	);
}
