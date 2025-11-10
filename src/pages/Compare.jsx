// src/pages/AHPAnalysis.jsx
import React, { useState, useEffect } from "react";
import {
	Trash2,
	Smartphone,
	DollarSign,
	Cpu,
	Battery,
	Monitor,
	Plus,
	ArrowRight,
	CheckCircle,
	Moon,
	Sun,
} from "lucide-react";

const AHPAnalysis = () => {
	const [step, setStep] = useState(1);

	useEffect(() => {
		const applyTheme = (isDark) => {
			if (isDark) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		};

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		applyTheme(mediaQuery.matches);

		const handleChange = (e) => applyTheme(e.matches);
		mediaQuery.addEventListener("change", handleChange);

		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	const [alternatives, setAlternatives] = useState([
		{
			id: 1,
			name: "",
			harga: "",
			performa: "",
			baterai: "",
			layar: "",
		},
	]);

	const [comparisons, setComparisons] = useState({});
	const [results, setResults] = useState(null);

	const criteriaInfo = {
		harga: {
			name: "Harga",
			icon: DollarSign,
			desc: "Biaya pembelian smartphone (dalam juta Rp)",
			color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
		},
		performa: {
			name: "Performa",
			icon: Cpu,
			desc: "Kecepatan dan kemampuan memproses data",
			color:
				"bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
		},
		baterai: {
			name: "Daya Tahan Baterai",
			icon: Battery,
			desc: "Kapasitas dan ketahanan baterai",
			color:
				"bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
		},
		layar: {
			name: "Kualitas Layar",
			icon: Monitor,
			desc: "Resolusi dan kualitas tampilan layar",
			color:
				"bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
		},
	};

	const comparisonScale = [
		{ value: 9, label: "Mutlak lebih penting" },
		{ value: 7, label: "Sangat lebih penting" },
		{ value: 5, label: "Lebih penting" },
		{ value: 3, label: "Sedikit lebih penting" },
		{ value: 1, label: "Sama penting" },
	];

	const addAlternative = () => {
		if (alternatives.length < 3) {
			setAlternatives([
				...alternatives,
				{
					id: alternatives.length + 1,
					name: "",
					harga: "",
					performa: "",
					baterai: "",
					layar: "",
				},
			]);
		}
	};

	const removeAlternative = (id) => {
		if (alternatives.length > 1) {
			setAlternatives(alternatives.filter((alt) => alt.id !== id));
		}
	};

	const updateAlternative = (id, field, value) => {
		setAlternatives(
			alternatives.map((alt) =>
				alt.id === id ? { ...alt, [field]: value } : alt
			)
		);
	};

	const isStepOneComplete = () => {
		const filledAlternatives = alternatives.filter(
			(alt) => alt.name && alt.harga && alt.performa && alt.baterai && alt.layar
		);
		return filledAlternatives.length >= 2;
	};

	const criteriaKeys = ["harga", "performa", "baterai", "layar"];

	const getPairwiseComparisons = () => {
		const pairs = [];
		for (let i = 0; i < criteriaKeys.length; i++) {
			for (let j = i + 1; j < criteriaKeys.length; j++) {
				pairs.push([criteriaKeys[i], criteriaKeys[j]]);
			}
		}
		return pairs;
	};

	const updateComparison = (c1, c2, value, direction) => {
		const key = `${c1}-${c2}`;
		setComparisons({
			...comparisons,
			[key]: { value: parseFloat(value), direction },
		});
	};

	const isStepTwoComplete = () => {
		const pairs = getPairwiseComparisons();
		return pairs.every(([c1, c2]) => comparisons[`${c1}-${c2}`]);
	};

	const calculateAHP = () => {
		const n = criteriaKeys.length;
		const matrix = Array(n)
			.fill(0)
			.map(() => Array(n).fill(1));

		// Build pairwise comparison matrix
		for (let i = 0; i < n; i++) {
			for (let j = i + 1; j < n; j++) {
				const key = `${criteriaKeys[i]}-${criteriaKeys[j]}`;
				const comp = comparisons[key];
				if (comp) {
					if (comp.direction === "left") {
						matrix[i][j] = comp.value;
						matrix[j][i] = 1 / comp.value;
					} else {
						matrix[i][j] = 1 / comp.value;
						matrix[j][i] = comp.value;
					}
				}
			}
		}

		// Calculate weights using geometric mean
		const weights = matrix.map((row) => {
			const product = row.reduce((acc, val) => acc * val, 1);
			return Math.pow(product, 1 / n);
		});

		const sumWeights = weights.reduce((a, b) => a + b, 0);
		const normalizedWeights = weights.map((w) => w / sumWeights);

		// Calculate scores for each alternative
		const scores = alternatives.map((alt) => {
			let score = 0;
			criteriaKeys.forEach((key, idx) => {
				// Normalize criteria values (inverse for harga - lower is better)
				const values = alternatives.map((a) => parseFloat(a[key]) || 0);
				const max = Math.max(...values);
				const min = Math.min(...values);

				let normalizedValue;
				if (key === "harga") {
					// For harga, lower is better, so we inverse it
					normalizedValue =
						max === min ? 1 : (max - parseFloat(alt[key])) / (max - min);
				} else {
					// For other criteria, higher is better
					normalizedValue =
						max === min ? 1 : (parseFloat(alt[key]) - min) / (max - min);
				}

				score += normalizedValue * normalizedWeights[idx];
			});
			return { ...alt, score };
		});

		scores.sort((a, b) => b.score - a.score);

		setResults({
			weights: normalizedWeights.map((w, i) => ({
				criteria: criteriaKeys[i],
				weight: w,
			})),
			ranking: scores,
		});
		setStep(3);
	};

	return (
		<div>
			<div className="min-h-screen bg-gradient-to-br from-sky-400 to-indigo-500 dark:from-gray-900 dark:to-gray-800 py-8 px-4 pt-28">
				<div className="max-w-6xl mx-auto">
					<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden relative">
						{/* Header */}
						<div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl mb-6 text-center shadow">
							<div className="flex items-center justify-center gap-3 mb-2">
								<Smartphone className="w-8 h-8 text-indigo-500" />
								<h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
									Analisis Pemilihan Smartphone
								</h1>
							</div>
							<p className="text-gray-600 dark:text-gray-300">
								Menggunakan Metode Analytical Hierarchy Process (AHP)
							</p>
						</div>

						{/* Progress Steps */}
						<div className="bg-gray-50 dark:bg-gray-800 px-6 py-4">
							<div className="flex items-center justify-center gap-4">
								{[
									{ num: 1, label: "Input Alternatif" },
									{ num: 2, label: "Perbandingan Kriteria" },
									{ num: 3, label: "Hasil" },
								].map((s, idx) => (
									<React.Fragment key={s.num}>
										<div className="flex items-center gap-2">
											<div
												className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
													step >= s.num
														? "bg-blue-600 text-white"
														: "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
												}`}
											>
												{s.num}
											</div>
											<span
												className={`hidden md:inline font-medium ${
													step >= s.num
														? "text-blue-600 dark:text-blue-300"
														: "text-gray-500 dark:text-gray-400"
												}`}
											>
												{s.label}
											</span>
										</div>
										{idx < 2 && (
											<ArrowRight className="w-5 h-5 text-gray-400" />
										)}
									</React.Fragment>
								))}
							</div>
						</div>

						{/* Step 1: Input Alternatives */}
						{step === 1 && (
							<div className="p-6 md:p-8">
								<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
									Input Alternatif Smartphone
								</h2>

								<div className="space-y-6">
									{alternatives.map((alt, index) => (
										<div
											key={alt.id}
											className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6 relative"
										>
											<div className="flex items-center justify-between mb-4">
												<div className="flex items-center gap-3">
													<div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center">
														<Smartphone className="w-6 h-6 text-blue-600" />
													</div>
													<h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
														Smartphone {index + 1}
													</h3>
												</div>
												{alternatives.length > 1 && (
													<button
														onClick={() => removeAlternative(alt.id)}
														className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
													>
														<Trash2 className="w-5 h-5 text-red-500" />
													</button>
												)}
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
														<Smartphone className="w-4 h-4" />
														Nama Smartphone
													</label>
													<input
														type="text"
														value={alt.name}
														onChange={(e) =>
															updateAlternative(alt.id, "name", e.target.value)
														}
														className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
														placeholder="Contoh: Samsung Galaxy S24"
													/>
												</div>

												<div>
													<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
														<DollarSign className="w-4 h-4" />
														Harga (juta Rp)
													</label>
													<input
														type="number"
														value={alt.harga}
														onChange={(e) =>
															updateAlternative(alt.id, "harga", e.target.value)
														}
														className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
														placeholder="Contoh: 8"
														step="0.1"
													/>
												</div>

												<div>
													<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
														<Cpu className="w-4 h-4" />
														Performa (1-10)
													</label>
													<input
														type="number"
														value={alt.performa}
														onChange={(e) =>
															updateAlternative(
																alt.id,
																"performa",
																e.target.value
															)
														}
														className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
														placeholder="Contoh: 5"
														min="1"
														max="10"
													/>
												</div>

												<div>
													<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
														<Battery className="w-4 h-4" />
														Daya Tahan Baterai (1-10)
													</label>
													<input
														type="number"
														value={alt.baterai}
														onChange={(e) =>
															updateAlternative(
																alt.id,
																"baterai",
																e.target.value
															)
														}
														className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
														placeholder="Contoh: 4"
														min="1"
														max="10"
													/>
												</div>

												<div className="md:col-span-2">
													<label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
														<Monitor className="w-4 h-4" />
														Kualitas Layar (1-10)
													</label>
													<input
														type="number"
														value={alt.layar}
														onChange={(e) =>
															updateAlternative(alt.id, "layar", e.target.value)
														}
														className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
														placeholder="Contoh: 5"
														min="1"
														max="10"
													/>
												</div>
											</div>

											{/* Completion Indicators */}
											<div className="flex flex-wrap gap-2 mt-4">
												{alt.name && (
													<span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium flex items-center gap-1">
														<CheckCircle className="w-3 h-3" /> Nama
													</span>
												)}
												{alt.harga && (
													<span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium flex items-center gap-1">
														<CheckCircle className="w-3 h-3" /> Harga
													</span>
												)}
												{alt.performa && (
													<span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium flex items-center gap-1">
														<CheckCircle className="w-3 h-3" /> Performa
													</span>
												)}
												{alt.baterai && (
													<span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium flex items-center gap-1">
														<CheckCircle className="w-3 h-3" /> Baterai
													</span>
												)}
												{alt.layar && (
													<span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium flex items-center gap-1">
														<CheckCircle className="w-3 h-3" /> Layar
													</span>
												)}
											</div>
										</div>
									))}
								</div>

								<div className="flex flex-col md:flex-row gap-4 mt-6">
									{alternatives.length < 3 && (
										<button
											onClick={addAlternative}
											className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
										>
											<Plus className="w-5 h-5" />
											Tambah Alternatif ({alternatives.length}/3)
										</button>
									)}

									<button
										onClick={() => setStep(2)}
										disabled={!isStepOneComplete()}
										className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
											isStepOneComplete()
												? "bg-blue-600 hover:bg-blue-700 text-white"
												: "bg-gray-300 text-gray-500 cursor-not-allowed"
										}`}
									>
										Lanjut ke Perbandingan
										<ArrowRight className="w-5 h-5" />
									</button>
								</div>
							</div>
						)}

						{/* Step 2: Pairwise Comparison */}
						{step === 2 && (
							<div className="p-6 md:p-8">
								<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
									Perbandingan Kriteria
								</h2>
								<p className="text-gray-600 dark:text-gray-300 mb-6">
									Tentukan prioritas antar kriteria dengan membandingkan setiap
									pasangan kriteria.
								</p>

								{/* Criteria Explanation */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
									{Object.entries(criteriaInfo).map(([key, info]) => {
										const Icon = info.icon;
										return (
											<div key={key} className={`${info.color} rounded-lg p-4`}>
												<div className="flex items-center gap-3 mb-2">
													<Icon className="w-5 h-5" />
													<h3 className="font-bold">{info.name}</h3>
												</div>
												<p className="text-sm opacity-90 dark:opacity-95">
													{info.desc}
												</p>
											</div>
										);
									})}
								</div>

								{/* Pairwise Comparisons */}
								<div className="space-y-6">
									{getPairwiseComparisons().map(([c1, c2]) => {
										const Icon1 = criteriaInfo[c1].icon;
										const Icon2 = criteriaInfo[c2].icon;
										const key = `${c1}-${c2}`;
										const current = comparisons[key];

										return (
											<div
												key={key}
												className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
											>
												<div className="flex items-center justify-between mb-4">
													<div className="flex items-center gap-2">
														<Icon1 className="w-5 h-5 text-blue-600" />
														<span className="font-bold text-gray-800 dark:text-gray-100">
															{criteriaInfo[c1].name}
														</span>
													</div>
													<span className="text-gray-400 dark:text-gray-300 font-medium">
														VS
													</span>
													<div className="flex items-center gap-2">
														<Icon2 className="w-5 h-5 text-indigo-600" />
														<span className="font-bold text-gray-800 dark:text-gray-100">
															{criteriaInfo[c2].name}
														</span>
													</div>
												</div>

												<div className="space-y-3">
													<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
														Manakah yang lebih penting?
													</label>

													<div className="grid grid-cols-2 gap-3">
														<button
															onClick={() =>
																updateComparison(
																	c1,
																	c2,
																	current?.direction === "left"
																		? current.value
																		: 1,
																	"left"
																)
															}
															className={`p-3 rounded-lg border-2 transition-all ${
																current?.direction === "left"
																	? "border-blue-600 bg-blue-50 dark:bg-blue-900"
																	: "border-gray-200 dark:border-gray-700 hover:border-gray-300"
															}`}
														>
															<Icon1 className="w-6 h-6 mx-auto text-blue-600 mb-1" />
															<span className="text-sm font-medium">
																{criteriaInfo[c1].name}
															</span>
														</button>

														<button
															onClick={() =>
																updateComparison(
																	c1,
																	c2,
																	current?.direction === "right"
																		? current.value
																		: 1,
																	"right"
																)
															}
															className={`p-3 rounded-lg border-2 transition-all ${
																current?.direction === "right"
																	? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900"
																	: "border-gray-200 dark:border-gray-700 hover:border-gray-300"
															}`}
														>
															<Icon2 className="w-6 h-6 mx-auto text-indigo-600 mb-1" />
															<span className="text-sm font-medium">
																{criteriaInfo[c2].name}
															</span>
														</button>
													</div>

													{current && (
														<div>
															<label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
																Seberapa penting?
															</label>
															<select
																value={current.value}
																onChange={(e) =>
																	updateComparison(
																		c1,
																		c2,
																		e.target.value,
																		current.direction
																	)
																}
																className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
															>
																{comparisonScale.map((scale) => (
																	<option key={scale.value} value={scale.value}>
																		{scale.label}
																	</option>
																))}
															</select>
														</div>
													)}
												</div>
											</div>
										);
									})}
								</div>

								<div className="flex gap-4 mt-6">
									<button
										onClick={() => setStep(1)}
										className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
									>
										Kembali
									</button>

									<button
										onClick={calculateAHP}
										disabled={!isStepTwoComplete()}
										className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
											isStepTwoComplete()
												? "bg-blue-600 hover:bg-blue-700 text-white"
												: "bg-gray-300 text-gray-500 cursor-not-allowed"
										}`}
									>
										Lihat Hasil
										<ArrowRight className="w-5 h-5" />
									</button>
								</div>
							</div>
						)}

						{/* Step 3: Results */}
						{step === 3 && results && (
							<div className="p-6 md:p-8">
								<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
									Hasil Analisis AHP
								</h2>

								{/* Criteria Weights */}
								<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 rounded-xl p-6 mb-6">
									<h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
										Bobot Kriteria
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{results.weights.map((w) => {
											const Icon = criteriaInfo[w.criteria].icon;
											return (
												<div
													key={w.criteria}
													className="bg-white dark:bg-gray-900 rounded-lg p-4"
												>
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-2">
															<Icon className="w-5 h-5 text-blue-600" />
															<span className="font-medium text-gray-800 dark:text-gray-100">
																{criteriaInfo[w.criteria].name}
															</span>
														</div>
														<span className="text-xl font-bold text-blue-600">
															{(w.weight * 100).toFixed(1)}%
														</span>
													</div>
													<div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
														<div
															className="bg-blue-600 h-full rounded-full transition-all"
															style={{ width: `${w.weight * 100}%` }}
														/>
													</div>
												</div>
											);
										})}
									</div>
								</div>

								{/* Ranking */}
								<div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700">
									<div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 p-6 border-b-2 border-gray-200 dark:border-gray-700">
										<h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
											Peringkat Smartphone Terbaik
										</h3>
									</div>

									<div className="divide-y divide-gray-200 dark:divide-gray-700">
										{results.ranking.map((alt, index) => (
											<div
												key={alt.id}
												className={`p-6 ${
													index === 0
														? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-gray-800"
														: ""
												}`}
											>
												<div className="flex items-center gap-4">
													<div
														className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
															index === 0
																? "bg-yellow-400 text-yellow-900"
																: index === 1
																? "bg-gray-300 text-gray-700"
																: "bg-orange-300 text-orange-900"
														}`}
													>
														{index + 1}
													</div>

													<div className="flex-1">
														<h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
															{alt.name}
														</h4>
														<div className="flex flex-wrap gap-2 text-sm text-gray-700 dark:text-gray-300">
															<span className="flex items-center gap-1">
																<DollarSign className="w-4 h-4" />
																Rp {alt.harga} jt
															</span>
															<span className="flex items-center gap-1">
																<Cpu className="w-4 h-4" />
																Performa: {alt.performa}
															</span>
															<span className="flex items-center gap-1">
																<Battery className="w-4 h-4" />
																Baterai: {alt.baterai}
															</span>
															<span className="flex items-center gap-1">
																<Monitor className="w-4 h-4" />
																Layar: {alt.layar}
															</span>
														</div>
													</div>

													<div className="text-right">
														<div className="text-2xl font-bold text-blue-600">
															{(alt.score * 100).toFixed(1)}
														</div>
														<div className="text-sm text-gray-500 dark:text-gray-400">
															Skor
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>

								<button
									onClick={() => {
										setStep(1);
										setComparisons({});
										setResults(null);
									}}
									className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
								>
									Mulai Analisis Baru
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AHPAnalysis;