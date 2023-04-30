import { useState } from "react";
import Sidebar from "./Sidebar";
import { AiOutlineMenu } from "react-icons/ai";

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
					<AiOutlineMenu />
				</button>
			</div>
			<div className="flex-1 flex flex-col md:flex-row">
				<Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
				<div className="flex-1 flex flex-col">{children}</div>
			</div>
		</div>
	);
}
