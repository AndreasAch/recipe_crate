import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegClock, FaStar, FaUserFriends } from "react-icons/fa";
import type { Recipe } from "../types";
import defaultRecipeIcon from "../assets/defaultRecipeIcon.png";
import "../styles/RecipeCard.css";
import { motion, AnimatePresence } from "framer-motion";
import { HiDotsVertical, HiPencil, HiTrash, HiPlus, HiCheck } from "react-icons/hi";

interface RecipeCardProps {
	recipe: Recipe;
	onDelete: (id: number) => void;
	onRosterToggle?: (id: number) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onDelete, onRosterToggle }) => {
	const [showOptions, setShowOptions] = useState(false);
	const navigate = useNavigate();

	const handleToggleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setShowOptions(!showOptions);
	};

	const handleCardClick = () => {
		if (!showOptions) {
			navigate(`/recipe/${recipe.id}`);
		}
	};

	useEffect(() => {
		if (!showOptions) return;

		const closeMenu = () => setShowOptions(false);
		window.addEventListener("click", closeMenu);

		return () => window.removeEventListener("click", closeMenu);
	}, [showOptions]);

	const arcVariants = (
		angle: number,
		distance: number,
		delay: number,
		isActive: boolean,
		isDelete: boolean = false,
	) => ({
		hidden: {
			x: 0,
			y: 0,
			opacity: 0,
			scale: 0,
		},
		visible: {
			x: Math.cos(angle) * distance,
			y: Math.sin(angle) * distance,
			opacity: 1,
			scale: 1,
			backgroundColor: isDelete ? "#ff4757" : isActive ? "#2ecc71" : "#ffffff",
			color: isDelete ? "#ffffff" : isActive ? "#ffffff" : "#333333",
			boxShadow: "0px 5px 8px rgba(0, 0, 0, 0.5)",
			transition: {
				type: "spring" as const,
				stiffness: 300,
				damping: 22,
				delay: delay,
			},
		},
		exit: {
			x: 0,
			y: 0,
			opacity: 0,
			scale: 0,
			transition: { duration: 0.15 },
		},
	});

	const rosterPillVariants = {
		hidden: {
			x: 60,
			opacity: 0,
		},
		visible: {
			x: 0,
			opacity: 1,
			boxShadow: "0 2px 6px rgba(0, 0, 0, 0.395)",
			transition: {
				type: "spring" as const,
				stiffness: 260,
				damping: 20,
				delay: 0.15,
			},
		},
	};

	return (
		<div className="recipe-card" onClick={handleCardClick}>
			<AnimatePresence>
				{showOptions && (
					<motion.div
						className="local-card-vignette"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowOptions(false)}
					/>
				)}
			</AnimatePresence>

			<div className={recipe.image_url ? "card-image-wrapper" : "card-image-wrapper default"}>
				<img className="placeholder" src={recipe.image_url || defaultRecipeIcon} alt={recipe.title} />

				<button className={`menu-toggle ${showOptions ? "active" : ""}`} onClick={handleToggleClick}>
					<HiDotsVertical />
				</button>

				<AnimatePresence>
					{showOptions && (
						<motion.div className="arc-menu-container">
							<motion.button
								variants={arcVariants(Math.PI, 85, 0, false, true)}
								initial="hidden"
								animate="visible"
								exit="exit"
								whileHover={{ scale: 1.1, color: "#ffffff", backgroundColor: "#ff7b86" }}
								whileTap={{ scale: 0.95 }}
								className="arc-item"
								onClick={(e) => {
									e.stopPropagation();
									onDelete(recipe.id!);
								}}
							>
								<HiTrash size={20} />
							</motion.button>

							<motion.button
								variants={arcVariants(Math.PI / 1.3, 85, 0.06, false)}
								initial="hidden"
								animate="visible"
								exit="exit"
								whileHover={{ scale: 1.1, backgroundColor: "#f1f2f6" }}
								whileTap={{ scale: 0.95 }}
								className="arc-item"
								onClick={(e) => {
									e.stopPropagation();
									navigate(`/edit/${recipe.id}`);
								}}
							>
								<HiPencil size={20} />
							</motion.button>

							<motion.button
								variants={arcVariants(Math.PI / 1.9, 85, 0.12, !!recipe.in_roster)}
								initial="hidden"
								animate="visible"
								exit="exit"
								whileHover={{
									scale: 1.1,
									backgroundColor: recipe.in_roster ? "#27ae60" : "#f1f2f6",
								}}
								whileTap={{ scale: 0.95 }}
								className="arc-item"
								onClick={(e) => {
									e.stopPropagation();
									if (onRosterToggle && recipe.id) {
										onRosterToggle(recipe.id);
									}
								}}
							>
								{recipe.in_roster ? (
									<HiCheck size={20} strokeWidth={1.2} />
								) : (
									<HiPlus size={20} strokeWidth={1.2} />
								)}
							</motion.button>
						</motion.div>
					)}
				</AnimatePresence>

				<div className="rating-pill">
					<FaStar size={16} style={{ marginTop: "-3px" }} />
					<span>{recipe.rating || 0}</span>
				</div>

				<AnimatePresence>
					{recipe.in_roster && !showOptions && (
						<motion.div
							className="roster-pill"
							variants={rosterPillVariants}
							initial="hidden"
							exit="hidden"
							animate="visible"
							style={{
								position: "absolute",
								bottom: "10px",
								right: "15px",
								backgroundColor: "#2ecc71",
								color: "white",
								padding: "0",
								borderRadius: "12px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
								zIndex: 5,
							}}
						>
							<HiCheck size={25} strokeWidth={1.2} />
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<div className="card-content">
				<h3 className="recipe-title-card">{recipe.title}</h3>
					<hr style={{background: "#d4d4d481", border:"none", height:"1px", width: "100%", alignSelf: "center"}}/>
				<div className="recipe-stats-row">
					<div className="stat-group">
						<FaUserFriends size={18} />
						<span>{recipe.servings || 0} Servings</span>
					</div>
					<div className="stat-group">
						<FaRegClock size={16} />
						<span>{recipe.cooking_time_minutes} mins</span>
					</div>
				</div>
					<hr style={{background: "#d4d4d481", border:"none", height:"1px", width: "100%", alignSelf: "center"}}/>
				<div className="recipe-tags-container">
					{recipe.tags?.slice(0, 3).map((tag, index) => (
						<span key={index} className="tag-pill">
							{tag}
						</span>
					))}

					{recipe.tags && recipe.tags.length > 3 && (
						<span className="tag-more-indicator">+{recipe.tags.length - 3}</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default RecipeCard;
