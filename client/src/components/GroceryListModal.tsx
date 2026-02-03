import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { HiClipboardCopy, HiOutlineDocumentText } from "react-icons/hi";
import type { Recipe } from "../types";
import "../styles/GroceryListModal.css";
import IngredientIcon from "./IngredientIcon";
import { CiBoxList } from "react-icons/ci";

interface GroceryListModalProps {
	isOpen: boolean;
	onClose: () => void;
	recipes: Recipe[];
}

const GroceryListModal: React.FC<GroceryListModalProps> = ({ isOpen, onClose, recipes }) => {
	const [activeTab, setActiveTab] = useState<"list" | "text">("list");
	const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);

    const formatAmount = (amount: any) => {
		const num = parseFloat(amount);
		return Number.isInteger(num) ? num : num.toFixed(2);
	};

	const allIngredients = recipes.flatMap((r) => r.ingredients || []);
	const plainTextList = allIngredients.map((ing) => `${ing.name} ${formatAmount(ing.amount)} ${ing.unit}`).join("\n");

	const copyToClipboard = () => {
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard
				.writeText(plainTextList)
				.then(() => alert("Copied to clipboard!"))
				.catch(() => fallbackCopy(plainTextList));
		} else {
			fallbackCopy(plainTextList);
		}
	};

	const fallbackCopy = (text: string) => {
		const textArea = document.createElement("textarea");
		textArea.value = text;

		textArea.style.position = "fixed";
		textArea.style.left = "-9999px";
		textArea.style.top = "0";
		document.body.appendChild(textArea);

		textArea.focus();
		textArea.select();

		try {
			const successful = document.execCommand("copy");
			if (successful) alert("Copied to clipboard (fallback)!");
		} catch (err) {
			console.error("Fallback copy failed", err);
		}

		document.body.removeChild(textArea);
	};

	const toggleIngredient = (index: number) => {
		if (checkedIngredients.includes(index)) {
			setCheckedIngredients(checkedIngredients.filter((i) => i !== index));
		} else {
			setCheckedIngredients([...checkedIngredients, index]);
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						className="grocery-overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>

					<motion.div
						className="grocery-modal"
						initial={{ scale: 0.9, opacity: 0}}
						animate={{ scale: 1, opacity: 1}}
						exit={{ scale: 0.9, opacity: 0}}
					>
						<div className="grocery-header">
							<LayoutGroup id="grocery-tabs">
								{" "}
								<div className="tab-switch">
									<button
										type="button"
										className={`tab-btn ${activeTab === "list" ? "active" : ""}`}
										onClick={() => setActiveTab("list")}
									>
										<span className="tab-content">
											<CiBoxList />
											<span>Checklist</span>
										</span>
										{activeTab === "list" && (
											<motion.div
												layoutId="grocery-tab-pill"
												className="tab-highlighter"
												initial={false}
												transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
											/>
										)}
									</button>

									<button
										type="button"
										className={`tab-btn ${activeTab === "text" ? "active" : ""}`}
										onClick={() => setActiveTab("text")}
									>
										<span className="tab-content">
											<HiOutlineDocumentText />
											<span>Raw Text</span>
										</span>
										{activeTab === "text" && (
											<motion.div
												layoutId="grocery-tab-pill"
												className="tab-highlighter"
												initial={false}
												transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
											/>
										)}
									</button>
								</div>
							</LayoutGroup>
						</div>

						<div className="grocery-content">
							{activeTab === "list" ? (
								<div className="ingredients-checklist">
									{allIngredients.map((ing, idx) => (
										<div
											key={idx}
											className={`ing-check-row ${checkedIngredients.includes(idx) ? "checked" : ""}`}
											onClick={() => toggleIngredient(idx)}
										>
											<div className="rd-ing-icon-wrapper">
												<IngredientIcon name={ing.name} />
											</div>
											<div className="rd-ing-info">
												<span className="rd-ing-name">{ing.name}</span>
												<span className="rd-ing-details">
													{formatAmount(ing.amount)} {ing.unit}
												</span>
											</div>
											<div className="rd-ing-check">
												<div
													className={`rd-radio-custom ${checkedIngredients.includes(idx) ? "active" : ""}`}
												/>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-area-container">
									<textarea readOnly value={plainTextList} className="grocery-textarea" />
									<button className="copy-btn" onClick={copyToClipboard}>
										<HiClipboardCopy /> Copy All
									</button>
								</div>
							)}
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default GroceryListModal;
 