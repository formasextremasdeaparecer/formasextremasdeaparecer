
const tituloJuego = 'Encuadrar una multitud';
const videos = [
    { src: '1. SOFIA CASARINO - ENCUADRAR UNA MULTITUD.mp4', realizador: 'Sofía Casarino' },
    { src: '2. Bruno Alvarez - Encuadrar Una Multitud.mp4', realizador: 'Bruno Alvarez' },
    { src: '3. PATRICIO MARTINEZ - ENCUADRAR UNA MULTITUD.mp4', realizador: 'Patricio Martínez' },
    { src: '4. Jo Cespedes - Encuadrar Una Multitud.mp4', realizador: 'Jo Céspedes' },
    { src: '5. ANÓNIMO 1 - ENCUADRAR UNA MULTITUD.MOV', realizador: 'Emiliano Urbina'},
    { src: '6. Anónimo 2 - Encuadrar Una Multitud.mp4', realizador: 'Vicente Meza'},
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
        textElement.style.textAlign = 'right';
        textElement.style.marginRight = '1026.6px'; // Controlar la distancia de alineación hacia la derecha
        textElement.style.marginTop = '-10px'; // Reducir la distancia hacia arriba
        textElement.style.fontSize = '14px'; // Tamaño de letra ajustado

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
                    <li>4. Jo Céspedes</li>
                    <li>5. Emiliano Urbina</li>
                    <li>6. Vicente Meza</li>
                </ul>
            </div>
        </div>
    `;

    const expandido = document.getElementById('expandido');
    const usedPositions = []; // Para evitar superposición
    const margin = 100; // Margen mínimo desde los bordes
    const areaWidth = 3000; // Ancho total del área
    const areaHeight = 3000; // Alto total del área

    // Define la zona de exclusión
    const exclusionZone = {
        x: 0, // Posición X inicial
        y: 0, // Posición Y inicial
        width: 500, // Ancho del área de exclusión
        height: 400 // Altura del área de exclusión
    };

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
        videoElement.style.borderRadius = '0'; // Esquinas cuadradas

        let x, y, isOverlapping, isInExclusionZone;

        do {
            // Ajustar las coordenadas para incluir el margen y evitar las orillas
            x = Math.random() * (areaWidth - 2 * margin - 201) + margin; // 200 es el ancho del video
            y = Math.random() * (areaHeight - 2 * margin - 201) + margin; // 200 es la altura del video
        
            // Verificar si está en la zona de exclusión
            isInExclusionZone = (
                x >= exclusionZone.x &&
                x <= exclusionZone.x + exclusionZone.width &&
                y >= exclusionZone.y &&
                y <= exclusionZone.y + exclusionZone.height
            );
        
            // Verificar si está superponiéndose con otros videos
            isOverlapping = usedPositions.some(pos => {
                return Math.abs(pos.x - x) < 220 && Math.abs(pos.y - y) < 220;
            });
        
        } while (isOverlapping || isInExclusionZone); // Repetir si se superpone o está en la zona de exclusión
        
        

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

document.getElementById('volver-index').addEventListener('click', () => {
    window.location.href = '../index.html'; // Cambia a la página de inicio
});

