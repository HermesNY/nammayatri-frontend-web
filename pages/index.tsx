import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import StaticNavbar from "@/components/StaticNavbar";
import app from "../config/firebase";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<>
			<StaticNavbar />
			<nav>
				<Link href="/dashboard">Dashboard</Link>
			</nav>
			<main
				className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
			>
				{/* <MapComponent /> */}
				<button>Hello</button>
			</main>
		</>
	);
}
