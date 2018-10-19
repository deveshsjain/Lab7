const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const recipe = data.recipe;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  const addRecipe = await recipe.addRecipe(
    "Fried Egg",
     [{
      name: "a1",
      amount: "2"},
      {
        name: "a2",
        amount: "3"
      }],
      ["Step 1",
    "Step 2"]
  );

  console.log("Done seeding database");
  await db.close();
}

main();
