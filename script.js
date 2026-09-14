document.addEventListener('DOMContentLoaded', () => {
    // 1. Observer para animaciones de entrada en Scroll
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(section => {
        observer.observe(section);
    });

    // 2. Panel Desplegable de Temas (Drawer)
    const themeMenuBtn = document.getElementById('theme-menu-btn');
    const themeDrawer = document.getElementById('theme-picker-drawer');
    const closeDrawerBtn = document.getElementById('close-theme-drawer');
    const themeCards = document.querySelectorAll('.theme-card-picker');
    const bgContainer = document.getElementById('animated-bg-container');

    if (themeMenuBtn && themeDrawer) {
        themeMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDrawer.classList.toggle('open');
        });
    }

    if (closeDrawerBtn && themeDrawer) {
        closeDrawerBtn.addEventListener('click', () => {
            themeDrawer.classList.remove('open');
        });
    }

    // Cerrar el drawer si se hace clic fuera de él
    document.addEventListener('click', (e) => {
        if (themeDrawer && themeDrawer.classList.contains('open')) {
            if (!themeDrawer.contains(e.target) && !themeMenuBtn.contains(e.target)) {
                themeDrawer.classList.remove('open');
            }
        }
    });

    // Cargar tema guardado en localStorage
    const savedTheme = localStorage.getItem('selected-theme') || 'dark-classic';
    applyTheme(savedTheme);

    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            const themeName = card.getAttribute('data-theme');
            applyTheme(themeName);
            localStorage.setItem('selected-theme', themeName);
            themeDrawer.classList.remove('open');
        });
    });

    function applyTheme(theme) {
        document.body.className = '';
        if (theme !== 'dark-classic') {
            document.body.classList.add(`theme-${theme}`);
        }

        if (bgContainer) {
            bgContainer.innerHTML = '';
            if (theme === 'ocean') {
                let bubbles = '';
                for (let i = 0; i < 15; i++) {
                    const left = Math.random() * 100;
                    const size = 6 + Math.random() * 18;
                    const delay = Math.random() * 5;
                    const duration = 6 + Math.random() * 6;
                    bubbles += `<div class="ocean-bubble" style="left:${left}%; width:${size}px; height:${size}px; animation-delay:${delay}s; animation-duration:${duration}s;"></div>`;
                }
                bgContainer.innerHTML = bubbles;
            } else if (theme === 'desert') {
                bgContainer.innerHTML = '<div class="desert-sun"></div>';
            }
        }

        themeCards.forEach(card => {
            if (card.getAttribute('data-theme') === theme) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    // 3. Carrusel Continuo y Arrastrable de Habilidades
    const track = document.getElementById('carousel-track');
    if (track) { 
        track.innerHTML += track.innerHTML + track.innerHTML; 

        let currentX = 0;
        let speed = 0.8;
        let isDragging = false;
        let startXCoord = 0;
        let previousX = 0;

        function getSingleWidth() { 
            return track.scrollWidth / 3; 
        }

        function step() {
            if (!isDragging) {
                currentX -= speed;
                let singleWidth = getSingleWidth();
                if (Math.abs(currentX) >= singleWidth) {
                    currentX += singleWidth;
                }
            }
            track.style.transform = `translateX(${currentX}px)`;
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);

        const slider = document.getElementById('draggable-carousel');
        if (slider) {
            slider.addEventListener('mousedown', e => { 
                isDragging = true; 
                startXCoord = e.pageX; 
                previousX = currentX; 
            });

            window.addEventListener('mousemove', e => {
                if (!isDragging) return;
                currentX = previousX + (e.pageX - startXCoord);
                let singleWidth = getSingleWidth();
                if (Math.abs(currentX) >= singleWidth * 2) { 
                    currentX = -singleWidth; 
                    previousX = currentX; 
                    startXCoord = e.pageX; 
                } else if (currentX > 0) {
                    currentX = -singleWidth;
                    previousX = currentX;
                    startXCoord = e.pageX;
                }
            });

            window.addEventListener('mouseup', () => { 
                isDragging = false; 
            });

            slider.addEventListener('touchstart', e => { 
                isDragging = true; 
                startXCoord = e.touches[0].clientX; 
                previousX = currentX; 
            });

            window.addEventListener('touchmove', e => {
                if (!isDragging) return;
                currentX = previousX + (e.touches[0].clientX - startXCoord);
                let singleWidth = getSingleWidth();
                if (Math.abs(currentX) >= singleWidth * 2) { 
                    currentX = -singleWidth; 
                    previousX = currentX; 
                    startXCoord = e.touches[0].clientX; 
                }
            });

            window.addEventListener('touchend', () => { 
                isDragging = false; 
            });
        }
    }
});
