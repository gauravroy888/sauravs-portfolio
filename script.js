document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal Elements on Scroll
    const revealElements = document.querySelectorAll('section > .container > *, .timeline-item, .glass-card, .skill-bar-group, .contact-item');
    
    // Add reveal class to all elements we want to animate
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 50; // Reveal point from the bottom

        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    // Initial check
    revealOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);

    // 2. Active Navigation Link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Add glassy effect to header on scroll
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(9, 9, 11, 0.9)';
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(9, 9, 11, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

    // 3. Form Submission Handle
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon> Message Sent!';
            btn.style.background = '#22c55e'; // Green success color
            
            contactForm.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = 'var(--primary-color)';
            }, 3000);
        });
    }
    
    // 4. Progress Bars Animation (animate when in view)
    const progressBars = document.querySelectorAll('.progress');
    const animateProgress = () => {
        progressBars.forEach(bar => {
            const barTop = bar.getBoundingClientRect().top;
            if (barTop < window.innerHeight - 50) {
                // Remove animation to reset it if needed, or just let CSS handle it on load/reveal
                // The CSS animation 'scaleX' handles the initial grow
                bar.style.animationPlayState = 'running';
            } else {
                bar.style.animationPlayState = 'paused';
            }
        });
    };
    
    window.addEventListener('scroll', animateProgress);
    animateProgress(); // initial

    // 5. Portfolio Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        // Small timeout to allow display:flex to apply before changing opacity
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        // Pause videos when hidden
                        const iframe = card.querySelector('iframe');
                        if (iframe && iframe.contentWindow) {
                            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                        }
                        
                        // Wait for transition before hiding
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300); // Should match CSS transition time
                    }
                });
            });
        });
    }

    // Lazy load YouTube iframes on click
    const videoLinks = document.querySelectorAll('.video-link');
    videoLinks.forEach(link => {
        link.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            if (videoId) {
                const iframe = document.createElement('iframe');
                iframe.style.position = 'absolute';
                iframe.style.top = '0';
                iframe.style.left = '0';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.setAttribute('src', `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`);
                iframe.setAttribute('title', 'YouTube video player');
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
                iframe.setAttribute('allowfullscreen', '');
                
                this.innerHTML = '';
                this.appendChild(iframe);
                this.style.cursor = 'default';
            }
        });
    });
});

/* Interactive Background Particles */
document.addEventListener("DOMContentLoaded", () => {
    // Only run if we don't already have one
    if (document.getElementById("particles-canvas")) return;

    const canvas = document.createElement("canvas");
    canvas.id = "particles-canvas";
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    // Styles for canvas to sit in the background
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "0";
    canvas.style.pointerEvents = "none"; // Let clicks pass through to the page

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    // Track mouse coordinates
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = (Math.random() - 0.5) * 1;
        }

        draw() {
            ctx.fillStyle = "rgba(168, 85, 247, 0.7)"; // Brand purple color
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            // Constant slow movement
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;

            // Mouse interaction
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                if (distance < mouse.radius) {
                    this.x -= directionX;
                    this.y -= directionY;
                }
            }
        }
    }

    function init() {
        particles = [];
        let numberOfParticles = (width * height) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect lines between close particles
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(168, 85, 247, ${0.2 - distance/500})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();
});

/* Mobile Menu Toggle */
document.addEventListener("DOMContentLoaded", () => {
    const mobileBtn = document.querySelector(".mobile-menu-btn");
    const navbar = document.querySelector(".navbar");
    
    if (mobileBtn && navbar) {
        mobileBtn.addEventListener("click", () => {
            navbar.classList.toggle("active");
            
            // Toggle menu icon between menu and close
            const icon = mobileBtn.querySelector("ion-icon");
            if (navbar.classList.contains("active")) {
                icon.setAttribute("name", "close-outline");
            } else {
                icon.setAttribute("name", "menu-outline");
            }
        });
        
        // Close menu when clicking a link
        const navLinks = navbar.querySelectorAll("a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navbar.classList.remove("active");
                const icon = mobileBtn.querySelector("ion-icon");
                if (icon) icon.setAttribute("name", "menu-outline");
            });
        });
    }
});
