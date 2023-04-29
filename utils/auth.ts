import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import app from "@/config/firebase";

export const useUser :() => {user:User, loading:boolean}|{user:null, loading:boolean} = () => {
	const [user, setUser]: [User | null, any] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const auth = getAuth(app);
	let unsubscribe;
	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps
		unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);

			//   if (user) {
			//     router.replace('/dashboard');
			//   }
		});

		return unsubscribe;
	}, [router]);

	return { user, loading };
};
