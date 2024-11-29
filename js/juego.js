// Detectar el ID del juego desde la URL
const pathname = window.location.pathname; // Obtiene "/juego/1" o "/juego/2"
const idJuego = pathname.split('/')[2]; // Obtiene "1" o "2"

// Configuración dinámica basada en el ID del juego
let videos = [];
let tituloJuego = '';

if (idJuego === '1') {
    tituloJuego = 'La llegada del tren a la ciudad';
    videos = [
        { src: '1. SOFIA CASARINO - LA LLEGADA DEL TREN A LA CIUDAD.MOV', realizador: 'Sofía Casarino' },
        { src: '2. BRUNO ALVAREZ - LA LLEGADA DEL TREN A LA CIUDAD.MP4', realizador: 'Bruno Alvarez' },
        { src: '3. PATRICIO MARTINEZ - LA LLEGADA DEL TREN A LA CIUDAD.mp4', realizador: 'Patricio Martínez' },
        { src: '4. JO CESPEDES Y SOFIA BENITO - LA LLEGADA DEL TREN A LA CIUDAD.mp4', realizador: 'Jo Céspedes y Sofía Benito' },
    ];
} else if (idJuego === '2') {
    tituloJuego = 'Encuadrar una multitud';
    videos = [
        { src: '1. SOFIA CASARINO - ENCUADRAR UNA MULTITUD.mp4', realizador: 'Sofía Casarino' },
        { src: '2. BRUNO ALVAREZ - ENCUADRAR UNA MULTITUD.mov', realizador: 'Bruno Alvarez' },
        { src: '3. PATRICIO MARTINEZ - ENCUADRAR UNA MULTITUD.mp4', realizador: 'Patricio Martínez' },
        { src: '4. JO CESPEDES - ENCUADRAR UNA MULTITUD.mp4', realizador: 'Jo Céspedes y Sofía Benito' },
    ];
} else {
    tituloJuego = 'Juego no encontrado';
}

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

        videoElement.src = `/juego${idJuego}/${video.src}`;
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
                    <li>4. Jo Céspedes</li>
                    <li>5. Emiliano Urbina</li>
                    <li>6. Vicente Meza</li>
                </ul>
            </div>
        </div>
    `;

    const expandido = document.getElementById('expandido');
    const usedPositions = [];
    const margin = 100; // Margen mínimo desde los bordes
    const areaWidth = 3000; // Ancho total del área
    const areaHeight = 3000; // Alto total del área

    videos.forEach(video => {
        const videoElement = document.createElement('video');
        videoElement.src = `juego2/${video.src}`;
        videoElement.controls = false;
        videoElement.muted = false;
        videoElement.autoplay = false;
        videoElement.loop = true;
        videoElement.style.position = 'absolute';
        videoElement.style.height = '200px'; // Fija la altura
        videoElement.style.width = 'auto'; // Ajusta el ancho automáticamente
        videoElement.style.objectFit = 'contain'; // Asegura que el video no se recorte
        videoElement.style.border = '1px solid white';
        videoElement.style.borderRadius = '0';

        let x, y, isOverlapping, isInBounds;

        do {
            x = Math.random() * (areaWidth - 2 * margin - 201) + margin; // Ajuste dinámico
            y = Math.random() * (areaHeight - 2 * margin - 201) + margin;

            // Validar si está dentro de los límites del contenedor
            isInBounds = x >= margin && x + 200 <= areaWidth - margin;

            // Verificar si se superpone con otros elementos
            isOverlapping = usedPositions.some(pos => {
                return Math.abs(pos.x - x) < 220 && Math.abs(pos.y - y) < 220;
            });
        } while (!isInBounds || isOverlapping);

        usedPositions.push({ x, y });

        videoElement.style.left = `${x}px`;
        videoElement.style.top = `${y}px`;

        expandido.appendChild(videoElement);
    });

    // Detectar si el video está completamente visible en pantalla
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.play();
                }
            });
        },
        { threshold: 1.0 }
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

            const maxDistance = Math.sqrt(
                Math.pow(window.innerWidth, 2) +
                Math.pow(window.innerHeight, 2)
            );

            const volume = Math.max(0, 1 - distance / maxDistance);
            video.volume = volume;
        });
    };

    window.addEventListener('scroll', adjustVolume);
    window.addEventListener('resize', adjustVolume);

    adjustVolume();
});
