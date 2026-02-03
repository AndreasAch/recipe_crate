import { Router } from "express";
import { createRecipe, deleteRecipe, getAllRecipes, getRecipeById, updateRecipe, getRoster, toggleRoster } from "../controllers/recipeController";

const router = Router();

router.get('/roster/list', getRoster);

router.get('/', getAllRecipes);
router.post('/', createRecipe);
router.get('/:id', getRecipeById);
router.delete('/:id', deleteRecipe);
router.put('/:id', updateRecipe);

router.post('/:id/toggle-roster', toggleRoster);

export default router;