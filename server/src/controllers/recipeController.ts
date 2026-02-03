import { Request, Response } from "express";
import pool from "../config/db";
import { Recipe } from "../types";
import { error } from "node:console";

export const createRecipe = async (req: Request, res: Response) => {
	const client = await pool.connect();

	try {
		const {
			title,
			cooking_time_minutes,
			servings,
			image_url,
			rating,
			source_url,
			notes,
			instructions,
			ingredients,
			tags,
		}: Recipe = req.body;

		await client.query("BEGIN");

		const recipeResult = await client.query(
			`INSERT INTO recipes (title, cooking_time_minutes, servings, image_url, rating, source_url, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
			[title, cooking_time_minutes, servings, image_url, rating, source_url, notes],
		);
		const recipeId = recipeResult.rows[0].id;

		for (const step of instructions) {
			await client.query(
				`INSERT INTO instructions (recipe_id, step_number, instruction_text) VALUES ($1, $2, $3)`,
				[recipeId, step.step_number, step.instruction_text],
			);
		}

		for (const ing of ingredients) {
			const ingResult = await client.query(
				`INSERT INTO ingredients (name) VALUES ($1) 
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name 
         RETURNING id`,
				[ing.name.toLowerCase()],
			);
			const ingredientId = ingResult.rows[0].id;

			await client.query(
				`INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES ($1, $2, $3, $4)`,
				[recipeId, ingredientId, ing.amount, ing.unit],
			);
		}

		for (const tagName of tags) {
			const tagResult = await client.query(
				`INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
				[tagName.toLowerCase()],
			);
			const tagId = tagResult.rows[0].id;
			await client.query(`INSERT INTO recipe_tags (recipe_id, tag_id) VALUES ($1, $2)`, [recipeId, tagId]);
		}

		await client.query("COMMIT");
		res.status(201).json({ message: "Recipe created!", recipeId });
	} catch (error) {
		await client.query("ROLLBACK");
		console.error("Transaction Error:", error);
		res.status(500).json({ error: "Failed to create recipe" });
	} finally {
		client.release();
	}
};

export const getAllRecipes = async (req: Request, res: Response) => {
	try {
		const result = await pool.query(`
            SELECT r.*, 
            CASE WHEN ros.recipe_id IS NOT NULL THEN TRUE ELSE FALSE END as in_roster
            FROM recipes r
            LEFT JOIN roster ros ON r.id = ros.recipe_id
            ORDER BY r.id DESC
        `);
		const recipes = result.rows;

		const recipesWithData = await Promise.all(
			recipes.map(async (recipe) => {
				const ingResult = await pool.query(
					`SELECT i.name, ri.amount, ri.unit 
                 FROM ingredients i 
                 JOIN recipe_ingredients ri ON i.id = ri.ingredient_id 
                 WHERE ri.recipe_id = $1`,
					[recipe.id],
				);

				const tagResult = await pool.query(
					`SELECT t.name
                 FROM tags t
                 JOIN recipe_tags rt ON t.id = rt.tag_id
                 WHERE rt.recipe_id = $1`,
					[recipe.id],
				);

				return {
					...recipe,
					ingredients: ingResult.rows || [],
					tags: tagResult.rows.map((row) => row.name) || [],
				};
			}),
		);

		res.json(recipesWithData);
	} catch (err) {
		console.error("Backend Error in getAllRecipes:", err);
		res.status(500).json({ error: "Failed to fetch recipes" });
	}
};

