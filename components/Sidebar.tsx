import Link from "next/link";
import { AiOutlineClose } from "react-icons/ai";
import { useUser } from "@/utils/auth";
import { getAuth } from "firebase/auth";
import app from "@/config/firebase";
import { useRouter } from "next/router";

const auth = getAuth(app);
type SidebarProps = {
	isOpen: boolean;
	onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
	const { user, loading } = useUser();

	const router = useRouter();

	if (!loading && user == null) {
		alert("Please login first");
		router.push("/login");
	}

	const handleLogout = async () => {
		try {
			await auth.signOut();
			onClose();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div
			className={`flex flex-col bg-gray-800 text-white w-full md:w-64 flex-shrink-0 ${
				isOpen ? "block" : "hidden"
			} md:block`}
		>
			<Link href="/profile" className="p-4">
				<h2 className="text-lg font-bold mb-2">Profile</h2>
				<p>{user?.email}</p>
			</Link>
			<Link href="/dashboard" className="p-4">
				Book Now
			</Link>
			<Link href="/rides" className="p-4">
				Rides
			</Link>
			<div className="p-4">
				<button
					className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 "
					onClick={handleLogout}
				>
					Logout
				</button>
			</div>
			<button
				className="absolute top-0 right-0 p-4 text-white focus:outline-none"
				onClick={onClose}
			>
				<AiOutlineClose />
			</button>
		</div>
	);
}
