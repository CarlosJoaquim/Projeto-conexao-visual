document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    
    // Esconder preloader quando a página carregar
    window.addEventListener('load', function() {
        gsap.to(preloader, {
            duration: 0.8,
            opacity: 0,
            display: 'none',
            ease: 'power2.out'
        });
    });

    // Menu Mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        if (mobileMenu.classList.contains('active')) {
            gsap.fromTo(mobileMenu, 
                { x: '100%' }, 
                { x: '0%', duration: 0.5, ease: 'power3.out' }
            );
            
            gsap.from('.mobile-menu li', {
                x: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.4,
                delay: 0.3
            });
        }
    });

    // Fechar menu ao clicar em um link
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            gsap.to(mobileMenu, {
                x: '100%',
                duration: 0.3,
                ease: 'power3.in',
                onComplete: () => {
                    mobileMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            });
        });
    });

    // Scroll suave para links internos
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animação de contagem para estatísticas
    const statItems = document.querySelectorAll('.stat-item h3');
    const statsSection = document.querySelector('.about-stats');
    
    function animateStats() {
        const statsPosition = statsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (statsPosition < screenPosition) {
            const targets = [50, 100, 100];
            
            statItems.forEach((stat, index) => {
                const target = targets[index];
                let count = 0;
                const isPercentage = stat.textContent.includes('%');
                
                stat.textContent = isPercentage ? '0%' : '+0';
                
                const duration = 2;
                const increment = target / (duration * 60);
                
                const updateCount = () => {
                    count += increment;
                    
                    if (count < target) {
                        stat.textContent = isPercentage 
                            ? Math.floor(count) + '%' 
                            : '+' + Math.floor(count);
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.textContent = isPercentage 
                            ? target + '%' 
                            : '+' + target;
                    }
                };
                
                setTimeout(updateCount, index * 300);
            });
        }
    }

    // Observer para animações ao scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animação para a seção hero
                if (entry.target.id === 'home') {
                    const heroTitle = entry.target.querySelector('h1');
                    const originalText = heroTitle.textContent;
                    heroTitle.textContent = '';
                    
                    let i = 0;
                    const typingSpeed = 50;
                    
                    const typeWriter = () => {
                        if (i < originalText.length) {
                            heroTitle.textContent += originalText.charAt(i);
                            i++;
                            setTimeout(typeWriter, typingSpeed);
                        }
                    };
                    
                    setTimeout(typeWriter, 500);
                    
                    gsap.from(entry.target.querySelector('.subtitle'), {
                        duration: 1.2,
                        y: 30,
                        opacity: 0,
                        delay: 0.8,
                        ease: 'power3.out'
                    });
                    
                    gsap.from(entry.target.querySelectorAll('.btn'), {
                        duration: 1,
                        y: 30,
                        opacity: 0,
                        delay: 1.2,
                        ease: 'power3.out',
                        stagger: 0.2
                    });
                    
                    gsap.from(entry.target.querySelector('.hero-image'), {
                        duration: 1.5,
                        x: 100,
                        opacity: 0,
                        delay: 0.5,
                        ease: 'elastic.out(1, 0.3)'
                    });
                }

                // Animação para a seção about
                if (entry.target.id === 'about') {
                    gsap.from(entry.target.querySelector('.about-image'), {
                        duration: 1.2,
                        x: -50,
                        opacity: 0,
                        ease: 'power3.out'
                    });
                    
                    gsap.from(entry.target.querySelector('.about-content h2'), {
                        duration: 0.8,
                        y: 30,
                        opacity: 0,
                        ease: 'power3.out'
                    });
                    
                    gsap.from(entry.target.querySelectorAll('.about-content p'), {
                        duration: 0.8,
                        y: 30,
                        opacity: 0,
                        delay: 0.3,
                        ease: 'power3.out',
                        stagger: 0.15
                    });
                    
                    animateStats();
                    
                    gsap.from(entry.target.querySelectorAll('.stat-item'), {
                        duration: 1,
                        y: 50,
                        opacity: 0,
                        delay: 0.6,
                        ease: 'back.out(1.7)',
                        stagger: 0.2
                    });
                }

                // Animação para a seção services
                if (entry.target.id === 'services') {
                    gsap.from(entry.target.querySelectorAll('.service-card'), {
                        duration: 1,
                        y: 80,
                        opacity: 0,
                        ease: 'back.out(1.4)',
                        stagger: 0.2
                    });
                }

                // Animação para a seção portfolio
                if (entry.target.id === 'portfolio') {
                    gsap.from(entry.target.querySelectorAll('.portfolio-item'), {
                        duration: 0.8,
                        scale: 0.9,
                        opacity: 0,
                        ease: 'power3.out',
                        stagger: 0.15
                    });
                }

                // Animação para a seção testimonials
                if (entry.target.classList.contains('testimonials')) {
                    gsap.from(entry.target.querySelectorAll('.testimonial-item'), {
                        duration: 1,
                        x: -50,
                        opacity: 0,
                        ease: 'power3.out',
                        stagger: 0.3
                    });
                }

                // Animação para a seção contact
                if (entry.target.id === 'contact') {
                    gsap.from(entry.target.querySelector('.contact-content'), {
                        duration: 1,
                        x: -50,
                        opacity: 0,
                        ease: 'power3.out'
                    });
                    
                    gsap.from(entry.target.querySelector('.contact-form'), {
                        duration: 1,
                        x: 50,
                        opacity: 0,
                        delay: 0.2,
                        ease: 'power3.out'
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar todas as seções
    document.querySelectorAll('section, .highlights').forEach(section => {
        observer.observe(section);
    });

    // Efeito parallax suave
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image img');
        
        if (heroImage) {
            const heroSection = document.querySelector('.hero');
            const heroRect = heroSection.getBoundingClientRect();
            
            if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
                const parallaxValue = scrollPosition * 0.3;
                gsap.to(heroImage, {
                    y: parallaxValue,
                    duration: 0.5,
                    ease: 'power1.out'
                });
            }
        }
    });

    // Animação de hover para os cards de serviço
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                y: -10,
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
                ease: 'power2.out'
            });
            
            gsap.to(this.querySelector('.service-icon'), {
                duration: 0.5,
                rotationY: 180,
                ease: 'back.out(1.7)'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                y: 0,
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                ease: 'power2.out'
            });
            
            gsap.to(this.querySelector('.service-icon'), {
                duration: 0.5,
                rotationY: 0,
                ease: 'back.out(1.7)'
            });
        });
    });

    // Animação ao passar o mouse nos itens do portfólio
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.portfolio-overlay');
            gsap.to(overlay, {
                duration: 0.3,
                opacity: 1,
                ease: 'power2.out'
            });
            
            gsap.from(overlay.children, {
                duration: 0.5,
                y: 20,
                opacity: 0,
                stagger: 0.1,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.portfolio-overlay');
            gsap.to(overlay, {
                duration: 0.3,
                opacity: 0,
                ease: 'power2.out'
            });
        });
    });

    // =============================================
    // FUNCIONALIDADE DE ENVIO DE EMAIL COM EMAILJS
    // =============================================

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const messageDiv = document.getElementById('formMessage');
            
            // Estado de carregamento
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            messageDiv.style.display = 'none';
            
            // Enviar email através do EmailJS
            emailjs.sendForm(
                'service_2mr40ca', // ID do serviço no EmailJS
                'template_p28xvac', // ID do template no EmailJS
                this
            )
            .then(function() {
                // Sucesso
                messageDiv.textContent = 'Mensagem enviada com sucesso!';
                messageDiv.style.color = '#4DD1E6';
                messageDiv.style.display = 'block';
                
                // Resetar formulário
                contactForm.reset();
                
                // Feedback visual
                gsap.fromTo(messageDiv, 
                    { y: 20, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 0.5 }
                );
            }, function(error) {
                // Erro
                messageDiv.textContent = 'Ocorreu um erro. Tente novamente mais tarde.';
                messageDiv.style.color = '#FF7A45';
                messageDiv.style.display = 'block';
                console.error('Erro no envio:', error);
                
                // Feedback visual
                gsap.fromTo(messageDiv, 
                    { x: -10 }, 
                    { x: 0, duration: 0.3, ease: 'elastic.out(1, 0.5)' }
                );
            })
            .finally(function() {
                // Restaurar botão
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensagem';
            });
        });
    }
});