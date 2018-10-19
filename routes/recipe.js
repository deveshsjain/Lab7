const express = require("express");
const router = express.Router();
const data = require("../data");
const recipeData = data.recipe;


router.get("/", async (req, res) => {
    try {
        const recipeList = await recipeData.getAllRecipes();
        res.json(recipeList);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const recipeId = await recipeData.getRecipeById(req.params.id);
        res.json(recipeId);
    } catch (e) {
        res.status(404).json({ error: "recipeId not found" });
    }
});

router.post("/", async (req, res) => {
    const recipeInfo = req.body;

    if (!recipeInfo) {
        res.status(400).json({ error: "You must provide data to create a recipe" });
        return;
    }

    if (!recipeInfo.title) {
        res.status(400).json({ error: "You must provide a title" });
        return;
    }

    if (!recipeInfo.ingredients) {
        res.status(400).json({ error: "You must provide ingredient name and amount" });
        return;
    }

    if (!recipeInfo.steps) {
        res.status(400).json({ error: "You must provide steps" });
        return;
    }

    try {
        const {title,ingredients,steps} = recipeInfo;
        const newRecipe = await recipeData.addRecipe(title, ingredients, steps);
        res.json(newRecipe);
    } catch (e) {
        res.sendStatus(500).json({error : e});
    }
});

router.put("/:id", async (req, res) => {
    const updatedData = req.body;
    try {
        await recipeData.getRecipeById(req.params.id);
    } catch (e) {
        res.status(404).json({ error: "Recipe not found" });
    }

    try {
        const updatedPost = await recipeData.updateRecipe(req.params.id, updatedData);
        res.json(updatedPost);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.patch("/:id", async (req, res) => {
    const updatedData = req.body;
    try {
        await recipeData.getRecipeById(req.params.id);
    } catch (e) {
        res.status(404).json({ error: "Recipe not found" });
    }

    try {
        const updatedPost = await recipeData.updateRecipe(req.params.id, updatedData);
        res.json(updatedPost);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await recipeData.getRecipeById(req.params.id);
    } catch (e) {
        res.status(404).json({ error: "Recipe not found" });
    }
    try {
        await recipeData.removeRecipe(req.params.id);
        return res.status(200).json("Recipe Deleted");
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;