document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky navbar scroll state
    const navbar = document.querySelector('.sb-navbar');
    const syncNavbar = () => {
        if (!navbar) return;
        navbar.classList.toggle('is-scrolled', window.scrollY > 18);
    };
    syncNavbar();
    window.addEventListener('scroll', syncNavbar, { passive: true });

    // 2. Scroll reveal animations
    const revealEls = document.querySelectorAll('.reveal-up');
    if ('IntersectionObserver' in window && revealEls.length) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
        );
        revealEls.forEach((el) => observer.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    // 3. Lightbox modal for gallery & menu images
    const modalEl = document.getElementById('sbLightboxModal');
    const modalImg = document.getElementById('sbLightboxImage');
    const modalCaption = document.getElementById('sbLightboxCaption');
    const prevBtn = document.getElementById('sbLightboxPrev');
    const nextBtn = document.getElementById('sbLightboxNext');

    if (modalEl && modalImg && window.bootstrap) {
        const triggers = Array.from(document.querySelectorAll('[data-lightbox-src]'));
        const modal = new bootstrap.Modal(modalEl);
        let currentIndex = 0;

        const showIndex = (idx) => {
            if (!triggers.length) return;
            currentIndex = (idx + triggers.length) % triggers.length;
            const target = triggers[currentIndex];
            modalImg.src = target.getAttribute('data-lightbox-src') || '';
            modalImg.alt = target.getAttribute('data-lightbox-caption') || 'Saigoner Bistro';
            if (modalCaption) {
                modalCaption.textContent = target.getAttribute('data-lightbox-caption') || '';
            }
        };

        triggers.forEach((el, index) => {
            el.addEventListener('click', () => {
                showIndex(index);
                modal.show();
            });
        });

        prevBtn?.addEventListener('click', () => showIndex(currentIndex - 1));
        nextBtn?.addEventListener('click', () => showIndex(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!modalEl.classList.contains('show')) return;
            if (e.key === 'ArrowLeft') showIndex(currentIndex - 1);
            if (e.key === 'ArrowRight') showIndex(currentIndex + 1);
        });
    }

    // 4. Sync up to 4 sliding-window dots for guest reviews carousel
    const reviewCarousel = document.getElementById('sbReviewsCarousel');
    if (reviewCarousel && window.bootstrap) {
        const dotsWrap = reviewCarousel.querySelector('.sb-carousel-dots');
        const dots = Array.from(reviewCarousel.querySelectorAll('.sb-carousel-dots button'));
        const total = Number(dotsWrap?.getAttribute('data-total-slides') || dots.length);
        const maxDots = dots.length;

        const syncDots = (activeIndex) => {
            const maxStart = Math.max(0, total - maxDots);
            const windowStart = Math.min(Math.max(0, activeIndex - 2), maxStart);

            dots.forEach((btn, idx) => {
                const targetSlide = windowStart + idx;
                const isActive = targetSlide === activeIndex;
                btn.setAttribute('data-target-slide', String(targetSlide));
                btn.setAttribute('aria-label', `Anmeldelse ${targetSlide + 1}`);
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-current', isActive ? 'true' : 'false');
            });
        };

        dots.forEach((btn) => {
            btn.addEventListener('click', () => {
                const targetSlide = Number(btn.getAttribute('data-target-slide') || 0);
                bootstrap.Carousel.getOrCreateInstance(reviewCarousel).to(targetSlide);
            });
        });

        reviewCarousel.addEventListener('slide.bs.carousel', (e) => {
            syncDots(e.to);
        });
    }
});

