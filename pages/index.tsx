import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import StaticNavbar from "@/components/StaticNavbar";
import app from "../config/firebase";
import Cta from "@/components/Cta";
import Navbar from "@/components/SN";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<>
			<div className="w-full h-screen bg-zinc-900 shadow">
				<Navbar />

				{/* Static information bar */}
				<div className="w-full px-9 text-slate-200 py-4 bg-zinc-950 shadow">
					{/* Static information contents */} 1,32,123 Drivers
					{/* <link className="absolute right-10" ref={"https://nammayatri.in/open/</div>"}>
            Open Data
        </link> */}
					<a
						className="right-10 absolute text-white hover:bg-white hover:text-zinc-900 hover:font-semibold rounded"
						href="https://nammayatri.in/open/"
					>
						Open Data
					</a>
				</div>

				{/* Main content */}
				<main>
					{/* Heading */}
					<div className="mx-9 mt-14 mb-10">
						<h1 className="text-6xl text-white">
							Book an auto with{" "}
						</h1>
						<h1 className="font-bold text-6xl text-yellow-400">
							Zero Commission
						</h1>
					</div>
					{/* Subheading */}
					<h2 className="text-2xl px-9 text-white mb-10">
						App by the drivers for the people.<br></br>100% direct
						payment to drivers.
					</h2>
					{/* Call to action button */}
					<Link href="/dashboard" className="	mx-9 my-14">
						<Cta />
					</Link>
					{/* Image */}
					<img
						className="hidden md:block absolute bottom-0 right-10 z-10 max-w-sm max-h-sm"
						style={{ height: "75vh" }}
						src={"https://nammayatri.in/img/autoDriverWeb.png"}
						alt="My Image"
					/>
				</main>
			</div>
		</>
	);
}
