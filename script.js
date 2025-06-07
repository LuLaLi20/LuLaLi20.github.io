document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeColorMeta = document.getElementById('themeColorMeta');

    const iconSun = `<svg viewBox="0 0 24 24"><path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.45 16,14.73V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.73C6.19,13.45 5,11.38 5,9A7,7 0 0,1 12,2M3.5,10.5L4.91,11.14C4.46,11.9 4.18,12.74 4.08,13.61L2.5,14.03V10.5M21.5,10.5V14.03L19.92,13.61C19.82,12.74 19.54,11.9 19.09,11.14L20.5,10.5M12,5A4,4 0 0,0 8,9C8,10.76 8.84,12.24 10.12,13.09V16H13.88V13.09C15.16,12.24 16,10.76 16,9A4,4 0 0,0 12,5M7.91,6.08L6.5,5.4L7.5,4H10.33L11.05,2.55L12,2L12.95,2.55L13.67,4H16.5L17.5,5.4L16.09,6.08C15.34,5.54 14.47,5.18 13.5,5.08L12.97,3.5H11.03L10.5,5.08C9.53,5.18 8.66,5.54 7.91,6.08Z" /></svg>`; // Sol
    const iconMoon = `<svg viewBox="0 0 24 24"><path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.2 6.21,3.88C6.96,3.35 8.13,4.2 8.05,5.04C7.5,10.27 9.66,15.26 14.19,17.44C16.35,18.5 18.8,18.39 18.97,15.95Z" /></svg>`; // Luna

    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-theme');
            themeToggle.innerHTML = iconMoon;
            themeToggle.setAttribute('aria-label', 'Cambiar a tema oscuro');
            themeColorMeta.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--theme-color-meta-light').trim());
        } else { // 'dark'
            body.classList.remove('light-theme');
            themeToggle.innerHTML = iconSun;
            themeToggle.setAttribute('aria-label', 'Cambiar a tema claro');
            themeColorMeta.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--theme-color-meta-dark').trim());
        }
    }

    // Establecer tema oscuro por defecto al cargar la página.
    applyTheme('dark');

    themeToggle.addEventListener('click', () => {
        let newTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
        applyTheme(newTheme);
    });

    // Actualizar año en el footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Scroll suave y active link para navegación
    const navLinks = document.querySelectorAll('nav .nav-links a');
    const headerHeight = document.querySelector('header').offsetHeight;

    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                    // Cierra el menú móvil al hacer clic en un enlace
                    if(document.getElementById('navLinks').classList.contains('active')) {
                        document.getElementById('navLinks').classList.remove('active');
                    }
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Menú hamburguesa
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNavLinks = document.getElementById('navLinks');
    mobileMenuBtn.addEventListener('click', () => {
        mainNavLinks.classList.toggle('active');
    });
});
