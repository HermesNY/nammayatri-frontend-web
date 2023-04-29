type Coords = {
    lat: Number,
    lng: Number
}

export const getLocationCoords: () => Promise<Coords> = () => {
	return new Promise((resolve, reject) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				resolve({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
			});
		} else {
			reject("Geolocation is not supported by this browser.");
		}
	});
};
