// Este módulo encapsula toda la lógica de la interfaz de crafteo.

// Variables privadas del módulo que se inicializarán desde el script principal.
let controls;
let textures;

// Variables de estado y elementos de la UI.
let isCraftingUIOpen = false;
const craftingUI = document.getElementById('crafting-ui');
const craftingGridSlots = document.querySelectorAll('.crafting-slot');
const craftingOutputSlot = document.getElementById('crafting-out');
const closeButton = document.getElementById('crafting-close-button');

// Estado de la rejilla de crafteo.
let craftingGrid = Array(9).fill(null);
const recipes = {
    'oak_log,,,,,,,,': { result: 'oak_planks', count: 4 }
};

// --- FUNCIONES PÚBLICAS (EXPORTADAS) ---

/**
 * Inicializa el módulo de crafteo. Se debe llamar desde el script principal.
 * @param {PointerLockControls} mainControls - Referencia a los controles del jugador.
 * @param {object} mainTextures - Referencia al objeto de texturas.
 */
export function initCrafting(mainControls, mainTextures) {
    controls = mainControls;
    textures = mainTextures;

    // Asignar los listeners de eventos que pertenecen a este módulo.
    closeButton.addEventListener('click', closeCraftingUI);
    
    craftingGridSlots.forEach((slot, index) => {
        slot.addEventListener('click', () => {
            // Lógica simple: clic para poner un tronco de roble.
            craftingGrid[index] = craftingGrid[index] === null ? 'oak_log' : null;
            updateCraftingGridUI();
            checkRecipes();
        });
    });
}

/**
 * Abre la interfaz de crafteo y libera el cursor del ratón.
 */
export function openCraftingUI() {
    isCraftingUIOpen = true;
    craftingUI.style.display = 'block';
    controls.unlock();
}

/**
 * Cierra la interfaz de crafteo.
 */
export function closeCraftingUI() {
    isCraftingUIOpen = false;
    craftingUI.style.display = 'none';
    // Limpiar la mesa de crafteo al cerrar.
    craftingGrid.fill(null);
    updateCraftingGridUI();
    checkRecipes();
}

/**
 * Devuelve si la interfaz de crafteo está abierta o no.
 * El script principal la usa para gestionar el bloqueo del cursor y los menús.
 * @returns {boolean}
 */
export function getIsCraftingOpen() {
    return isCraftingUIOpen;
}


// --- FUNCIONES PRIVADAS (NO EXPORTADAS) ---

/**
 * Actualiza la apariencia de la rejilla de crafteo en la UI.
 */
function updateCraftingGridUI() {
    craftingGrid.forEach((item, index) => {
        const slot = document.getElementById(`crafting-in-${index}`);
        if (item && textures[item]) {
            slot.style.backgroundImage = `url(${textures[item].image.src})`;
        } else {
            slot.style.backgroundImage = 'none';
        }
    });
}

/**
 * Comprueba la receta actual en la rejilla y muestra el resultado.
 */
function checkRecipes() {
    const key = craftingGrid.join(',');
    const recipe = recipes[key];
    if (recipe && textures[recipe.result]) {
         craftingOutputSlot.style.backgroundImage = `url(${textures[recipe.result].image.src})`;
    } else {
         craftingOutputSlot.style.backgroundImage = 'none';
    }
}
