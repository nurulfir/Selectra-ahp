import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AHPAnalysis from "./pages/Compare";
import ClickSpark from "./components/ClickSpark";

function App() {
	return (
		<BrowserRouter>
			<ClickSpark
				sparkColor="#fff"
				sparkSize={10}
				sparkRadius={15}
				sparkCount={8}
				duration={400}
			>
				<div className="min-h-screen bg-gray-50">
					<Navbar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/analisis" element={<AHPAnalysis />} />
					</Routes>
				</div>
			</ClickSpark>
		</BrowserRouter>
	);
}

export default App;
