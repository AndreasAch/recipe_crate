import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";
import type { Recipe } from "../types";
import { IoArrowBack } from "react-icons/io5";
import defaultRecipeIcon from "../assets/defaultRecipeIcon.png";
import { API_BASE_URL } from "../config";
import LoadingOverlay from "../components/LoadingOverlay";

const EditRecipe = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [imageError, setImageError] = useState(false);

	const handleLocalImageUpdate = (newUrl: string) => {
		if (recipe) {
			setRecipe({ ...recipe, image_url: newUrl });
			setImageError(false);
		}
	};

	useEffect(() => {
        fetch(`${API_BASE_URL}/api/recipes/${id}`)
            .then((res) => res.json())
            .then((data) => setRecipe(data));
    }, [id]);

	if (!recipe) return <LoadingOverlay/>;

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
						<button onClick={() => navigate(-1)} className="rd-glass-btn">
							<IoArrowBack size={24} />
						</button>
					</div>
				</div>

				<div className="rd-drawer">
					<div className="rd-notch" />
					<h1 className="page-title">Edit Recipe</h1>
					<p style={{ color: "#747d8c", marginBottom: "20px", fontWeight: 500 }}>
						Modifying: {recipe.title}
					</p>

					<div className="rd-content">
						<RecipeForm
							key={recipe.id}
							initialData={recipe}
							isEditMode={true}
							onSuccess={() => navigate(`/recipe/${id}`)}
              onImageUpdate={handleLocalImageUpdate}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditRecipe;
