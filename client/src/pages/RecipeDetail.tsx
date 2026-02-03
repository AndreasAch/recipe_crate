/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink, Element } from "react-scroll";
import { motion, LayoutGroup } from "framer-motion";
import { CiEdit, CiTrash } from "react-icons/ci";
import "../styles/RecipeDetail.css";
import { FaRegClock, FaStar, FaUserFriends } from "react-icons/fa";
import IngredientIcon from "../components/IngredientIcon";
import { IoArrowBack } from "react-icons/io5";
import defaultRecipeIcon from "../assets/defaultRecipeIcon.png";
import { API_BASE_URL } from "../config";
import LoadingOverlay from "../components/LoadingOverlay";

const RecipeDetail = () => {
	const { id } = useParams();
	const [recipe, setRecipe] = useState<any>(null);
	const [activeTab, setActiveTab] = useState("ingredients");
	const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);
	const isClicking = useRef(false);
	const [imageError, setImageError] = useState(false);
	const [adjustedServings, setAdjustedServings] = useState(recipe?.servings);

	const scalingFactor = recipe?.servings && adjustedServings > 0 ? adjustedServings / recipe.servings : 1;

	const formatAmount = (amount: any) => {
		const num = parseFloat(amount);
		return Number.isInteger(num) ? num : num.toFixed(2);
	};

	const handleSetActive = (to: string) => {
		if (!isClicking.current) {
			setActiveTab(to);
		}
	};

	const handleTabClick = (tabId: string) => {
		isClicking.current = true; 
		setActiveTab(tabId); 
		setTimeout(() => {
			isClicking.current = false;
		}, 550);
	};

	const toggleIngredient = (index: number) => {
		if (checkedIngredients.includes(index)) {
			setCheckedIngredients(checkedIngredients.filter((i) => i !== index));
		} else {
			setCheckedIngredients([...checkedIngredients, index]);
		}
	};

	useEffect(() => {
		fetch(`${API_BASE_URL}/api/recipes/${id}`)
			.then((res) => res.json())
			.then(setRecipe);
	}, [id]);

	useEffect(() => {
		if (recipe?.servings) {
			setAdjustedServings(recipe.servings);
		}
	}, [recipe]);

	if (!recipe) return <LoadingOverlay />;

	const tabs = [
		{ id: "ingredients", label: "Ingredients" },
		{ id: "instructions", label: "Instructions" },
		{ id: "notes", label: "Notes" },
	];

	return (
		<div className="rd-page-shell">
			<div className="rd-main-container">
				<div className="rd-hero">
					{recipe.image_url && !imageError ? (
						<img
							src={recipe.image_url}
							alt={recipe.title}
							className="rd-hero-img"
							onError={() => setImageError(true)}
						/>
					) : (
						<div className="rd-placeholder-wrapper">
							<img src={defaultRecipeIcon} alt="Default Recipe" className="rd-placeholder-icon" />
						</div>
					)}
					<div className="rd-hero-overlay" />

					<div className="rd-top-actions">
						<RouterLink to="/" className="rd-glass-btn">
							<IoArrowBack size={24} />
						</RouterLink>
						<div className="rd-right-group">
							<RouterLink to={`/edit/${id}`} className="rd-glass-btn">
								<CiEdit size={24} />
							</RouterLink>
							<button className="rd-glass-btn rd-trash-btn">
								<CiTrash size={24} />
							</button>
						</div>
					</div>
				</div>

				<div className="rd-drawer">
					<div className="rd-notch" />
					<h1 className="rd-title">{recipe.title}</h1>
					<div className="rd-meta-row">
						<div className="rd-meta-item">
							<FaStar size={22} className="rd-meta-icon rd-star" />
							<span>{recipe.rating || "N/A"}</span>
						</div>
						<div className="rd-meta-item timer">
							<FaRegClock size={22} className="rd-meta-icon" />
							<span>{recipe.cooking_time_minutes} mins</span>
						</div>
						<div className="rd-meta-item">
							<FaUserFriends size={22} className="rd-meta-icon" />
							<span>{recipe.servings} servings</span>
						</div>
					</div>
					<div className="rd-tags-container">
						{typeof recipe.tags === "string"
							? recipe.tags.split(",").map((tag: string, i: number) => (
									<span key={i} className="rd-tag">
										{tag.trim()}
									</span>
								))
							: Array.isArray(recipe.tags)
								? recipe.tags.map((tag: string, i: number) => (
										<span key={i} className="rd-tag">
											{tag}
										</span>
									))
								: null}
					</div>
					<nav className="rd-tabs-nav">
						<div className="rd-tabs-pill">
							<LayoutGroup>
								{tabs.map((tab) => (
									<ScrollLink
										key={tab.id}
										to={tab.id}
										spy={true}
										smooth={true}
										duration={500}
										offset={-120}
										onSetActive={() => handleSetActive(tab.id)}
										onClick={() => handleTabClick(tab.id)}
										activeClass="ignore-react-scroll-active"
										className={`rd-tab-item ${activeTab === tab.id ? "active" : ""}`}
									>
										<span className="rd-tab-label">{tab.label}</span>
										{activeTab === tab.id && (
											<motion.div
												layoutId="rd-tab-highlight"
												layout
												className="rd-tab-highlight"
												transition={{
													type: "spring",
													stiffness: 500,
													damping: 35,
												}}
											/>
										)}
									</ScrollLink>
								))}
							</LayoutGroup>
						</div>
					</nav>
					<div className="rd-content">
						<Element name="ingredients" className="rd-section">
							<div style={{ display: "flex" }}>
								<div className="rd-section-title">Ingredients</div>
								<div className="servings-adjustment">
									<span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Adjust Servings</span>
									<input
										type="text" 
										inputMode="decimal" 
										placeholder="" 
										value={adjustedServings === 0 ? "" : adjustedServings}
										onChange={(e) => {
											const val = e.target.value;
											if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
												setAdjustedServings(val === "" ? 0 : (val as any),);
											}
										}}
										onBlur={(e) => {
											const finalVal = parseFloat(e.target.value);
											if (!isNaN(finalVal)) {
												const rounded = Math.round(finalVal * 100) / 100;
												setAdjustedServings(rounded);
											}
										}}
										className="form-input-white-c small"
									/>
									<span className="original-servings-hint">(Original {recipe.servings})</span>
								</div>
							</div>

							<div className="rd-ingredients-list">
								{recipe.ingredients.map((ing: any, i: number) => (
									<div
										key={i}
										className={`rd-ing-row ${checkedIngredients.includes(i) ? "checked" : ""}`}
										onClick={() => toggleIngredient(i)}
									>
										<div className="rd-ing-icon-wrapper">
											<IngredientIcon name={ing.name} />
										</div>

										<div className="rd-ing-info">
											<span className="rd-ing-name">{ing.name}</span>
											<span className="rd-ing-details">
												{formatAmount(ing.amount * scalingFactor)} {ing.unit}
											</span>
										</div>

										<div className="rd-ing-check">
											<div
												className={`rd-radio-custom ${checkedIngredients.includes(i) ? "active" : ""}`}
											/>
										</div>
									</div>
								))}
							</div>
						</Element>

						<Element name="instructions" className="rd-section">
							<div className="rd-section-title">Instructions</div>
							<div className="rd-instructions-list">
								{recipe.instructions.map((step: any, i: number) => (
									<div key={i} className="rd-step-card">
										<div className="rd-step-number-container">
											<div className="rd-step-squircle">
												<span>{i + 1}</span>
											</div>
										</div>
										<div className="rd-step-content">
											<p>{step.instruction_text}</p>
										</div>
									</div>
								))}
							</div>
						</Element>

						<Element name="notes" className="rd-section">
							<div className="rd-section-title">Notes</div>
							<div className="rd-notes-content">
								{recipe.notes ? (
									<p style={{ whiteSpace: "pre-line" }}>{recipe.notes}</p>
								) : (
									<p className="rd-no-notes">No extra notes provided for this recipe.</p>
								)}
							</div>
						</Element>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RecipeDetail;
