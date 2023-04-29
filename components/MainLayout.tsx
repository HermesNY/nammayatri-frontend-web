import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const handleSidebarClose = () => {
		setSidebarOpen(false);
	};

	return (
		<div className="flex flex-col h-screen">
			<div className="flex items-center justify-between bg-gray-800 text-white p-4 md:hidden">
				<button
					className="text-white focus:outline-none"
					onClick={() => setSidebarOpen(true)}
				>
					<svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"
						/>
					</svg>
				</button>
			</div>
			<div className="flex-1 flex flex-col md:flex-row">
				<Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
				<div className="flex-1 flex flex-col">{children}</div>
			</div>
		</div>
	);
}
