import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import "firebase/auth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "@/config/firebase";
import Link from "next/link";
import { useUser } from "@/utils/auth";
import StaticNavbar from "@/components/StaticNavbar";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const router = useRouter();

	const { user, loading } = useUser();

	const handleLogin = async (e: any) => {
		e.preventDefault();
		const auth = getAuth(app);
		try {
			await signInWithEmailAndPassword(auth, email, password);
			router.push("/dashboard");
		} catch (error: any) {
			setError(error.message);
		}
	};

	if (user) {
		router.push("/dashboard");
		return;
	}

	return (
		<div className="min-h-screen flex flex-col ">
			<StaticNavbar />
			<div className="flex flex-1 min-h-full items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8">
					<div>
						<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
							Log in to your account
						</h2>
					</div>
					<form className="mt-8 space-y-6" onSubmit={handleLogin}>
						{error && <p className="text-red-500">{error}</p>}
						<input type="hidden" name="remember" value="true" />
						<div className="rounded-md shadow-sm -space-y-px">
							<div>
								<label
									htmlFor="email-address"
									className="sr-only"
								>
									Email address
								</label>
								<input
									id="email-address"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
									placeholder="Email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div>
								<label htmlFor="password" className="sr-only">
									Password
								</label>
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
									placeholder="Password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Log in
							</button>
						</div>

						<div className="flex items-center justify-end">
							<div className="text-sm">
								<span>Don&apos;t have an account? </span>
								<Link
									href="/register"
									className="font-medium text-indigo-600 hover:text-indigo-500"
								>
									Register
								</Link>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
