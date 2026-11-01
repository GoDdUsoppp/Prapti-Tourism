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
            if (val) el.innerHTML = val;
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

        if (btnLeft && btnRight) {
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
    // Navbar Scroll & Transparency Logic
    const navbar = document.getElementById('navbar');
    const heroVideo = document.getElementById('hero-video');

    if (navbar) {
        const updateNavbar = () => {
            if (window.scrollY > 40) {
                navbar.classList.add('nav-scrolled');
                navbar.classList.remove('nav-transparent');
            } else {
                navbar.classList.add('nav-transparent');
                navbar.classList.remove('nav-scrolled');
            }
        };

        window.addEventListener('scroll', updateNavbar, { passive: true });
        updateNavbar();
    }

    // Video Autoplay Guarantee
    if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.defaultMuted = true;
        heroVideo.setAttribute('playsinline', '');
        heroVideo.setAttribute('webkit-playsinline', '');

        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                const startPlay = () => {
                    heroVideo.play();
                    window.removeEventListener('click', startPlay);
                    window.removeEventListener('touchstart', startPlay);
                    window.removeEventListener('scroll', startPlay);
                };
                window.addEventListener('click', startPlay, { once: true });
                window.addEventListener('touchstart', startPlay, { once: true });
                window.addEventListener('scroll', startPlay, { once: true });
            });
        }
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Initialize Swiper for Global Showcase
    if (document.querySelector('.mySwiper')) {
        window.internationalSwiper = new Swiper('.mySwiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',

            initialSlide: 1,
            loopedSlides: 6, // Ensures enough slides are cloned for both sides
            coverflowEffect: {
                rotate: 20,
                stretch: 0,
                depth: 250,
                modifier: 1,
                slideShadows: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            loop: true
        });
    }

    // Stats Section Odometer Animation
    const statsSection = document.querySelector('.stats-section');
    const odometerElements = document.querySelectorAll('.odometer-stat');

    if (statsSection && odometerElements.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    odometerElements.forEach(el => {
                        const target = parseFloat(el.getAttribute('data-val'));
                        // Check if it's a decimal number to format appropriately
                        const format = target % 1 !== 0 ? '(,ddd).d' : '(,ddd)';

                        const od = new Odometer({
                            el: el,
                            value: 0,
                            format: format,
                            theme: 'default'
                        });
                        setTimeout(() => {
                            od.update(target);
                        }, 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -100px 0px' });

        statsObserver.observe(statsSection);
    }
});

// Smart Navbar Logic
document.addEventListener('DOMContentLoaded', () => {
    let lastScrollY = window.scrollY;
    const navbar = document.getElementById('navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                // Scroll down -> Hide navbar
                navbar.classList.add('-translate-y-full');
            } else {
                // Scroll up -> Show navbar
                navbar.classList.remove('-translate-y-full');
            }
            lastScrollY = window.scrollY;
        }, { passive: true });
    }
});
// Smooth scrolling for menubar links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;

            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                e.preventDefault();
                // Offset for fixed navbar
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});


// Sticky Hero Curtain Overlay & Parallax Fade Effect
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('hero');
    const heroContent = document.querySelector('#hero .relative.z-20');
    const heroExplore = document.querySelector('#hero a[href="#about"]') || document.querySelector('#hero a[href="#services"]');
    const heroVideo = document.getElementById('hero-video');

    if (heroSection) {
        let isTicking = false;

        const onScroll = () => {
            const scrollY = window.scrollY;
            const vh = window.innerHeight;

            if (scrollY <= vh) {
                const progress = Math.min(1, Math.max(0, scrollY / (vh * 0.85)));
                
                // Gently fade and translate hero text upward
                if (heroContent) {
                    heroContent.style.opacity = (1 - progress * 1.3).toFixed(3);
                    heroContent.style.transform = `translate3d(0, ${-(progress * 55).toFixed(1)}px, 0)`;
                }
                
                // Fade out explore indicator quickly
                if (heroExplore) {
                    heroExplore.style.opacity = (1 - progress * 2.2).toFixed(3);
                }

                // Subtle video scale and brightness dim for rich cinematic depth
                if (heroVideo) {
                    heroVideo.style.transform = `scale(${(1 + progress * 0.04).toFixed(3)})`;
                    heroVideo.style.filter = `brightness(${(1 - progress * 0.35).toFixed(2)})`;
                    if (heroVideo.paused) {
                        heroVideo.play().catch(() => {});
                    }
                }
            } else {
                // When completely covered by the overlay content, pause video to save GPU/CPU
                if (heroVideo && !heroVideo.paused) {
                    heroVideo.pause();
                }
            }

            isTicking = false;
        };

        window.addEventListener('scroll', () => {
            if (!isTicking) {
                requestAnimationFrame(onScroll);
                isTicking = true;
            }
        }, { passive: true });

        // Initial call
        onScroll();
    }
});

