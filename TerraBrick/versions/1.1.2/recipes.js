// recipes.js

// Este archivo define todas las recetas de crafteo del juego.
// 'shape' es para recetas con forma. Las líneas deben tener la misma longitud.
// 'ingredients' es un array de objetos para recetas sin forma.
// El resultado siempre es un objeto { type: 'nombre_del_bloque', count: cantidad }

export const recipes = {
    // --- RECETAS 2x2 (Inventario) ---
    "oak_planks": {
        result: { type: 'oak_planks', count: 4 },
        shapeless: true, // No importa la posición
        ingredients: [
            { type: 'oak_log', count: 1 }
        ]
    },
    "crafting_table": {
        result: { type: 'crafting_table', count: 1 },
        shape: [
            "XX",
            "XX"
        ],
        ingredients: {
            'X': 'oak_planks'
        }
    },
    
    // --- RECETAS 3x3 (Mesa de Crafteo - para el futuro) ---
    // "stick": {
    //     result: { type: 'stick', count: 4 },
    //     shape: [
    //         "X",
    //         "X"
    //     ],
    //     ingredients: {
    //         'X': 'oak_planks'
    //     }
    // }
};
