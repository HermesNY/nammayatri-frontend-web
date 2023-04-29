import Image from "next/image";
import Link from "next/link";
import React from "react";

const StaticNavbar = () => {
	return (
		<>
			<nav className="bg-white border-gray-200 dark:bg-gray-900">
				<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
					<Link href="" className="flex items-center">
						<Image
							width={80}
							height={40}
							src="nammaYatrilogo.svg"
							className="mr-1"
							alt="Flowbite Logo"
						/>
						<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
							NammaYatri
						</span>
					</Link>
					<button
						data-collapse-toggle="navbar-default"
						type="button"
						className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
						aria-controls="navbar-default"
						aria-expanded="false"
					>
						<span className="sr-only">Open main menu</span>
						<svg
							className="w-6 h-6"
							aria-hidden="true"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
								clip-rule="evenodd"
							></path>
						</svg>
					</button>
					<div
						className="hidden w-full md:block md:w-auto"
						id="navbar-default"
					>
						<ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
							<Link href="/">Home</Link>
							<Link href="/profile">Profile</Link>
							<Link href="/login">Login</Link>
							<Link href="/map">Map</Link>
							<Link href="/dashboard">Dashboard</Link>
						</ul>
					</div>
				</div>
			</nav>

			{/* <nav>
				<h1>NammaYatri</h1>

				<div className="links flex space-x-3 justify-center">
					<Link href="/">Home</Link>
					<Link href="/about">About</Link>
					<Link href="/location">Location</Link>
					<Link href="/map">Map</Link>
					<Link href="/dashboard">Dashboard</Link>
				</div>
			</nav> */}
		</>
	);
};

export default StaticNavbar;
