import { getLocationCoords } from "@/utils/location";
import React, { useEffect } from "react";

const Location = () => {
	const showLoc = async () => {
		const location = await getLocationCoords();
		console.log(location);
	};
	useEffect(() => {
		// getLocation();
		showLoc();
	}, []);
	return <div>Location</div>;
};

export default Location;
