import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiTrash } from "react-icons/hi";
import type { Recipe } from "../types";
import defaultRecipeIcon from "../assets/defaultRecipeIcon.png";
import "../styles/RosterFloatingButton.css";
import { BiSolidFoodMenu } from "react-icons/bi";
import GroceryListModal from "./GroceryListModal";

interface RosterFloatingButtonProps {
	rosterRecipes: Recipe[];
	onRemoveFromRoster: (id: number) => void;
}

const RosterFloatingButton: React.FC<RosterFloatingButtonProps> = ({ rosterRecipes, onRemoveFromRoster }) => {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();
	const [isGroceryOpen, setIsGroceryOpen] = useState(false);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (rosterRecipes.length === 0) {
		if (isOpen) setIsOpen(false);
		return null;
	}

	return (
		<>
			<motion.div
				className="roster-fab-container"
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
			>
				<button className="roster-fab" onClick={() => setIsOpen(true)}>
					<BiSolidFoodMenu size={30} />
					<span className="roster-badge">{rosterRecipes.length}</span>
				</button>
			</motion.div>

			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							className="roster-overlay-blur"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsOpen(false)}
						/>
						<motion.div
							className="roster-popup"
							initial={{ x: -100, opacity: 0, scale: 0.9 }}
							animate={{ x: 0, opacity: 1, scale: 1 }}
							exit={{ x: -100, opacity: 0, scale: 0.9 }}
						>
							<div className="roster-popup-header">
								<h3>Current Roster</h3>
							</div>

							<div className="roster-popup-list">
								<AnimatePresence initial={false}>
									{rosterRecipes.map((recipe) => (
										<motion.div
											key={recipe.id}
											layout
											initial={{ x: -20, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											exit={{
												x: 100,
												opacity: 0,
												scale: 0.9,
												transition: { duration: 0.2 },
											}}
											className="roster-item-row"
											onClick={() => navigate(`/recipe/${recipe.id}`)}
										>
											<img
												src={recipe.image_url || defaultRecipeIcon}
												alt={recipe.title}
												className={
													recipe.image_url
														? "roster-item-thumb"
														: "roster-item-thumb default"
												}
											/>
											<div className="roster-item-name-pill">{recipe.title}</div>
											<button
												className="roster-item-delete"
												onClick={(e) => {
													e.stopPropagation();
													onRemoveFromRoster(recipe.id!);
												}}
											>
												<HiTrash />
											</button>
										</motion.div>
									))}
								</AnimatePresence>

								{rosterRecipes.length === 0 && (
									<motion.p
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										style={{ textAlign: "center", color: "#999", marginTop: "20px" }}
									>
										Roster is empty
									</motion.p>
								)}
							</div>

							<div className="roster-popup-footer">
								<hr className="footer-divider" />
								<button
									className="generate-grocery-btn"
									onClick={() => {
										setIsGroceryOpen(true);
									}}
								>
									Generate Grocery List
								</button>

								<GroceryListModal
									isOpen={isGroceryOpen}
									onClose={() => setIsGroceryOpen(false)}
									recipes={rosterRecipes}
								/>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

export default RosterFloatingButton;
