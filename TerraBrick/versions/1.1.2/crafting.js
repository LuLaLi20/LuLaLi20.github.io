// crafting.js
import { recipes } from './recipes.js';

/**
 * Comprueba una rejilla de crafteo contra las recetas definidas.
 * @param {Array<Object|null>} grid - La rejilla de crafteo (ej. 4 items para 2x2, 9 para 3x3).
 * @returns {Object|null} El ítem resultante si se encuentra una receta, o null.
 */
export function checkRecipe(grid) {
    for (const recipeKey in recipes) {
        const recipe = recipes[recipeKey];

        // Comprobar recetas sin forma (shapeless)
        if (recipe.shapeless) {
            const gridItems = grid.filter(item => item !== null).map(item => item.type);
            const recipeItems = recipe.ingredients.map(item => item.type);
            
            if (gridItems.length === recipeItems.length && gridItems.sort().toString() === recipeItems.sort().toString()) {
                 // Por ahora, asumimos que se consume 1 de cada ingrediente
                 return recipe.result;
            }
        }
        // Comprobar recetas con forma (shaped)
        else if (recipe.shape) {
            const recipeGrid = getRecipeGrid(recipe.shape, recipe.ingredients);
            const gridSize = Math.sqrt(grid.length);

            if (recipeGrid.length > grid.length) continue; // La receta no cabe

            const gridTypes = grid.map(item => item ? item.type : null);
            
            // Comparamos las rejillas
            if (areGridsEqual(gridTypes, recipeGrid, gridSize)) {
                return recipe.result;
            }
        }
    }
    return null; // No se encontró ninguna receta
}

function getRecipeGrid(shape, ingredients) {
    const size = shape.length > 0 ? shape[0].length : 0;
    const grid = new Array(size * size).fill(null);
    shape.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
            const char = row[x];
            if (char !== ' ' && ingredients[char]) {
                grid[y * size + x] = ingredients[char];
            }
        }
    });
    return grid;
}

function areGridsEqual(grid1, grid2, size) {
    if (grid1.length !== size * size || grid2.length !== size * size) return false;
    for (let i = 0; i < grid1.length; i++) {
        if (grid1[i] !== grid2[i]) {
            return false;
        }
    }
    return true;
}
