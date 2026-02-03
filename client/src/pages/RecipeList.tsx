/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import type { Recipe } from "../types";
import RecipeCard from "../components/RecipeCard";
import NavigationHub from "../components/NavigationHub";
import RosterFloatingButton from "../components/RosterFloatingButton";
import { API_BASE_URL } from "../config";
import "ldrs/react/Hourglass.css";
import LoadingOverlay from "../components/LoadingOverlay";

function RecipeList() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);

	const fetchRecipes = async () => {
		setLoading(true); 
		try {
			const res = await fetch(`${API_BASE_URL}/api/recipes`);
			const data = await res.json();
			setRecipes(data);
		} catch (err) {
			console.error("Backend Error in getAllRecipes:", err); 
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRecipes();
	}, []);

	const deleteRecipe = async (id: number) => {
		if (!window.confirm("Are you sure?")) return;
		try {
			const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
				method: "DELETE",
			});
			if (response.ok) fetchRecipes();
		} catch (err) {
			console.error(err);
		}
	};

	const toggleRoster = async (id: number) => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/recipes/${id}/toggle-roster`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});

			if (response.ok) {
				const data = await response.json();

				setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, in_roster: data.in_roster } : r)));
			}
		} catch (err) {
			console.error("Failed to toggle roster:", err);
		}
	};

	const filteredRecipes = recipes.filter(
		(r) =>
			r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			r.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
	);

	const rosterItems = recipes.filter((r) => r.in_roster);

	return (
		<div className="container">
			<NavigationHub />
			<RosterFloatingButton
				rosterRecipes={rosterItems}
				onRemoveFromRoster={toggleRoster}
			/>
			<header className="list-header-centered">
				<h1>My Recipe Crate</h1>

				<div className="search-wrapper-centered">
					<input
						type="text"
						placeholder="Search recipes..."
						className="search-input"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</header>

			<hr className="header-divider" />

			<main className="recipe-grid-container">
				{loading ? (
					<LoadingOverlay/>
				) : (
					<div className="recipe-grid">
						{filteredRecipes.map((recipe) => (
							<RecipeCard
								key={recipe.id}
								recipe={recipe}
								onDelete={deleteRecipe}
								onRosterToggle={toggleRoster}
							/>
						))}
						{filteredRecipes.length === 0 && (
							<p className="no-results">No recipes found matching "{searchTerm}"</p>
						)}
					</div>
				)}
			</main>
		</div>
	);
}

export default RecipeList;
