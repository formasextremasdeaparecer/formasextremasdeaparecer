// Obtener elementos del DOM
const modal = document.getElementById('manifesto-modal');
const btn = document.getElementById('open-manifesto');
const span = document.querySelector('.close');

// Abrir el modal al hacer clic en el botón
btn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Cerrar el modal al hacer clic en la 'x'
span.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Cerrar el modal al hacer clic fuera de él
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