export const getRecipeById = async (req: Request, res: Response) => {
	const { id } = req.params;
	console.log("Looking for Recipe ID:", id);

	try {
		const recipeRes = await pool.query("SELECT * FROM recipes WHERE id = $1", [id]);
		if (recipeRes.rows.length === 0) {
			console.log("Recipe not found in DB");
			return res.status(404).json({ error: "Recipe not found" });
		}
		const recipe = recipeRes.rows[0];
		console.log("Found Recipe title:", recipe.title);

		const ingRes = await pool.query(
			`
      SELECT i.name, ri.amount, ri.unit 
      FROM ingredients i
      JOIN recipe_ingredients ri ON i.id = ri.ingredient_id
      WHERE ri.recipe_id = $1`,
			[id],
		);
		console.log("Found Ingredients count:", ingRes.rows.length);

		const stepRes = await pool.query(
			"SELECT step_number, instruction_text FROM instructions WHERE recipe_id = $1 ORDER BY step_number",
			[id],
		);
		console.log("Found Steps count:", stepRes.rows.length);

		const tagRes = await pool.query(
			`
        SELECT t.name
        FROM tags t
        JOIN recipe_tags rt ON t.id = rt.tag_id
        WHERE rt.recipe_id = $1`,
			[id],
		);

		const tags = tagRes.rows.map((row) => row.name);

		res.json({
			...recipe,
			ingredients: ingRes.rows,
			instructions: stepRes.rows,
			tags: tags,
		});
	} catch (error: any) {
		console.error("DATABASE ERROR:", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const deleteRecipe = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const result = await pool.query("DELETE FROM recipes WHERE id = $1", [id]);

		if (result.rowCount === 0) {
			return res.status(404).json({ error: "Recipe not found" });
		}

		res.json({ message: "Recipe delete successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to delete recipe" });
	}
};

export const updateRecipe = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { title, cooking_time_minutes, servings, image_url, rating, notes, ingredients, instructions, tags } =
		req.body;

	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		await client.query(
			`UPDATE recipes SET title = $1, cooking_time_minutes = $2, servings = $3, image_url = $4, rating = $5, notes = $6
       WHERE id = $7`,
			[title, cooking_time_minutes, servings, image_url, rating, notes, id],
		);

		await client.query("DELETE FROM recipe_ingredients WHERE recipe_id = $1", [id]);
		await client.query("DELETE FROM instructions WHERE recipe_id = $1", [id]);
		await client.query("DELETE FROM recipe_tags WHERE recipe_id = $1", [id]);

		for (const ing of ingredients) {
			const ingResult = await client.query(
				"INSERT INTO ingredients (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
				[ing.name],
			);
			await client.query(
				"INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES ($1, $2, $3, $4)",
				[id, ingResult.rows[0].id, ing.amount, ing.unit],
			);
		}

		for (const step of instructions) {
			await client.query(
				"INSERT INTO instructions (recipe_id, step_number, instruction_text) VALUES ($1, $2, $3)",
				[id, step.step_number, step.instruction_text],
			);
		}

		if (tags && Array.isArray(tags)) {
			for (const tagName of tags) {
				const tagResult = await client.query(
					`INSERT INTO tags (name) 
           VALUES ($1) 
           ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name 
           RETURNING id`,
					[tagName.toLowerCase()],
				);

				const tagId = tagResult.rows[0].id;

				await client.query("INSERT INTO recipe_tags (recipe_id, tag_id) VALUES ($1, $2)", [id, tagId]);
			}
		}

		await client.query("COMMIT");
		res.json({ message: "Recipe updated successfully" });
	} catch (error) {
		await client.query("ROLLBACK");
		console.error(error);
		res.status(500).json({ error: "Update failed" });
	} finally {
		client.release();
	}
};

export const toggleRoster = async (req: Request, res: Response) => {
	const { id } = req.params;
	const client = await pool.connect();
	try {
		const exists = await client.query("SELECT 1 FROM roster WHERE recipe_id = $1", [id]);
		if (exists.rows.length > 0) {
			await client.query("DELETE FROM roster WHERE recipe_id = $1", [id]);
			res.json({ in_roster: false });
		} else {
			await client.query("INSERT INTO roster (recipe_id) VALUES ($1)", [id]);
			res.json({ in_roster: true });
		}
	} catch (err) {
		res.status(500).json({ error: "Roster toggle failed" });
	} finally {
		client.release();
	}
};


export const getRoster = async (req: Request, res: Response) => {
	try {
		const result = await pool.query(`
            SELECT r.*, TRUE as in_roster 
            FROM recipes r
            INNER JOIN roster ros ON r.id = ros.recipe_id
        `);

		const recipes = result.rows;

		const rosterWithIngredients = await Promise.all(
			recipes.map(async (recipe) => {
				const ingRes = await pool.query(
					`SELECT i.name, ri.amount, ri.unit 
                 FROM ingredients i
                 JOIN recipe_ingredients ri ON i.id = ri.ingredient_id
                 WHERE ri.recipe_id = $1`,
					[recipe.id],
				);
				return {
					...recipe,
					ingredients: ingRes.rows || [],
				};
			}),
		);

		res.json(rosterWithIngredients);
	} catch (err: any) {
		console.error("Roster Fetch Error:", err.message);
		res.status(500).json({ error: "Internal Server Error during roster fetch" });
	}
};
