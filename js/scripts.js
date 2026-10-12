document.addEventListener("DOMContentLoaded", () => {

    const menuButton = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".site-menu");

    if (menuButton && menu) {
        menuButton.addEventListener("click", () => {
            const isOpen = menu.classList.toggle("is-open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        menu.addEventListener("click", (event) => {
            if (event.target.closest("a")) {
                menu.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
            }
        });

        document.addEventListener("click", (event) => {
            document.querySelectorAll(".header-dropdown[open]").forEach((dropdown) => {
                if (!dropdown.contains(event.target)) dropdown.removeAttribute("open");
            });
        });

        document.querySelectorAll(".header-dropdown").forEach((dropdown) => {
            dropdown.addEventListener("toggle", () => {
                if (!dropdown.open) return;
                document.querySelectorAll(".header-dropdown[open]").forEach((other) => {
                    if (other !== dropdown) other.removeAttribute("open");
                });
            });
        });
    }

    document.querySelectorAll(".ratio video[data-src], .ratio iframe[data-src]").forEach((media) => {
        if (media instanceof HTMLVideoElement) media.controls = false;
        const loadButton = document.createElement("button");
        loadButton.className = "media-load-button";
        loadButton.type = "button";
        loadButton.innerHTML = `<span aria-hidden="true">▶</span>${document.documentElement.lang.startsWith("es") ? "Cargar y reproducir" : "Load and play"}`;
        loadButton.addEventListener("click", () => {
            media.src = media.dataset.src;
            delete media.dataset.src;
            loadButton.remove();
            if (media instanceof HTMLVideoElement) {
                media.controls = true;
                media.load();
                media.play().catch(() => {});
            }
        });
        media.parentElement.appendChild(loadButton);
    });

    document.querySelectorAll(".home-carousel").forEach((carousel) => {
        const slides = [...carousel.querySelectorAll(".carousel-slide")];
        const dotsContainer = carousel.querySelector(".carousel-dots");
        const captionNumber = carousel.querySelector(".visual-caption > span");
        if (!slides.length || !dotsContainer) return;

        let current = 0;
        let timer;
        const dots = slides.map((_, index) => {
            const dot = document.createElement("button");
            dot.className = `carousel-dot${index === 0 ? " is-active" : ""}`;
            dot.type = "button";
            dot.setAttribute("aria-label", `Show image ${index + 1}`);
            dot.addEventListener("click", () => showSlide(index));
            dotsContainer.appendChild(dot);
            return dot;
        });

        const showSlide = (index) => {
            current = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === current));
            dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === current));
            if (captionNumber) captionNumber.textContent = String(current + 1).padStart(2, "0");
            window.clearInterval(timer);
            if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                timer = window.setInterval(() => showSlide(current + 1), 5500);
            }
        };

        carousel.querySelector(".carousel-prev")?.addEventListener("click", () => showSlide(current - 1));
        carousel.querySelector(".carousel-next")?.addEventListener("click", () => showSlide(current + 1));
        carousel.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") showSlide(current - 1);
            if (event.key === "ArrowRight") showSlide(current + 1);
        });
        showSlide(0);
    });

    const revealItems = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));
});
