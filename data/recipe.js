const mongoCollections = require("../config/mongoCollections");
const recipes = mongoCollections.recipes;
const uuidv1 = require('uuid/v1');

let exportedmethods = {
    getAllRecipes() {
        return recipes().then(recipeCollection => {
            return recipeCollection.find({}, { projection: { _id: 1, title: 1}}).toArray();
        });
    },

    getRecipeById(id) {
        return recipes().then(recipeCollection => {
            return recipeCollection.findOne({ _id: id }).then(recipe => {
                if (!recipe) throw "recipe not found";

                return recipe;
            });
        });
    },

    addRecipe(title, ingredients, steps) {
        return recipes().then(recipeCollection => {
            let newRecipe = {
                _id: uuidv1(),
                title: title,
                ingredients: ingredients,
                steps: steps
            };

            return recipeCollection
                .insertOne(newRecipe)
                .then(newInsertInformation => {
                    return newInsertInformation.insertedId;
                })
                .then(newId => {
                    return this.getRecipeById(newId);
                });
        });
    },

    async updateRecipe(id, updatedRecipe) {
        const recipeCollection= await recipes();

        const updatedRecipeData = {};

        if(updatedRecipe.title){
            updatedRecipeData.title = updatedRecipe.title;
        }

        if (updatedRecipe.ingredients) {
            updatedRecipeData.ingredients = updatedRecipe.ingredients;
        }

        if (updatedRecipe.steps) {
            updatedRecipeData.steps = updatedRecipe.steps;
        }

        let updateCommand = {
            $set: updatedRecipeData
        };

        const query= {
            _id: id
        };

        await recipeCollection.updateOne(query, updateCommand);

        return await this.getRecipeById(id);
    },

    removeRecipe(id) {
        return recipes().then( recipeCollection => {
            return recipeCollection.removeOne({ _id: id }).then(deletionInfo => {
                if (deletionInfo.deletedCount === 0) {
                    throw `Could not delete Recipe with id of ${id}`;
                }
            });
        });
    }
};

module.exports = exportedmethods;