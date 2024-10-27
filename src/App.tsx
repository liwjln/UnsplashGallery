// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PhotoList from "./pages/PhotoList";
import PhotoDetail from "./pages/PhotoDetails";

const App: React.FC = () => {
	return (
		<Router>
			<div className="app">
				<Routes>
					<Route path="/" element={<Navigate to="/photos" />} />
					<Route path="/photos" element={<PhotoList />} />
					<Route path="/photos/:id" element={<PhotoDetail />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
