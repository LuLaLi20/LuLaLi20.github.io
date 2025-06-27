document.addEventListener('DOMContentLoaded', () => {

    // 1. Seleccionar los elementos del DOM
    const searchInput = document.getElementById('searchInput');
    const tagButtons = document.querySelectorAll('.tag-button');
    const downloadCards = document.querySelectorAll('.download-card');
    const noResultsMessage = document.getElementById('no-results-message');

    // 2. Función principal para filtrar
    function filterDownloads() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeTag = document.querySelector('.tag-button.active').dataset.tag;
        
        let visibleCount = 0;

        // 3. Recorrer cada tarjeta de descarga
        downloadCards.forEach(card => {
            // Extraer el texto y las etiquetas de la tarjeta
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const cardTags = card.dataset.tags; // Esto es un string: "textura animacion bedrock"

            // 4. Comprobar si la tarjeta cumple con los filtros
            // Comprobación de la etiqueta
            const tagMatch = (activeTag === 'all' || cardTags.includes(activeTag));

            // Comprobación del texto de búsqueda
            const searchMatch = (title.includes(searchTerm) || description.includes(searchTerm));

            // 5. Mostrar u ocultar la tarjeta
            if (tagMatch && searchMatch) {
                card.style.display = 'flex'; // Usamos 'flex' porque el CSS original lo usa
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // 6. Mostrar u ocultar el mensaje de "no hay resultados"
        if (visibleCount === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }

    // 7. Añadir los Event Listeners

    // Listener para el campo de búsqueda (se activa al escribir)
    searchInput.addEventListener('input', filterDownloads);

    // Listeners para los botones de etiquetas
    tagButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Quitar la clase 'active' del botón que la tenga
            document.querySelector('.tag-button.active').classList.remove('active');
            // Añadir la clase 'active' al botón que se ha pulsado
            button.classList.add('active');
            // Volver a ejecutar el filtro
            filterDownloads();
        });
    });
});
