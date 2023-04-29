import Navbar from "@/components/Navbar";
import { useAuth } from "@/utils/auth";
import React from "react";

const DLayout = (props: { children: React.ReactElement }) => {
	// const { user, loading } = useAuth();
	return (
		<>
			<Navbar />

			{props.children}

			<footer className="flex justify-center items-center h-16 bg-black text-white">
				<p className="text-center">
					Made with ❤️ by Team Hermes for NammaYatri
				</p>
			</footer>
		</>
	);
};

export default DLayout;
