document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. SELECTOR DE TEMAS Y MENÚ DESPLEGABLE
    // ==========================================
    const themeDrawer = document.getElementById('theme-drawer');
    const openThemeDrawerBtn = document.getElementById('open-theme-drawer');
    const closeThemeDrawerBtn = document.getElementById('close-theme-drawer');
    const themeCards = document.querySelectorAll('.theme-card-picker');
    const bgContainer = document.getElementById('animated-bg-container');

    // Abrir menú lateral de temas
    if (openThemeDrawerBtn && themeDrawer) {
        openThemeDrawerBtn.addEventListener('click', () => {
            themeDrawer.classList.add('open');
        });
    }

    // Cerrar menú lateral de temas
    if (closeThemeDrawerBtn && themeDrawer) {
        closeThemeDrawerBtn.addEventListener('click', () => {
            themeDrawer.classList.remove('open');
        });
    }

    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', (event) => {
        if (themeDrawer && themeDrawer.classList.contains('open')) {
            const isClickInsideDrawer = themeDrawer.contains(event.target);
            const isClickOnOpenBtn = openThemeDrawerBtn.contains(event.target);
            if (!isClickInsideDrawer && !isClickOnOpenBtn) {
                themeDrawer.classList.remove('open');
            }
        }
    });

    // Función para generar elementos visuales dinámicos en el fondo
    function setupBackgroundElements(themeClass) {
        if (!bgContainer) return;
        bgContainer.innerHTML = ''; // Limpiar fondo anterior

        if (themeClass === 'theme-ocean') {
            // Crear burbujas flotantes para el tema océano
            for (let i = 0; i < 15; i++) {
                const bubble = document.createElement('div');
                bubble.classList.add('ocean-bubble');
                const size = Math.random() * 16 + 8; // Entre 8px y 24px
                bubble.style.width = `${size}px`;
                bubble.style.height = `${size}px`;
                bubble.style.left = `${Math.random() * 100}vw`;
                bubble.style.animationDuration = `${Math.random() * 6 + 4}s`;
                bubble.style.animationDelay = `${Math.random() * 5}s`;
                bgContainer.appendChild(bubble);
            }
        } else if (themeClass === 'theme-desert') {
            // Sol del desierto
            const sun = document.createElement('div');
            sun.classList.add('desert-sun');
            bgContainer.appendChild(sun);
        }
    }

    // Cambiar tema al hacer clic en las opciones del menú
    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            const selectedTheme = card.getAttribute('data-theme');

            // Remover todas las clases de temas previos del body
            document.body.className = '';

            // Si el tema seleccionado no está vacío, agregarlo
            if (selectedTheme) {
                document.body.classList.add(selectedTheme);
            }

            // Actualizar clases activas en los botones del selector
            themeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Configurar el fondo animado correspondiente
            setupBackgroundElements(selectedTheme);

            // Guardar preferencia en localStorage
            localStorage.setItem('selected_portfolio_theme', selectedTheme);
        });
    });

    // Cargar tema guardado previamente (si existe)
    const savedTheme = localStorage.getItem('selected_portfolio_theme');
    if (savedTheme !== null) {
        document.body.className = '';
        if (savedTheme) {
            document.body.classList.add(savedTheme);
        }
        themeCards.forEach(card => {
            if (card.getAttribute('data-theme') === savedTheme) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        setupBackgroundElements(savedTheme);
    } else {
        setupBackgroundElements(''); // Por defecto
    }

    // ==========================================
    // 2. ANIMACIONES AL HACER SCROLL (BIDIRECCIONAL)
    // ==========================================
    const scrollElements = document.querySelectorAll('.scroll-animate');

    const elementInView = (element, dividend = 1.25) => {
        const elementTop = element.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const elementOutofView = (element) => {
        const elementTop = element.getBoundingClientRect().top;
        return (
            elementTop > (window.innerHeight || document.documentElement.clientHeight)
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('is-visible');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('is-visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.2)) {
                displayScrollElement(el);
            } else if (elementOutofView(el)) {
                hideScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // Ejecutar una vez al cargar para mostrar elementos visibles iniciales
    handleScrollAnimation();

    // ==========================================
    // 3. CARRUSEL HORIZONTAL ARRASTRABLE (DRAG & SCROLL)
    // ==========================================
    const slider = document.getElementById('skills-carousel');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Velocidad de desplazamiento
            slider.scrollLeft = scrollLeft - walk;
        });
    }
});
