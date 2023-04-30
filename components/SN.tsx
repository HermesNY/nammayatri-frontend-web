import React, { useState } from "react";
import Link from "next/link";
import Cta from "./Cta";

const Navbar = () => {
	const [navbar, setNavbar] = useState(false);

	return (
		<nav className="w-full bg-zinc-900 shadow">
			<div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
				<div>
					<div className="flex items-center justify-between py-3 md:py-5 md:block">
						<img src="https://nammayatri.in/logos/nammaYatrilogo.svg"></img>

						<div className="md:hidden">
							<Cta />
							<button
								className="p-2 bg-zinc-900 text-gray-700 rounded-md outline-none"
								style={{ backgroundColor: "rgb(24,24,27)" }}
								onClick={() => setNavbar(!navbar)}
							>
								{navbar ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-6 h-6 bg-zinc-900 text-white"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-6 h-6 bg-zinc-900 text-white"
										background-color="zinc-900"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>
				<div>
					<div
						className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
							navbar ? "block" : "hidden"
						}`}
					>
						<ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
							<li className="text-white hover:text-yellow-500">
								<Link href="/">Home</Link>
							</li>
							<li className="text-white hover:text-yellow-500">
								<Link href="/aboutus">About US</Link>
							</li>
							<li className="text-white hover:text-yellow-500">
								<Link href="/reviews">Reviews</Link>
							</li>
							{/* <li className="text-white">
                  <Cta />
                </li> */}
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
