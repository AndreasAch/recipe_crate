/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import groceryFallback from "../assets/grocery.png";

interface Props {
	name: string;
	size?: number;
}

const IngredientIcon: React.FC<Props> = ({ name, size = 50 }) => {
	const [imgStatus, setImgStatus] = useState<"loading" | "success" | "error">("loading");

	const cleanName = name.trim().toLowerCase();
	const mealDbUrl = `https://www.themealdb.com/images/ingredients/${encodeURIComponent(cleanName)}.png`;

	useEffect(() => {
		if (!name.trim()) {
			setImgStatus("error");
			return;
		}

		setImgStatus("loading");
		const img = new Image();
		img.src = mealDbUrl;

		img.onload = () => {
			setImgStatus("success");
		};

		img.onerror = () => {
			setImgStatus("error");
		};

		return () => {
			img.onload = null;
			img.onerror = null;
		};
	}, [name, mealDbUrl]);

	return (
		<div
			className="ingredient-icon-wrapper"
			style={{
				width: size,
				height: size,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				overflow: "hidden",
				backgroundColor: "#f8f9fa",
				borderRadius: "12px",
				position: "relative",
			}}
		>
			<AnimatePresence mode="wait">
				{imgStatus === "success" ? (
					<motion.img
						key={`success-${cleanName}`}
						src={mealDbUrl}
						alt={name}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						style={{
							width: "90%",
							height: "90%",
							objectFit: "contain",
							zIndex: 2,
						}}
					/>
				) : (
					<motion.img
						key="fallback"
						src={groceryFallback}
						alt="Placeholder"
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.6 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						style={{
							width: "70%",
							height: "70%",
							objectFit: "contain",
							zIndex: 1,
						}}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};

export default IngredientIcon;
