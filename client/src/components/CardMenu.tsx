import React from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiPencil, HiTrash, HiPlus, HiCheck } from "react-icons/hi";
import "../styles/RecipeCard.css";
import { Link } from "react-router-dom";

interface RecipeCardMenuProps {
	isOpen: boolean;
	onClose: () => void;
	anchorRect: DOMRect | null;
	inRoster: boolean;
	onRosterToggle: () => void;
	onDelete: () => void;
    recipeId: number;
}

const RecipeCardMenu: React.FC<RecipeCardMenuProps> = ({
	isOpen,
	onClose,
	anchorRect,
	inRoster,
	onRosterToggle,
	onDelete,
	recipeId,
}) => {
	if (!anchorRect) return null;

	const top = anchorRect.top + anchorRect.height / 2;
	const left = anchorRect.left + anchorRect.width / 2;

	const itemVariants = (angle: number, distance: number) => ({
		hidden: { x: 0, y: 0, opacity: 0, scale: 0 },
		visible: {
			x: Math.cos(angle) * distance,
			y: Math.sin(angle) * distance,
			opacity: 1,
			scale: 1,
			transition: { type: "spring" as const, stiffness: 300, damping: 20 },
		},
	});

	return ReactDOM.createPortal(
		<AnimatePresence>
			{isOpen && (
				<div className="menu-portal-container" style={{ position: "absolute", top, left, zIndex: 9999 }}>
					<motion.div
						className="local-vignette"
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>

					<motion.div initial="hidden" animate="visible" exit="hidden">
						<motion.button
							variants={itemVariants(Math.PI / 2, 70)}
							className={`menu-item ${inRoster ? "active" : ""}`}
							onClick={() => {
								onRosterToggle();
								onClose();
							}}
						>
							{inRoster ? <HiCheck /> : <HiPlus />}
						</motion.button>

						<motion.div 
                            variants={itemVariants(Math.PI, 70)} 
                            className="menu-item">
							<Link to={`/edit/${recipeId}`}>
								<HiPencil />
							</Link>
						</motion.div>
						
						<motion.button
							variants={itemVariants(-Math.PI / 2, 70)}
							className="menu-item delete"
							onClick={() => {
								onDelete();
								onClose();
							}}
						>
							<HiTrash />
						</motion.button>
					</motion.div>
				</div>
			)}
		</AnimatePresence>,
		document.body,
	);
};

export default RecipeCardMenu;
