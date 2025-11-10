// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
	ArrowRight,
	Target,
	BarChart3,
	CheckCircle,
	Smartphone,
	Zap,
} from "lucide-react";
import LightRays from "@/components/LightRays";
import SpotlightCard from "@/components/SpotlightCard";

const Home = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);

	// Deteksi otomatis tema dari sistem
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		setIsDarkMode(mediaQuery.matches);

		const handleChange = (e) => setIsDarkMode(e.matches);
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	// Tambahkan class dark ke html root
	useEffect(() => {
		const root = document.documentElement;
		if (isDarkMode) root.classList.add("dark");
		else root.classList.remove("dark");
	}, [isDarkMode]);

	const handleScroll = (id) => {
		setIsLoading(true);
		setTimeout(() => {
			document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
			setIsLoading(false);
		}, 1000);
	};

	const features = [
		{
			icon: Target,
			title: "Analisis Terstruktur",
			description:
				"Menggunakan metode AHP yang tervalidasi secara ilmiah untuk pengambilan keputusan",
		},
		{
			icon: BarChart3,
			title: "Perbandingan Objektif",
			description:
				"Bandingkan hingga 3 smartphone berdasarkan kriteria yang Anda tentukan",
		},
		{
			icon: CheckCircle,
			title: "Hasil Akurat",
			description:
				"Dapatkan rekomendasi smartphone terbaik dengan skor terukur",
		},
	];

	const criteria = [
		{ icon: "💰", name: "Harga", desc: "Budget pembelian" },
		{ icon: "⚡", name: "Performa", desc: "Kecepatan prosesor" },
		{ icon: "🔋", name: "Baterai", desc: "Daya tahan baterai" },
		{ icon: "📱", name: "Layar", desc: "Kualitas display" },
	];

	const steps = [
		{
			number: "01",
			title: "Input Alternatif",
			description:
				"Masukkan data smartphone yang ingin Anda bandingkan beserta nilai kriterianya",
		},
		{
			number: "02",
			title: "Tentukan Prioritas",
			description:
				"Bandingkan setiap kriteria untuk menentukan mana yang lebih penting bagi Anda",
		},
		{
			number: "03",
			title: "Lihat Hasil",
			description:
				"Sistem akan menghitung dan menampilkan smartphone terbaik berdasarkan preferensi Anda",
		},
	];

	const fadeInUp = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 },
	};

	return (
		<div className="min-h-screen text-gray-800 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black dark:text-gray-100 relative overflow-hidden">
			{/* Loading Overlay */}
			{isLoading && (
				<div className="fixed inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
					<div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
				</div>
			)}

			{/* Hero Section */}
			<section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
				{/* LightRays Background */}
				<div className="absolute inset-0 opacity-50 dark:opacity-80">
					<LightRays
						raysOrigin="top-center"
						raysColor={isDarkMode ? "#60a5fa" : "#3b82f6"}
						raysSpeed={0.8}
						lightSpread={1.5}
						rayLength={2}
						pulsating={false}
						followMouse={true}
						mouseInfluence={0.15}
						fadeDistance={1.2}
						saturation={0.8}
					/>
				</div>

				<motion.div
					variants={fadeInUp}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true }}
					className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32"
				>
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
								🎯 Sistem Pendukung Keputusan
							</div>
							<h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
								Temukan Smartphone
								<span className="block bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
									Terbaik untuk Anda
								</span>
							</h1>
							<p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
								Gunakan metode Analytical Hierarchy Process (AHP) untuk membuat
								keputusan pembelian smartphone yang tepat berdasarkan prioritas
								Anda.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Link
									to="/analisis"
									className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold text-lg hover:scale-105 transition-all shadow-lg hover:shadow-2xl"
								>
									Mulai Analisis
									<ArrowRight className="w-5 h-5" />
								</Link>
								<button
									onClick={() => handleScroll("cara-kerja")}
									className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-300 dark:border-gray-600"
								>
									Pelajari Lebih Lanjut
								</button>
							</div>
						</div>

						<div className="hidden md:block">
							<div className="relative h-[400px] md:h-[480px] lg:h-[520px]">
								<div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-indigo-300 dark:from-blue-800 dark:to-indigo-800 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
								<div className="relative h-full bg-white dark:bg-gray-900 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-2xl flex justify-center items-center">
									<img
										src="/images/phone.png"
										alt="Phone"
										className="w-64 h-auto drop-shadow-[0_0_30px_rgba(0,0,0,0.1)] transition-transform duration-500 hover:scale-105"
									/>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</section>

			{/* Features */}
			<motion.section
				variants={fadeInUp}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true }}
				className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
							Mengapa Menggunakan Selectra ?
						</h2>
						<p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
							Sistem kami membantu Anda membuat keputusan yang lebih baik dengan
							pendekatan ilmiah
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{features.map((feature, index) => {
							const Icon = feature.icon;
							return (
								<motion.div
									key={index}
									variants={fadeInUp}
									initial="hidden"
									whileInView="show"
									transition={{ delay: index * 0.2 }}
									viewport={{ once: true }}
								>
									<SpotlightCard
										spotlightColor={
											isDarkMode
												? "rgba(96, 165, 250, 0.25)" // biru lembut untuk dark mode
												: "rgba(37, 99, 235, 0.25)" // biru terang untuk light mode
										}
										className={`
            p-8 rounded-2xl transition-all duration-300 hover:scale-[1.03]
            ${
							isDarkMode
								? "bg-gray-900/60 border border-gray-700 hover:bg-gray-900/80"
								: "bg-white border border-gray-200 hover:bg-gray-100"
						}
          `}
									>
										<div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
											<Icon className="w-7 h-7 text-white" />
										</div>
										<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
											{feature.title}
										</h3>
										<p className="text-gray-600 dark:text-gray-400">
											{feature.description}
										</p>
									</SpotlightCard>
								</motion.div>
							);
						})}
					</div>
				</div>
			</motion.section>

			{/* Criteria */}
			<motion.section
				variants={fadeInUp}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true }}
				className="py-20 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
							Kriteria Penilaian
						</h2>
						<p className="text-lg text-gray-500 dark:text-gray-400">
							Evaluasi smartphone berdasarkan 4 kriteria utama
						</p>
					</div>

					<div className="grid md:grid-cols-4 gap-6">
						{criteria.map((item, index) => (
							<motion.div
								key={index}
								variants={fadeInUp}
								initial="hidden"
								whileInView="show"
								transition={{ delay: index * 0.2 }}
								className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
							>
								<div className="text-5xl mb-4">{item.icon}</div>
								<h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
									{item.name}
								</h3>
								<p className="text-gray-600 dark:text-gray-400 text-sm">
									{item.desc}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</motion.section>

			{/* How It Works */}
			<motion.section
				id="cara-kerja"
				variants={fadeInUp}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true }}
				className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
							Cara Kerja Sistem
						</h2>
						<p className="text-lg text-gray-500 dark:text-gray-400">
							Proses analisis yang sederhana dan efektif
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{steps.map((step, index) => (
							<motion.div
								key={index}
								variants={fadeInUp}
								initial="hidden"
								whileInView="show"
								transition={{ delay: index * 0.2 }}
								className="relative"
							>
								<div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-8 text-white h-full">
									<div className="text-6xl font-bold text-white/40 mb-4">
										{step.number}
									</div>
									<h3 className="text-2xl font-bold mb-4">{step.title}</h3>
									<p className="text-blue-100">{step.description}</p>
								</div>
								{index < steps.length - 1 && (
									<div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
										<ArrowRight className="w-8 h-8 text-blue-400" />
									</div>
								)}
							</motion.div>
						))}
					</div>
				</div>
			</motion.section>

			{/* CTA */}
			<motion.section
				variants={fadeInUp}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true }}
				className="py-20 bg-gradient-to-r from-blue-100 via-white to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
			>
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<Zap className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
						Siap Menemukan Smartphone Impian Anda?
					</h2>
					<p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
						Mulai analisis sekarang dan dapatkan rekomendasi smartphone terbaik
						dalam hitungan menit!
					</p>
					<Link
						to="/analisis"
						className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold text-lg hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
					>
						Mulai Sekarang
						<ArrowRight className="w-5 h-5" />
					</Link>
				</div>
			</motion.section>

			{/* Footer */}
			<footer className="bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black text-gray-600 dark:text-gray-400 py-12 border-t border-gray-200 dark:border-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid md:grid-cols-3 gap-8 mb-8">
						<div>
							<div className="flex items-center gap-2 mb-4">
								<Smartphone className="w-8 h-8 text-blue-500" />
								<span className="text-xl font-bold text-gray-900 dark:text-white">
									Selectra
								</span>
							</div>
							<p>
								Sistem pendukung keputusan berbasis AHP untuk pemilihan
								smartphone terbaik.
							</p>
						</div>
						<div>
							<h3 className="font-bold text-gray-900 dark:text-white mb-4">
								Navigasi
							</h3>
							<ul className="space-y-2">
								<li>
									<Link
										to="/"
										className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
									>
										Beranda
									</Link>
								</li>
								<li>
									<Link
										to="/analisis"
										className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
									>
										Analisis AHP
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-bold text-gray-900 dark:text-white mb-4">
								Tentang Metode
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								AHP (Analytical Hierarchy Process) adalah metode pengambilan
								keputusan multi-kriteria yang dikembangkan oleh Thomas L. Saaty.
							</p>
						</div>
					</div>
					<div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-gray-500 dark:text-gray-500">
						<p>&copy; 2025 Selectra. Sistem Pemilihan Smartphone Terbaik.</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Home;
