
const tituloJuego = 'Encuadrar una multitud';
const videos = [
    { src: '1. SOFIA CASARINO - ENCUADRAR UNA MULTITUD.mp4', realizador: 'Sofía Casarino' },
    { src: '2. Bruno Alvarez - Encuadrar Una Multitud.mp4', realizador: 'Bruno Alvarez' },
    { src: '3. PATRICIO MARTINEZ - ENCUADRAR UNA MULTITUD.mp4', realizador: 'Patricio Martínez' },
    { src: '4. Jo Cespedes - Encuadrar Una Multitud.mp4', realizador: 'Jo Céspedes y Sofía Benito' },
    { src: '5. ANÓNIMO 1 - ENCUADRAR UNA MULTITUD.MOV', realizador: 'Anónimo'},
    { src: '6. Anónimo 2 - Encuadrar Una Multitud.mp4', realizador: 'Anónimo'},
];


// Establecer el título dinámico en el HTML
document.getElementById('titulo-juego').textContent = tituloJuego;

// Modo Hilo
document.getElementById('modo-hilo').addEventListener('click', () => {
    const container = document.getElementById('container');
    container.innerHTML = `
        <h2>Modo Hilo</h2>
    `;

    videos.forEach(video => {
        const videoElement = document.createElement('video');
        const textElement = document.createElement('p');

        videoElement.src = `juego2/${video.src}`;
        videoElement.controls = true;
        videoElement.style.display = 'block';
        videoElement.style.width = '400px';
        videoElement.style.margin = '20px 40px'; // Espaciado hacia la izquierda

        textElement.textContent = video.realizador;
        textElement.style.textAlign = 'left';
        textElement.style.marginLeft = '40px';

        container.appendChild(videoElement);
        container.appendChild(textElement);
    });
});

// Modo Expandido
document.getElementById('modo-expandido').addEventListener('click', () => {
    const container = document.getElementById('container');
    container.innerHTML = `
        <div id="expandido">
            <div id="instrucciones">
                <h2>Explora el espacio para trazar el juego</h2>
                <p><strong>Jugadores:</strong></p>
                <ul>
                    <li>1. Sofía Casarino</li>
                    <li>2. Bruno Alvarez</li>
                    <li>3. Patricio Martínez</li>
                    <li>4. Jo Céspedes y Sofía Benito</li>
                </ul>
            </div>
        </div>
    `;

    const expandido = document.getElementById('expandido');
    const usedPositions = []; // Para evitar superposición

    videos.forEach(video => {
        const videoElement = document.createElement('video');
        videoElement.src = `juego2/${video.src}`;
        videoElement.controls = false;
        videoElement.muted = false; // Audio activado
        videoElement.autoplay = false;
        videoElement.loop = true; // Reproduce en bucle
        videoElement.style.position = 'absolute';
        videoElement.style.height = '200px';
        videoElement.style.border = '1px solid white';
        videoElement.style.borderRadius = '8px';

        let x, y, isOverlapping;

        // Asegurarnos de que no se superpongan en un área más pequeña
        do {
            x = Math.random() * 2500; // Área más compacta
            y = Math.random() * 2500;
            isOverlapping = usedPositions.some(pos => {
                return Math.abs(pos.x - x) < 220 && Math.abs(pos.y - y) < 220;
            });
        } while (isOverlapping);

        usedPositions.push({ x, y }); // Guardamos la posición usada

        videoElement.style.left = `${x}px`;
        videoElement.style.top = `${y}px`;

        expandido.appendChild(videoElement);
    });

    // Detectar si el video está completamente visible en pantalla
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.play(); // Reproduce cuando aparece
                }
            });
        },
        { threshold: 1.0 } // Solo activa si el video está completamente visible
    );

    // Añadir el observador a cada video
    document.querySelectorAll('#expandido video').forEach(video => {
        observer.observe(video);
    });

    // Ajustar volumen dinámico basado en la distancia
    const adjustVolume = () => {
        const videos = document.querySelectorAll('#expandido video');
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        videos.forEach(video => {
            const rect = video.getBoundingClientRect();
            const videoCenterX = rect.left + rect.width / 2;
            const videoCenterY = rect.top + rect.height / 2;

            // Calcular distancia al centro de la pantalla
            const distance = Math.sqrt(
                Math.pow(centerX - videoCenterX, 2) +
                Math.pow(centerY - videoCenterY, 2)
            );

            // Ajustar volumen en función de la distancia
            const maxDistance = Math.sqrt(
                Math.pow(window.innerWidth, 2) +
                Math.pow(window.innerHeight, 2)
            );

            const volume = Math.max(0, 1 - distance / maxDistance); // Entre 0 y 1
            video.volume = volume;
        });
    };

    // Escuchar eventos de scroll y resize para ajustar el volumen dinámico
    window.addEventListener('scroll', adjustVolume);
    window.addEventListener('resize', adjustVolume);

    // Ajustar volumen inicial
    adjustVolume();
});
