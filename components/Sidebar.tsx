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
			className={`flex flex-col space-y-4 p-4 bg-gray-800 text-white w-full md:w-64 flex-shrink-0 ${
				isOpen ? "block" : "hidden"
			} md:flex`}
		>
			<Link href="/dashboard">
				<h2 className=" hidden md:block text-xl font-bold ">
					NammaYatri
				</h2>
			</Link>
			<Link href="/profile">
				<h2 className="font-bold">Profile</h2>
				{/* <p>{user?.email}</p> */}
			</Link>
			<Link href="/dashboard">Book Now</Link>
			<Link href="/rides">Rides</Link>
			<button
				className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600  align-bottom w-fit"
				onClick={handleLogout}
			>
				Logout
			</button>

			<button
				className="bg-transparent hover:opacity-75 hover:bg-inherit absolute top-0 right-0 p-4 text-white focus:outline-none md:hidden"
				onClick={onClose}
			>
				<AiOutlineClose />
			</button>
		</div>
	);
}
