import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CiTrash, CiImageOn, CiCirclePlus, CiTextAlignLeft, CiCalculator1, CiBeaker1 } from "react-icons/ci";
import { FaUserFriends, FaStar, FaTimes, FaRegClock, FaPlus } from "react-icons/fa";
import StarRating from "./StarRating";
import IngredientIcon from "./IngredientIcon";
import type { Recipe, Ingredient } from "../types";
import "../styles/RecipeForm.css";
import { API_BASE_URL } from "../config";
import defaultRecipeIcon from "../assets/defaultRecipeIcon.png";
import LoadingOverlay from "./LoadingOverlay";

interface Props {
	onSuccess: () => void;
	initialData?: Recipe;
	isEditMode?: boolean;
	onImageUpdate?: (url: string) => void;
}

const RecipeForm: React.FC<Props> = ({ initialData, isEditMode = false, onSuccess, onImageUpdate }) => {
	const { id } = useParams();
	const [formData, setFormData] = useState<Recipe>(
		initialData || {
			title: "",
			cooking_time_minutes: 0,
			servings: 1,
			image_url: "",
			rating: 0,
			notes: "",
			tags: [],
			ingredients: [{ name: "", amount: 0, unit: "" }],
			instructions: [{ step_number: 1, instruction_text: "" }],
		},
	);
	const [showImagePopup, setShowImagePopup] = useState(false);
	const [tempUrl, setTempUrl] = useState(formData.image_url);
	const [tagInput, setTagInput] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const isDirty =
		JSON.stringify(formData) !==
		JSON.stringify(
			initialData || {
				title: "",
				cooking_time_minutes: 0,
				servings: 1,
				image_url: "",
				rating: 0,
				notes: "",
				tags: [],
				ingredients: [{ name: "", amount: 0, unit: "" }],
				instructions: [{ step_number: 1, instruction_text: "" }],
			},
		);

	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (isDirty) {
				e.preventDefault();
				e.returnValue = "";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [isDirty]);


	useEffect(() => {
		if (initialData) {
			const cleanedIngredients = initialData.ingredients.map((ing) => ({
				...ing,
				amount: ing.amount === 0 ? "" : parseFloat(Number(ing.amount).toString()),
			}));
			setFormData({
				...initialData,
				ingredients: cleanedIngredients,
			});
		}
	}, [initialData]);

	const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
	const removeTag = (tagToRemove: string) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.filter((t) => t !== tagToRemove),
		}));
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
		const newIngredients = [...formData.ingredients];
		let processedValue = value;
		if (field === "name" && typeof value === "string") {
			processedValue = capitalize(value);
		}
		newIngredients[index] = {
			...newIngredients[index],
			[field]: processedValue,
		};
		setFormData((prev) => ({ ...prev, ingredients: newIngredients }));
	};

	const listItemVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: { opacity: 1, y: 0 },
		exit: { opacity: 0, x: -20 },
	};

	const handleStepChange = (index: number, value: string) => {
		const newSteps = [...formData.instructions];
		newSteps[index].instruction_text = value;
		setFormData((prev) => ({ ...prev, instructions: newSteps }));
	};

	const handleAddTagManual = () => {
		if (tagInput.trim()) {
			if (!formData.tags.includes(tagInput.trim())) {
				setFormData((prev) => ({
					...prev,
					tags: [...prev.tags, tagInput.trim()],
				}));
			}
			setTagInput("");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);

		const url = isEditMode ? `${API_BASE_URL}/api/recipes/${id}` : `${API_BASE_URL}/api/recipes`;
		try {
			const response = await fetch(url, {
				method: isEditMode ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			if (response.ok) onSuccess();
		} catch (err) {
			console.error("Save failed", err);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="rf-container">
			<AnimatePresence>
				{submitting && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="submission-overlay"
					>
						<div className="submission-content">
							<LoadingOverlay />
							<label>Saving recipe...</label>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<div className="rf-image-preview-wrapper" onClick={() => setShowImagePopup(true)}>
				{formData.image_url ? (
					<img
						src={formData.image_url}
						className="rf-hero-preview"
						onError={(e) => {
							(e.target as HTMLImageElement).src = defaultRecipeIcon;
							(e.target as HTMLImageElement).classList.add("is-placeholder");
						}}
					/>
				) : (
					<div className="rd-placeholder-wrapper">
						<img src={defaultRecipeIcon} alt="Default" className="rd-placeholder-icon" />
					</div>
				)}
				<div className="rf-image-overlay">
					<CiImageOn size={30} />
					<span>{isEditMode ? "Change Image" : "Add Image"}</span>
				</div>
			</div>

			<AnimatePresence>
				{showImagePopup && (
					<div className="rf-modal-backdrop">
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="rf-modal"
						>
							<button
								type="button"
								style={{ position: "absolute", top: "0.1rem", right: "0.06rem" }}
								onClick={() => setShowImagePopup(false)}
								className="btn-negative"
							>
								<FaTimes size={18} />
							</button>
							<h3 className="section-title">Image URL</h3>

							<input
								autoFocus
								value={tempUrl}
								onChange={(e) => setTempUrl(e.target.value)}
								placeholder="Paste URL here..."
								className="form-input"
							/>
							<div className="rf-modal-actions">
								<button
									type="button"
									onClick={() => {
										setFormData({
											...formData,
											image_url: tempUrl,
										});
										if (onImageUpdate) {
											onImageUpdate(tempUrl || "");
										}
										setShowImagePopup(false);
									}}
									className="btn-primary"
								>
									Save
								</button>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			<div className="rf-section">
				<label className="section-title">Recipe Title</label>
				<input
					name="title"
					value={formData.title}
					onChange={handleChange}
					className="form-input"
					required
				/>
			</div>

			<div className="rf-meta-grid">
				<div className="rf-meta-field centered">
					<div className="rf-meta-icon-label">
						<FaStar color="#ffa502" size={20} /> Rating
					</div>
					<StarRating
						rating={Number(formData.rating) || 0}
						onRatingChange={(newRating) => {
							setFormData((prev) => ({ ...prev, rating: newRating }));
						}}
					/>
					<input
						tabIndex={-1}
						autoComplete="off"
						required
						value={formData.rating === 0 ? "" : formData.rating}
						onChange={() => {}}
						style={{
							opacity: 0,
							position: "absolute",
							height: "1px",
							width: "1px",
							marginTop: "25px",
							pointerEvents: "none",
						}}
					/>
				</div>
				<div className="rf-meta-field centered">
					<div className="rf-meta-icon-label">
						<FaRegClock size={20} color="#27ae60" stroke-width="0.08rem" /> Cooking Time
					</div>
					<input
						type="number"
						name="cooking_time_minutes"
						value={formData.cooking_time_minutes}
						onChange={handleChange}
						className="form-input-white-c"
					/>
				</div>
				<div className="rf-meta-field centered">
					<div className="rf-meta-icon-label">
						<FaUserFriends color="#27ae60" size={20} /> Servings
					</div>
					<input
						type="number"
						name="servings"
						value={formData.servings}
						onChange={handleChange}
						className="form-input-white-c"
					/>
				</div>
			</div>

			<div className="rf-section">
				<label className="section-title">Tags</label>
				<div className="rf-tag-input-wrapper">
					<input
						value={tagInput}
						onChange={(e) => {
							const val = e.target.value;
							if (val.endsWith(",")) {
								handleAddTagManual();
							} else {
								setTagInput(val);
							}
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleAddTagManual();
							}
						}}
						placeholder="Type and press Enter or '+'"
						className="form-input"
					/>
					<button type="button" className="rf-tag-add-btn" onClick={handleAddTagManual}>
						<FaPlus size={18} />
					</button>
				</div>
				<div className="rf-tag-cloud">
					<AnimatePresence>
						{formData.tags.map((tag) => (
							<motion.span
								layout
								key={tag}
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0, opacity: 0 }}
								transition={{ type: "spring", stiffness: 300, damping: 20 }}
								className="rf-tag-pill"
							>
								{tag}
								<FaTimes
									style={{ marginLeft: "8px", cursor: "pointer", fontSize: "10px" }}
									onClick={() => removeTag(tag)}
								/>
							</motion.span>
						))}
					</AnimatePresence>
				</div>
			</div>

			<div className="rf-section">
				<h3 className="section-title">Ingredients</h3>
				<div className="rf-list">
					<AnimatePresence initial={false}>
						{formData.ingredients.map((ing, idx) => (
							<motion.div
								key={idx}
								variants={listItemVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								className="rf-item-card"
							>
								<div className="rf-ing-row-content">
									<div className="rf-ing-icon-column">
										<IngredientIcon name={ing.name} size={40} />
									</div>

									<div className="rf-input-group rf-flex-grow">
										<div className="rf-floating-label">
											<CiTextAlignLeft size={14} /> <span>Ingredient</span>
										</div>
										<input
											value={ing.name}
											onChange={(e) => handleIngredientChange(idx, "name", e.target.value)}
											className="form-input-white"
										/>
									</div>

									<div className="rf-input-group rf-width-sm">
										<div className="rf-floating-label">
											<CiCalculator1 size={14} /> <span>Amount</span>
										</div>
										<input
											type="text"
											inputMode="decimal"
											className="form-input-white-c"
											placeholder=""
											value={ing.amount === 0 ? "" : ing.amount}
											onChange={(e) => {
												const val = e.target.value;
												if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
													handleIngredientChange(idx, "amount", val === "" ? 0 : val);
												}
											}}
											onBlur={(e) => {
												const finalVal = parseFloat(e.target.value);
												if (!isNaN(finalVal)) {
													const rounded = Math.round(finalVal * 100) / 100;
													handleIngredientChange(idx, "amount", rounded);
												}
											}}
										/>
									</div>

									<div className="rf-input-group rf-width-md">
										<div className="rf-floating-label">
											<CiBeaker1 size={14} /> <span>Unit</span>
										</div>
										<input
											value={ing.unit}
											onChange={(e) => handleIngredientChange(idx, "unit", e.target.value)}
											className="form-input-white-c"
										/>
									</div>

									<button
										type="button"
										className="btn-negative"
										onClick={() =>
											setFormData((p) => ({
												...p,
												ingredients: p.ingredients.filter((_, i) => i !== idx),
											}))
										}
									>
										<CiTrash size={18} />
									</button>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
				<button
					type="button"
					onClick={() =>
						setFormData((p) => ({
							...p,
							ingredients: [...p.ingredients, { name: "", amount: 0, unit: "" }],
						}))
					}
					className="rf-add-list-btn"
				>
					<CiCirclePlus size={24} /> Add Ingredient
				</button>
			</div>

			<div className="rf-section">
				<h3 className="section-title">Instructions</h3>
				<div className="rf-list">
					<AnimatePresence initial={false}>
						{formData.instructions.map((step, idx) => (
							<motion.div
								key={idx}
								variants={listItemVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								className="rf-step-card"
							>
								<div className="rf-step-num">{idx + 1}</div>
								<textarea
									value={step.instruction_text}
									onChange={(e) => handleStepChange(idx, e.target.value)}
									className="form-input-white scroll"
									placeholder="Describe this step..."
								/>
								<button
									type="button"
									className="btn-negative"
									onClick={() =>
										setFormData((p) => ({
											...p,
											instructions: p.instructions
												.filter((_, i) => i !== idx)
												.map((s, i) => ({
													...s,
													step_number: i + 1,
												})),
										}))
									}
								>
									<CiTrash size={18} />
								</button>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
				<button
					type="button"
					onClick={() =>
						setFormData((p) => ({
							...p,
							instructions: [
								...p.instructions,
								{
									step_number: p.instructions.length + 1,
									instruction_text: "",
								},
							],
						}))
					}
					className="rf-add-list-btn"
				>
					<CiCirclePlus size={24} /> Add Step
				</button>
			</div>

			<div className="rf-section">
				<label className="section-title">Notes</label>
				<textarea
					name="notes"
					value={formData.notes || ""}
					onChange={handleChange}
					className="form-input-white"
					placeholder="Any extra tips or variations..."
				/>
			</div>

			<button
				type="submit"
				disabled={submitting}
				style={{ width: "100%" }}
				className={submitting ? "btn-disabled" : "btn-primary"}
			>
				{submitting ? "Saving..." : isEditMode ? "Update Recipe" : "Save Recipe"}
			</button>
		</form>
	);
};

export default RecipeForm;
