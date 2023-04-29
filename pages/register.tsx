import StaticNavbar from "@/components/StaticNavbar";
import app from "@/config/firebase";
import {
	User,
	createUserWithEmailAndPassword,
	getAuth,
	onAuthStateChanged,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const RegisterPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const auth = getAuth(app);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				router.replace("/dashboard");
			}
		});

		return unsubscribe;
	}, [router]);

	const handleRegister = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			await createUserWithEmailAndPassword(auth, email, password);
			router.push("/dashboard");
		} catch (error: any) {
			setError(error?.message);
		}

		setLoading(false);
	};

	return (
		<div className="min-h-screen flex flex-col">
			<StaticNavbar />
			<div className=" flex-1  flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full space-y-8">
					<div>
						<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
							Create a new account
						</h2>
					</div>
					<form className="mt-8 space-y-6" onSubmit={handleRegister}>
						{error && <p className="text-red-500">{error}</p>}
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
								disabled={loading}
							>
								{loading && (
									<span className="absolute left-0 inset-y-0 flex items-center pl-3">
										<svg
											className="animate-spin h-5 w-5 text-indigo-500"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20a8 8 0 01-8-8H0c0 6.627 5.373 12 12 12v-4zm5-5.291a7.962 7.962 0 01-3 2.647A7.962 7.962 0 0112 20v-4c1.865 0 3.585-.641 4.938-1.713l-3-2.647z"
											></path>
										</svg>
									</span>
								)}
								Register
							</button>
						</div>

						<div className="flex items-center justify-end">
							<div className="text-sm">
								<span>Already have an account? </span>
								<Link
									href="/login"
									className="font-medium text-indigo-600 hover:text-indigo-500"
								>
									Login
								</Link>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
