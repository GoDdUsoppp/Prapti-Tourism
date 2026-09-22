// Prapti Tourism Scripts
document.addEventListener("DOMContentLoaded", () => {
    console.log("Prapti Tourism initialized");

    const cities = ["Kyoto", "Kerala", "the Alps", "Bali", "Santorini", "Tokyo"];
    let currentIndex = 0;
    const cityElement = document.getElementById("dynamic-city");

    if (cityElement) {
        setInterval(() => {
            // Slide up out of view
            cityElement.style.transform = "translateY(-100%)";
            
            setTimeout(() => {
                // Instantly move to bottom (hidden)
                cityElement.style.transition = "none";
                cityElement.style.transform = "translateY(100%)";
                
                // Change text
                currentIndex = (currentIndex + 1) % cities.length;
                cityElement.textContent = cities[currentIndex];
                
                // Force reflow
                void cityElement.offsetWidth;
                
                // Slide up to center
                cityElement.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
                cityElement.style.transform = "translateY(0)";
            }, 500); // Wait for slide out to complete
        }, 3000);
    }

    // Vertical Ticker Logic
    const ticker = document.getElementById("review-ticker");
    const wrapper = document.getElementById("ticker-wrapper");
    
    if (ticker && wrapper) {
        const updateHeight = () => {
            if (ticker.children.length >= 3) {
                // gap-5 is 20px
                const gap = 20; 
                const h1 = ticker.children[0].offsetHeight;
                const h2 = ticker.children[1].offsetHeight;
                const h3 = ticker.children[2].offsetHeight;
                wrapper.style.height = (h1 + h2 + h3 + gap * 2) + "px";
            }
        };

        // Initialize height
        updateHeight();
        // Update on resize
        window.addEventListener('resize', updateHeight);

        setInterval(() => {
            const firstCard = ticker.children[0];
            const gap = 20; // gap-5 is 20px
            const cardHeight = firstCard.offsetHeight + gap;
            
            // Slide up
            ticker.style.transition = "transform 0.5s ease-in-out";
            ticker.style.transform = `translateY(-${cardHeight}px)`;
            
            setTimeout(() => {
                // Move first element to the end to loop
                ticker.appendChild(firstCard);
                
                // Instantly reset transform
                ticker.style.transition = "none";
                ticker.style.transform = "translateY(0)";
                
                // Update wrapper height for the new set of 3 cards
                updateHeight();
            }, 500); // Wait for transition to finish
        }, 3500); // Slide every 3.5 seconds
    }

    // Odometer initialization
    setTimeout(() => {
        const odometers = document.querySelectorAll('.odometer');
        odometers.forEach(el => {
            const val = el.getAttribute('data-val');
            if(val) el.innerHTML = val;
        });
    }, 500); // Slight delay for dramatic effect on load

    // Pill Navigation & Carousel Logic
    const pillDomestic = document.getElementById('pill-domestic');
    const pillInternational = document.getElementById('pill-international');
    const carouselDomestic = document.getElementById('carousel-domestic');
    const carouselInternational = document.getElementById('carousel-international');
    const btnLeft = document.getElementById('scroll-left');
    const btnRight = document.getElementById('scroll-right');

    let activeCarousel = carouselDomestic;

    if (pillDomestic && pillInternational && carouselDomestic && carouselInternational) {
        
        const activeStyles = ['bg-blue-600', 'text-white', 'shadow-md'];
        const inactiveStyles = ['text-gray-600', 'hover:text-gray-900', 'bg-transparent'];

        pillDomestic.addEventListener('click', () => {
            carouselDomestic.classList.remove('hidden');
            carouselInternational.classList.add('hidden');
            activeCarousel = carouselDomestic;
            
            pillDomestic.classList.remove(...inactiveStyles);
            pillDomestic.classList.add(...activeStyles);
            
            pillInternational.classList.remove(...activeStyles);
            pillInternational.classList.add(...inactiveStyles);
        });

        pillInternational.addEventListener('click', () => {
            carouselInternational.classList.remove('hidden');
            carouselDomestic.classList.add('hidden');
            activeCarousel = carouselInternational;
            
            pillInternational.classList.remove(...inactiveStyles);
            pillInternational.classList.add(...activeStyles);
            
            pillDomestic.classList.remove(...activeStyles);
            pillDomestic.classList.add(...inactiveStyles);
        });

        if(btnLeft && btnRight) {
            btnRight.addEventListener('click', () => {
                if (activeCarousel && activeCarousel.firstElementChild) {
                    const cardWidth = activeCarousel.firstElementChild.offsetWidth;
                    const gap = 24; // 1.5rem (gap-6)
                    activeCarousel.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
                }
            });
            btnLeft.addEventListener('click', () => {
                if (activeCarousel && activeCarousel.firstElementChild) {
                    const cardWidth = activeCarousel.firstElementChild.offsetWidth;
                    const gap = 24;
                    activeCarousel.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
                }
            });
        }

        function setupInfiniteCarousel(carousel) {
            if (!carousel || carousel.children.length === 0) return;

            const originalCardsCount = carousel.children.length;
            const originalHtml = carousel.innerHTML;
            // Create 3 identical copies for seamless infinite scrolling
            carousel.innerHTML = originalHtml + originalHtml + originalHtml;

            const getCopyWidth = () => {
                if (carousel.children.length === 0) return 0;
                const cardWidth = carousel.firstElementChild.offsetWidth;
                const gap = 24; // 1.5rem
                return originalCardsCount * (cardWidth + gap);
            };

            const performJump = () => {
                const copyWidth = getCopyWidth();
                if (copyWidth === 0) return;

                // If scrolled into the first copy, jump forward to the middle copy
                if (carousel.scrollLeft < copyWidth) {
                    carousel.style.scrollSnapType = 'none';
                    carousel.scrollLeft += copyWidth;
                    void carousel.offsetWidth; // Force reflow
                    carousel.style.scrollSnapType = '';
                } 
                // If scrolled into the third copy, jump back to the middle copy
                else if (carousel.scrollLeft >= copyWidth * 2) {
                    carousel.style.scrollSnapType = 'none';
                    carousel.scrollLeft -= copyWidth;
                    void carousel.offsetWidth; // Force reflow
                    carousel.style.scrollSnapType = '';
                }
            };

            // Initial setup: jump to the middle copy
            setTimeout(() => {
                const copyWidth = getCopyWidth();
                carousel.style.scrollSnapType = 'none';
                carousel.scrollLeft = copyWidth;
                void carousel.offsetWidth;
                carousel.style.scrollSnapType = '';
            }, 150);

            // Debounced scroll listener to perform seamless jumps when scrolling stops
            let scrollTimeout;
            carousel.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    performJump();
                }, 150);
            });
        }

        // Initialize infinite carousels
        setupInfiniteCarousel(carouselDomestic);
        setupInfiniteCarousel(carouselInternational);

        // Auto scroll every 5 seconds (continuous loop)
        setInterval(() => {
            if (activeCarousel && activeCarousel.firstElementChild) {
                const cardWidth = activeCarousel.firstElementChild.offsetWidth;
                const gap = 24;
                activeCarousel.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
            }
        }, 5000);
    }
});