// Destinations Carousel Controls & Live Counter with Fluid Smooth Scrolling & Dragging
document.addEventListener('DOMContentLoaded', () => {
    function setupCarousel(carouselId, prevBtnClass, nextBtnClass, counterSelector) {
        const carousel = document.getElementById(carouselId);
        const prevBtn = document.querySelector(prevBtnClass);
        const nextBtn = document.querySelector(nextBtnClass);
        const counter = counterSelector ? document.querySelector(counterSelector) : null;

        if (!carousel) return;

        const getScrollStep = () => {
            const firstCard = carousel.querySelector('.destination-card, .review-card') || carousel.firstElementChild;
            return firstCard ? firstCard.offsetWidth + 24 : 380;
        };

        // Custom smooth scroll animation for 100% fluid easing
        const smoothScrollTo = (targetLeft) => {
            const start = carousel.scrollLeft;
            const distance = targetLeft - start;
            const duration = 400; // ms
            const startTime = performance.now();
            const easeOutCubic = t => (--t) * t * t + 1;

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                carousel.scrollLeft = start + distance * easeOutCubic(progress);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    updateState();
                }
            };
            requestAnimationFrame(animate);
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const step = getScrollStep();
                smoothScrollTo(carousel.scrollLeft - step);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const step = getScrollStep();
                smoothScrollTo(carousel.scrollLeft + step);
            });
        }

        // Mouse Drag to Scroll
        let isDown = false;
        let startX = 0;
        let scrollStart = 0;
        let hasMoved = false;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            hasMoved = false;
            carousel.classList.add('cursor-grabbing');
            carousel.classList.remove('cursor-grab');
            startX = e.pageX - carousel.offsetLeft;
            scrollStart = carousel.scrollLeft;
        });

        window.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                carousel.classList.remove('cursor-grabbing');
                carousel.classList.add('cursor-grab');
            }
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 1.5;
            if (Math.abs(walk) > 5) hasMoved = true;
            carousel.scrollLeft = scrollStart - walk;
        });

        // Prevent link activation when dragging
        carousel.addEventListener('click', (e) => {
            if (hasMoved) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);

        const updateState = () => {
            const step = getScrollStep();
            const totalCards = carousel.querySelectorAll('.destination-card, .review-card').length || carousel.children.length || 6;
            const activeIndex = Math.min(totalCards, Math.max(1, Math.round(carousel.scrollLeft / step) + 1));

            if (counter) {
                counter.textContent = String(activeIndex).padStart(2, '0');
            }

            if (prevBtn) {
                prevBtn.disabled = carousel.scrollLeft <= 10;
            }
            if (nextBtn) {
                const maxScroll = carousel.scrollWidth - carousel.clientWidth - 15;
                nextBtn.disabled = carousel.scrollLeft >= maxScroll;
            }
        };

        carousel.addEventListener('scroll', updateState, { passive: true });
        window.addEventListener('resize', updateState, { passive: true });
        setTimeout(updateState, 200);
    }

    setupCarousel('domestic-carousel', '.domestic-prev', '.domestic-next', '#domestic .carousel-counter-current');
    setupCarousel('intl-carousel', '.intl-prev', '.intl-next', '#international .carousel-counter-current');
    setupInfiniteReviewsCarousel();
    
});

