// pages/info.js
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Info() {
	const router = useRouter();
	return (
		<div className="bg-gray-50">
			<Head>
				<title>Application Info</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="container mx-auto px-6 py-12">
				<h1 className="text-4xl md:text-6xl font-bold text-center text-gray-800">
					About <span className="text-blue-600">Diffusion TV</span>
				</h1>

				<div className="mt-8 text-gray-600 text-md max-w-2xl mx-auto text-center">
					<p>
						Hello! Diffusion TV is Tiktok for AI generated videos. It is a mobile first PWA application build with NextJS/Tailwind/Prisma inspired by short video platforms. This project was born out of a desire to stay on the cutting edge of AI video technology and to shine a light on the amazing work being done by many talented individuals. The best part is, its open source so everyone can learn how to build this themselves.
					</p>
					<br />
					<p>
						I am running this project purely out pocket. If you want to support the project give a ⭐ on GitHub and leave issues and feedback. More information can be found there. Thank you!
					</p>
					<br />
					<p>
						Disclaimer: The content in DiffusionTV based 100% on Civitais API. None of the content is scraped from their website in order to remain compliant to their Terms of Service. All content belongs to the respective owners.
					</p>
					{/* Add more paragraphs as needed */}
				</div>

				<div className="mt-12 flex justify-center">
					<Link href="https://github.com/shelbyt/diffusiontv">
						<a target="_blank" rel="noopener noreferrer" className="btn btn-primary">
							Support on GitHub
						</a>
					</Link>
				</div>

				<div className="mt-4 flex justify-center">
					<button
						onClick={() => router.push('/api/auth/logout')}
						className="btn btn-outline"
					>
						Logout
					</button>

				</div>
			</div>

			<footer className="border-t bg-white py-8">
				<div className="container mx-auto px-6 text-center text-gray-600">
					&copy; {new Date().getFullYear()} DiffusionTV. All rights reserved.
				</div>
			</footer>
		</div>
	);
}