// 3D Horizontal Scroll Logic
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('horizontal-scroll-track');
    const container = document.getElementById('cards-container');
    const cards = document.querySelectorAll('.card-3d');

    if (track && container && cards.length > 0) {
        function update3DCarousel() {
            const trackRect = track.getBoundingClientRect();
            const maxScroll = trackRect.height - window.innerHeight;
            let scrollY = -trackRect.top;
            
            if (scrollY < 0) scrollY = 0;
            if (scrollY > maxScroll) scrollY = maxScroll;
            
            // If the track is completely out of view, we don't need to do expensive calculations
            if (-trackRect.top > trackRect.height || trackRect.top > window.innerHeight) {
                return;
            }
            
            const progress = scrollY / maxScroll;
            
            cards.forEach((card, i) => {
                // How far is this card from the currently focused index?
                const dist = i - (progress * (cards.length - 1));
                const absDist = Math.abs(dist);
                
                // We return to the PURE 3D CYLINDER. 
                // This is the ONLY mathematical way to guarantee the top and bottom edges of the cards
                // form a flawless, continuous, non-jagged arc. Individual scaling breaks the arc.
                
                // 24 degrees per card makes them wrap very deeply towards the sides
                const rotateY = dist * -24; 
                
                // A much tighter radius (-900) ensures they stay close together even with the sharp angle
                const radius = -900; 
                
                // Scale up the entire projection globally to counter the extreme perspective below
                const globalScale = 2.6;
                
                // Apply pure 3D transforms
                card.style.transform = `scale(${globalScale}) rotateY(${rotateY}deg) translateZ(${radius}px)`;
                
                // Set the container perspective to an EXTREME wide-angle lens (350px).
                // Mathematical proof: this forces the edge cards (which are closer) to appear 
                // up to 200% larger than the center card, fulfilling exactly what you want!
                const viewport = document.getElementById('sticky-viewport');
                if (viewport) viewport.style.perspective = '350px';
                
                // Smooth opacity fade
                card.style.opacity = Math.max(0.1, 1 - (absDist * 0.15));
                
                // In a pure cylinder, Z-index is handled natively by the browser's 3D engine!
                // But we can help it by prioritizing cards closer to the center
                card.style.zIndex = Math.round(100 - absDist * 10);
            });
        }

        window.addEventListener('scroll', update3DCarousel, { passive: true });
        window.addEventListener('resize', update3DCarousel);
        
        // Initial setup
        requestAnimationFrame(update3DCarousel);
    }
});