// Dedicated Infinite Seamless Reviews Carousel
function setupInfiniteReviewsCarousel() {
    const carousel = document.getElementById('reviews-carousel');
    const prevBtn = document.querySelector('.reviews-prev');
    const nextBtn = document.querySelector('.reviews-next');

    if (!carousel) return;

    // Remove any interfering scroll classes
    carousel.classList.remove('scroll-smooth');

    const originalCards = Array.from(carousel.children);
    if (originalCards.length === 0) return;

    const originalCount = originalCards.length;
    
    // Triple clone cards for true seamless infinite loop: [Copy 1] [Copy 2 (Active)] [Copy 3]
    const originalHtml = carousel.innerHTML;
    carousel.innerHTML = originalHtml + originalHtml + originalHtml;

    const getCardWidth = () => {
        const first = carousel.firstElementChild;
        return first ? first.offsetWidth + 24 : 360;
    };

    const getSingleSetWidth = () => originalCount * getCardWidth();

    // Position carousel in middle set initially
    let isInitialized = false;
    const centerCarousel = () => {
        const setWidth = getSingleSetWidth();
        if (setWidth > 0) {
            carousel.scrollLeft = setWidth;
            isInitialized = true;
        }
    };

    setTimeout(centerCarousel, 120);
    window.addEventListener('resize', () => {
        centerCarousel();
    }, { passive: true });

    // Boundary check: if scrolled too far left or right, silently jump back to middle set
    let isJumping = false;
    const checkLoopBoundaries = () => {
        if (isJumping) return;
        const setWidth = getSingleSetWidth();
        if (setWidth === 0) return;

        // If in Copy 1, silently jump forward to Copy 2
        if (carousel.scrollLeft < setWidth * 0.4) {
            isJumping = true;
            carousel.scrollLeft += setWidth;
            setTimeout(() => { isJumping = false; }, 50);
        }
        // If in Copy 3, silently jump back to Copy 2
        else if (carousel.scrollLeft >= setWidth * 1.8) {
            isJumping = true;
            carousel.scrollLeft -= setWidth;
            setTimeout(() => { isJumping = false; }, 50);
        }
    };

    let boundaryTimer;
    carousel.addEventListener('scroll', () => {
        clearTimeout(boundaryTimer);
        boundaryTimer = setTimeout(checkLoopBoundaries, 120);
    }, { passive: true });

    // Smooth Next Button: scrolls to next card; seamlessly loops forever
    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            checkLoopBoundaries();
            const step = getCardWidth();
            carousel.scrollBy({ left: step, behavior: 'smooth' });
        });
    }

    // Smooth Prev Button: scrolls to prev card; seamlessly loops forever
    if (prevBtn) {
        prevBtn.disabled = false;
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            checkLoopBoundaries();
            const step = getCardWidth();
            carousel.scrollBy({ left: -step, behavior: 'smooth' });
        });
    }

    // Drag-to-Scroll support
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let hasMoved = false;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        hasMoved = false;
        carousel.classList.add('cursor-grabbing');
        carousel.classList.remove('cursor-grab');
        startX = e.pageX - carousel.offsetLeft;
        scrollStart = carousel.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
        if (isDown) {
            isDown = false;
            carousel.classList.remove('cursor-grabbing');
            carousel.classList.add('cursor-grab');
            checkLoopBoundaries();
        }
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.4;
        if (Math.abs(walk) > 5) hasMoved = true;
        carousel.scrollLeft = scrollStart - walk;
    });

    carousel.addEventListener('click', (e) => {
        if (hasMoved) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
}


// Trip Enquiry Form, Searchable Destination Dropdown & WhatsApp Inquiry Logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Traveller Count Stepper
    const minusBtn = document.getElementById('traveller-minus');
    const plusBtn = document.getElementById('traveller-plus');
    const display = document.getElementById('traveller-count-display');
    const hiddenInput = document.getElementById('enquiry-travellers');
    const form = document.getElementById('trip-enquiry-form');
    const successMsg = document.getElementById('enquiry-success-msg');
    const submitBtn = document.getElementById('enquiry-submit-btn');

    let count = 2;

    if (minusBtn && plusBtn && display && hiddenInput) {
        minusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (count > 1) {
                count--;
                display.textContent = count;
                hiddenInput.value = count;
            }
        });

        plusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (count < 30) {
                count++;
                display.textContent = count;
                hiddenInput.value = count;
            }
        });
    }

    // 2. Searchable Preferred Destination Dropdown
    const destWrapper = document.getElementById('destination-dropdown-wrapper');
    const destTrigger = document.getElementById('destination-trigger');
    const destSelectedText = document.getElementById('destination-selected-text');
    const destChevron = document.getElementById('destination-chevron');
    const destMenu = document.getElementById('destination-menu');
    const destSearchInput = document.getElementById('destination-search-input');
    const destSearchClear = document.getElementById('destination-search-clear');
    const destHiddenInput = document.getElementById('enquiry-destination');
    const destOptions = document.querySelectorAll('.destination-option');
    const destCategoryHeaders = document.querySelectorAll('.destination-category-header');
    const destNoResults = document.getElementById('destination-no-results');
    const destSearchTerm = document.getElementById('destination-search-term');

    function openDestinationMenu() {
        if (!destMenu) return;
        closeTripMenu();
        destMenu.classList.remove('hidden');
        if (destChevron) destChevron.classList.add('rotate-180');
        if (destTrigger) destTrigger.classList.add('border-accent', 'ring-2', 'ring-accent/20');
        if (destSearchInput) {
            setTimeout(() => destSearchInput.focus(), 50);
        }
    }

    function closeDestinationMenu() {
        if (!destMenu) return;
        destMenu.classList.add('hidden');
        if (destChevron) destChevron.classList.remove('rotate-180');
        if (destTrigger) destTrigger.classList.remove('ring-2', 'ring-accent/20');
    }

    if (destTrigger && destMenu) {
        destTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (destMenu.classList.contains('hidden')) {
                openDestinationMenu();
            } else {
                closeDestinationMenu();
            }
        });

        // Search Filter Logic
        if (destSearchInput) {
            destSearchInput.addEventListener('input', () => {
                const query = destSearchInput.value.toLowerCase().trim();
                let matchCount = 0;

                if (destSearchClear) {
                    if (query.length > 0) {
                        destSearchClear.classList.remove('hidden');
                    } else {
                        destSearchClear.classList.add('hidden');
                    }
                }

                destOptions.forEach(opt => {
                    const val = (opt.getAttribute('data-value') || '').toLowerCase();
                    const cat = (opt.getAttribute('data-category') || '').toLowerCase();
                    if (!query || val.includes(query) || cat.includes(query)) {
                        opt.classList.remove('hidden');
                        matchCount++;
                    } else {
                        opt.classList.add('hidden');
                    }
                });

                // Show/hide category headers based on whether any children are visible
                destCategoryHeaders.forEach(header => {
                    if (!query) {
                        header.classList.remove('hidden');
                    } else {
                        let hasVisible = false;
                        let next = header.nextElementSibling;
                        while (next && !next.classList.contains('destination-category-header')) {
                            if (next.classList.contains('destination-option') && !next.classList.contains('hidden')) {
                                hasVisible = true;
                                break;
                            }
                            next = next.nextElementSibling;
                        }
                        if (hasVisible) {
                            header.classList.remove('hidden');
                        } else {
                            header.classList.add('hidden');
                        }
                    }
                });

                if (destNoResults) {
                    if (matchCount === 0) {
                        destNoResults.classList.remove('hidden');
                        if (destSearchTerm) destSearchTerm.textContent = destSearchInput.value;
                    } else {
                        destNoResults.classList.add('hidden');
                    }
                }
            });

            // Clear search
            if (destSearchClear) {
                destSearchClear.addEventListener('click', (e) => {
                    e.stopPropagation();
                    destSearchInput.value = '';
                    destSearchInput.dispatchEvent(new Event('input'));
                    destSearchInput.focus();
                });
            }
        }

        // Option Selection
        destOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = opt.getAttribute('data-value') || '';
                
                if (destHiddenInput) destHiddenInput.value = value;
                if (destSelectedText) {
                    destSelectedText.textContent = value;
                    destSelectedText.classList.remove('text-gray-400');
                    destSelectedText.classList.add('text-gray-900', 'font-medium');
                }

                destOptions.forEach(o => o.classList.remove('bg-teal-50', 'text-accent', 'font-bold'));
                opt.classList.add('bg-teal-50', 'text-accent', 'font-bold');

                if (destTrigger) {
                    destTrigger.classList.remove('border-rose-500', 'ring-rose-500/20');
                }

                closeDestinationMenu();
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (destWrapper && !destWrapper.contains(e.target)) {
                closeDestinationMenu();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && destMenu && !destMenu.classList.contains('hidden')) {
                closeDestinationMenu();
            }
        });
    }

    // 3. Custom Type of Trip Dropdown
    const tripWrapper = document.getElementById('triptype-dropdown-wrapper');
    const tripTrigger = document.getElementById('triptype-trigger');
    const tripSelectedText = document.getElementById('triptype-selected-text');
    const tripChevron = document.getElementById('triptype-chevron');
    const tripMenu = document.getElementById('triptype-menu');
    const tripHiddenInput = document.getElementById('enquiry-triptype');
    const tripOptions = document.querySelectorAll('.triptype-option');

    function openTripMenu() {
        if (!tripMenu) return;
        closeDestinationMenu();
        tripMenu.classList.remove('hidden');
        if (tripChevron) tripChevron.classList.add('rotate-180');
        if (tripTrigger) tripTrigger.classList.add('border-accent', 'ring-2', 'ring-accent/20');
    }

    function closeTripMenu() {
        if (!tripMenu) return;
        tripMenu.classList.add('hidden');
        if (tripChevron) tripChevron.classList.remove('rotate-180');
        if (tripTrigger) tripTrigger.classList.remove('ring-2', 'ring-accent/20');
    }

    if (tripTrigger && tripMenu) {
        tripTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (tripMenu.classList.contains('hidden')) {
                openTripMenu();
            } else {
                closeTripMenu();
            }
        });

        tripOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = opt.getAttribute('data-value') || '';
                
                if (tripHiddenInput) tripHiddenInput.value = value;
                if (tripSelectedText) {
                    tripSelectedText.textContent = value;
                    tripSelectedText.classList.remove('text-gray-400');
                    tripSelectedText.classList.add('text-gray-900', 'font-medium');
                }

                tripOptions.forEach(o => o.classList.remove('bg-teal-50', 'text-accent', 'font-bold'));
                opt.classList.add('bg-teal-50', 'text-accent', 'font-bold');

                if (tripTrigger) {
                    tripTrigger.classList.remove('border-rose-500', 'ring-rose-500/20');
                }

                closeTripMenu();
            });
        });

        document.addEventListener('click', (e) => {
            if (tripWrapper && !tripWrapper.contains(e.target)) {
                closeTripMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && tripMenu && !tripMenu.classList.contains('hidden')) {
                closeTripMenu();
            }
        });
    }

    // 4. Form Submission -> WhatsApp Redirect to +91 90999 06971
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullname = (document.getElementById('enquiry-fullname')?.value || '').trim();
            const countrycode = document.getElementById('enquiry-countrycode')?.value || '+91';
            const phone = (document.getElementById('enquiry-phone')?.value || '').trim();
            const email = (document.getElementById('enquiry-email')?.value || '').trim() || 'Not provided';
            const destination = (document.getElementById('enquiry-destination')?.value || '').trim();
            const travelDate = document.getElementById('enquiry-date')?.value || 'Flexible / Undecided';
            const travellers = document.getElementById('enquiry-travellers')?.value || '2';
            const tripType = (document.getElementById('enquiry-triptype')?.value || '').trim();
            const notes = (document.getElementById('enquiry-notes')?.value || '').trim() || 'None';

            // Validate destination selection
            if (!destination) {
                if (destTrigger) {
                    destTrigger.classList.add('border-rose-500', 'ring-2', 'ring-rose-500/20');
                    destTrigger.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    openDestinationMenu();
                }
                return;
            }

            // Validate trip type selection
            if (!tripType) {
                if (tripTrigger) {
                    tripTrigger.classList.add('border-rose-500', 'ring-2', 'ring-rose-500/20');
                    tripTrigger.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    openTripMenu();
                }
                return;
            }

            // Build readymade message
            const message = `Hello Prapti Tourism! 🌟\nI would like to inquire about planning a trip with the following details:\n\n👤 *Name:* ${fullname}\n📞 *Phone:* ${countrycode} ${phone}\n📧 *Email:* ${email}\n📍 *Preferred Destination:* ${destination}\n🗓 *Approx. Travel Date:* ${travelDate}\n👥 *Number of Travellers:* ${travellers}\n✈️ *Type of Trip:* ${tripType}\n📝 *Additional Requirements:* ${notes}\n\nPlease connect me with a travel specialist. Thank you!`;

            const waNumber = '919099906971';
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Connecting to WhatsApp...</span>
                `;

                if (successMsg) {
                    successMsg.classList.remove('hidden');
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

                setTimeout(() => {
                    // Open WhatsApp in new tab
                    window.open(waUrl, '_blank');

                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 800);
            }
        });
    }
});



// FAQ Accordion & Load More Interaction
document.addEventListener('DOMContentLoaded', () => {
    const faqContainer = document.getElementById('faq-accordion-container');
    const loadMoreBtn = document.getElementById('faq-load-more');
    const loadMoreText = document.getElementById('faq-load-more-text');
    const loadMoreArrow = document.getElementById('faq-load-more-arrow');

    if (faqContainer) {
        const items = faqContainer.querySelectorAll('.faq-item');

        items.forEach(item => {
            const trigger = item.querySelector('.faq-trigger');
            const content = item.querySelector('.faq-content');
            const chevron = item.querySelector('.faq-chevron');

            if (trigger && content) {
                trigger.addEventListener('click', () => {
                    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

                    // Close all other accordions for clean single-open view
                    items.forEach(otherItem => {
                        const otherTrigger = otherItem.querySelector('.faq-trigger');
                        const otherContent = otherItem.querySelector('.faq-content');
                        const otherChevron = otherItem.querySelector('.faq-chevron');
                        if (otherTrigger && otherContent) {
                            otherTrigger.setAttribute('aria-expanded', 'false');
                            otherContent.style.maxHeight = null;
                            if (otherChevron) otherChevron.classList.remove('rotate-180');
                        }
                    });

                    // Toggle current
                    if (!isOpen) {
                        trigger.setAttribute('aria-expanded', 'true');
                        content.style.maxHeight = content.scrollHeight + 'px';
                        if (chevron) chevron.classList.add('rotate-180');
                    }
                });
            }
        });
    }

    if (loadMoreBtn) {
        let isExpanded = false;
        loadMoreBtn.addEventListener('click', () => {
            const extendedItems = document.querySelectorAll('.faq-item[data-extended="true"]');
            isExpanded = !isExpanded;

            extendedItems.forEach(item => {
                if (isExpanded) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                    // Collapse if it was open
                    const trigger = item.querySelector('.faq-trigger');
                    const content = item.querySelector('.faq-content');
                    const chevron = item.querySelector('.faq-chevron');
                    if (trigger && content) {
                        trigger.setAttribute('aria-expanded', 'false');
                        content.style.maxHeight = null;
                        if (chevron) chevron.classList.remove('rotate-180');
                    }
                }
            });

            if (loadMoreText) {
                loadMoreText.textContent = isExpanded ? 'Show less' : 'Load more';
            }
            if (loadMoreArrow) {
                loadMoreArrow.innerHTML = isExpanded ? '&uarr;' : '&darr;';
            }
        });
    }
});
