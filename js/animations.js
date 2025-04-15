/**
 * CONEXÃO VISUAL - SCRIPT PRINCIPAL OTIMIZADO
 * Versão: 2.0
 * Autor: Carlos Joaquim
 * Data: 15/06/2024
 */

document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // CONFIGURAÇÕES INICIAIS
    // =============================================
    const DOM = {
        preloader: document.querySelector('.preloader'),
        mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
        mobileMenu: document.querySelector('.mobile-menu'),
        header: document.querySelector('.header'),
        dynamicContainer: document.getElementById('dynamic-content-container'),
        dynamicContent: document.getElementById('dynamic-content'),
        closeBtn: document.getElementById('close-content-btn'),
        contactForm: document.getElementById('contactForm'),
        formMessage: document.getElementById('formMessage')
    };

    // =============================================
    // PRELOADER
    // =============================================
    function initPreloader() {
        if (!DOM.preloader) return;

        window.addEventListener('load', function() {
            gsap.to(DOM.preloader, {
                duration: 0.8,
                opacity: 0,
                display: 'none',
                ease: 'power2.out',
                onComplete: () => {
                    DOM.preloader.style.display = 'none';
                    initScrollAnimations();
                }
            });
        });
    }

    // =============================================
    // MENU MOBILE
    // =============================================
    function initMobileMenu() {
        if (!DOM.mobileMenuBtn || !DOM.mobileMenu) return;

        DOM.mobileMenuBtn.addEventListener('click', function() {
            const isActive = this.classList.toggle('active');
            DOM.mobileMenu.classList.toggle('active');

            if (isActive) {
                gsap.fromTo(DOM.mobileMenu, 
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
            } else {
                closeMobileMenu();
            }
        });

        // Fechar menu ao clicar em links
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    function closeMobileMenu() {
        gsap.to(DOM.mobileMenu, {
            x: '100%',
            duration: 0.3,
            ease: 'power3.in',
            onComplete: () => {
                DOM.mobileMenu.classList.remove('active');
                DOM.mobileMenuBtn.classList.remove('active');
            }
        });
    }

    // =============================================
    // SCROLL SUAVE
    // =============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Ignora links de serviços (gerenciados separadamente)
                if (!href.match(/#(design|marketing|desenvolvimento|redes-sociais|seo)/)) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - 80,
                            behavior: 'smooth'
                        });
                        
                        // Fecha menu mobile se estiver aberto
                        if (DOM.mobileMenu.classList.contains('active')) {
                            closeMobileMenu();
                        }
                    }
                }
            });
        });
    }

    // =============================================
    // HEADER SCROLL EFFECT
    // =============================================
    function initHeaderScroll() {
        if (!DOM.header) return;

        window.addEventListener('scroll', throttle(function() {
            DOM.header.classList.toggle('scrolled', window.scrollY > 50);
        }, 100));
    }

    // =============================================
    // ANIMAÇÃO DE ESTATÍSTICAS
    // =============================================
    function initStatsAnimation() {
        const statsSection = document.querySelector('.about-stats');
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    function animateStats() {
        const statItems = document.querySelectorAll('.stat-item h3');
        const targets = [50, 100, 100];
        const duration = 2;
        
        statItems.forEach((stat, index) => {
            const target = targets[index];
            const isPercentage = stat.textContent.includes('%');
            let count = 0;
            
            stat.textContent = isPercentage ? '0%' : '+0';
            const increment = target / (duration * 60);
            
            const updateCount = () => {
                count += increment;
                
                if (count < target) {
                    stat.textContent = isPercentage 
                        ? `${Math.floor(count)}%` 
                        : `+${Math.floor(count)}`;
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = isPercentage 
                        ? `${target}%` 
                        : `+${target}`;
                }
            };
            
            setTimeout(updateCount, index * 300);
        });
    }

    // =============================================
    // CONTEÚDO DINÂMICO DE SERVIÇOS
    // =============================================
    function initDynamicContent() {
        if (!DOM.dynamicContainer || !DOM.dynamicContent) return;

        // Mapeamento de serviços
        const servicesMap = {
            '#design': 'design-grafico.html',
            '#marketing': 'marketing-digital.html',
            '#desenvolvimento': 'desenvolvimento-web.html',
            '#redes-sociais': 'gestao-redes-sociais.html',
            '#seo': 'seo.html'
        };

        // Configura listeners para links de serviço
        document.querySelectorAll('[href^="#"]').forEach(link => {
            const href = link.getAttribute('href');
            if (servicesMap[href]) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadDynamicContent(servicesMap[href]);
                });
            }
        });

        // Botão de fechar
        DOM.closeBtn.addEventListener('click', closeDynamicContent);
    }

    function loadDynamicContent(file) {
        fetch(`includes/${file}`)
            .then(response => {
                if (!response.ok) throw new Error('Falha ao carregar');
                return response.text();
            })
            .then(data => {
                DOM.dynamicContent.innerHTML = data;
                showDynamicContent();
                setupDynamicLinks();
            })
            .catch(handleDynamicContentError);
    }

    function showDynamicContent() {
        gsap.to(DOM.dynamicContainer, {
            duration: 0.5,
            opacity: 1,
            display: 'block',
            ease: 'power2.out',
            onStart: () => {
                DOM.dynamicContainer.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
        
        gsap.from(DOM.dynamicContent, { 
            duration: 0.8,
            y: 50,
            opacity: 0,
            ease: 'back.out(1.4)'
        });
    }

    function closeDynamicContent() {
        gsap.to(DOM.dynamicContainer, { 
            duration: 0.4,
            opacity: 0,
            ease: 'power2.in',
            onComplete: () => {
                DOM.dynamicContainer.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    function setupDynamicLinks() {
        DOM.dynamicContent.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                if (!this.getAttribute('href').match(/#(design|marketing|desenvolvimento|redes-sociais|seo)/)) {
                    e.preventDefault();
                    closeDynamicContent();
                    
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        setTimeout(() => {
                            window.scrollTo({
                                top: target.offsetTop - 80,
                                behavior: 'smooth'
                            });
                        }, 500);
                    }
                }
            });
        });
    }

    function handleDynamicContentError(error) {
        console.error('Erro ao carregar conteúdo:', error);
        DOM.dynamicContent.innerHTML = `
            <div class="service-detail">
                <h2>Serviço</h2>
                <p>Ocorreu um erro ao carregar o conteúdo. Por favor, tente novamente mais tarde.</p>
                <a href="#contact" class="btn btn-primary">Fale Conosco</a>
            </div>
        `;
    }

    // =============================================
    // ANIMAÇÕES AO SCROLL
    // =============================================
    function initScrollAnimations() {
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        document.querySelectorAll('section, .highlights').forEach(section => {
            observer.observe(section);
        });
    }

    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animations = {
                    '#home': animateHeroSection,
                    '#about': animateAboutSection,
                    '#services': animateServicesSection,
                    '#portfolio': animatePortfolioSection,
                    '.testimonials': animateTestimonialsSection,
                    '#contact': animateContactSection
                };

                if (animations[entry.target.id || entry.target.className]) {
                    animations[entry.target.id || entry.target.className](entry.target);
                }

                // Sempre anima stats quando a seção about é visível
                if (entry.target.id === 'about') {
                    animateStats();
                }
            }
        });
    }

    function animateHeroSection(section) {
        const heroTitle = section.querySelector('h1');
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        typeWriter(heroTitle, originalText, 50, 500);
        
        gsap.from(section.querySelector('.subtitle'), {
            duration: 1.2,
            y: 30,
            opacity: 0,
            delay: 0.8,
            ease: 'power3.out'
        });
        
        gsap.from(section.querySelectorAll('.btn'), {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 1.2,
            ease: 'power3.out',
            stagger: 0.2
        });
        
        gsap.from(section.querySelector('.hero-image'), {
            duration: 1.5,
            x: 100,
            opacity: 0,
            delay: 0.5,
            ease: 'elastic.out(1, 0.3)'
        });
    }

    function animateAboutSection(section) {
        gsap.from(section.querySelector('.about-image'), {
            duration: 1.2,
            x: -50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from(section.querySelector('.about-content h2'), {
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from(section.querySelectorAll('.about-content p'), {
            duration: 0.8,
            y: 30,
            opacity: 0,
            delay: 0.3,
            ease: 'power3.out',
            stagger: 0.15
        });
        
        gsap.from(section.querySelectorAll('.stat-item'), {
            duration: 1,
            y: 50,
            opacity: 0,
            delay: 0.6,
            ease: 'back.out(1.7)',
            stagger: 0.2
        });
    }

    function animateServicesSection(section) {
        gsap.from(section.querySelectorAll('.service-card'), {
            duration: 1,
            y: 80,
            opacity: 0,
            ease: 'back.out(1.4)',
            stagger: 0.2
        });
    }

    function animatePortfolioSection(section) {
        gsap.from(section.querySelectorAll('.portfolio-item'), {
            duration: 0.8,
            scale: 0.9,
            opacity: 0,
            ease: 'power3.out',
            stagger: 0.15
        });
    }

    function animateTestimonialsSection(section) {
        gsap.from(section.querySelectorAll('.testimonial-item'), {
            duration: 1,
            x: -50,
            opacity: 0,
            ease: 'power3.out',
            stagger: 0.3
        });
    }

    function animateContactSection(section) {
        gsap.from(section.querySelector('.contact-content'), {
            duration: 1,
            x: -50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from(section.querySelector('.contact-form'), {
            duration: 1,
            x: 50,
            opacity: 0,
            delay: 0.2,
            ease: 'power3.out'
        });
    }

    function typeWriter(element, text, speed, delay) {
        let i = 0;
        setTimeout(() => {
            const typing = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typing, speed);
                }
            };
            typing();
        }, delay);
    }

    // =============================================
    // EFEITO PARALLAX
    // =============================================
    function initParallax() {
        const heroImage = document.querySelector('.hero-image img');
        if (!heroImage) return;

        window.addEventListener('scroll', throttle(function() {
            const scrollPosition = window.pageYOffset;
            const heroSection = document.querySelector('.hero');
            const heroRect = heroSection.getBoundingClientRect();
            
            if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
                gsap.to(heroImage, {
                    y: scrollPosition * 0.3,
                    duration: 0.5,
                    ease: 'power1.out'
                });
            }
        }, 16));
    }

    // =============================================
    // ANIMAÇÕES DE HOVER
    // =============================================
    function initHoverAnimations() {
        // Cards de serviço
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', () => animateCardHover(card, true));
            card.addEventListener('mouseleave', () => animateCardHover(card, false));
        });

        // Itens do portfólio
        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.addEventListener('mouseenter', () => animatePortfolioHover(item, true));
            item.addEventListener('mouseleave', () => animatePortfolioHover(item, false));
        });
    }

    function animateCardHover(card, isHover) {
        if (isHover) {
            gsap.to(card, {
                duration: 0.3,
                y: -10,
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
                ease: 'power2.out'
            });
            
            gsap.to(card.querySelector('.service-icon'), {
                duration: 0.5,
                rotationY: 180,
                ease: 'back.out(1.7)'
            });
        } else {
            gsap.to(card, {
                duration: 0.3,
                y: 0,
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                ease: 'power2.out'
            });
            
            gsap.to(card.querySelector('.service-icon'), {
                duration: 0.5,
                rotationY: 0,
                ease: 'back.out(1.7)'
            });
        }
    }

    function animatePortfolioHover(item, isHover) {
        const overlay = item.querySelector('.portfolio-overlay');
        if (!overlay) return;

        if (isHover) {
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
        } else {
            gsap.to(overlay, {
                duration: 0.3,
                opacity: 0,
                ease: 'power2.out'
            });
        }
    }

    // =============================================
    // FORMULÁRIO DE CONTATO
    // =============================================
    function initContactForm() {
        if (!DOM.contactForm || !DOM.formMessage) return;

        DOM.contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Estado de carregamento
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            DOM.formMessage.style.display = 'none';
            
            emailjs.sendForm(
                'service_2mr40ca', // ID do serviço
                'template_p28xvac', // ID do template
                this
            )
            .then(() => {
                showFormMessage('Mensagem enviada com sucesso!', 'success');
                this.reset();
            })
            .catch((error) => {
                console.error('Erro no envio:', error);
                showFormMessage('Ocorreu um erro. Tente novamente mais tarde.', 'error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
        });
    }

    function showFormMessage(message, type) {
        DOM.formMessage.textContent = message;
        DOM.formMessage.style.color = type === 'success' ? '#4DD1E6' : '#FF7A45';
        DOM.formMessage.style.display = 'block';
        
        gsap.fromTo(DOM.formMessage, 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.5 }
        );
    }

    // =============================================
    // UTILITÁRIOS
    // =============================================
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // =============================================
    // INICIALIZAÇÃO
    // =============================================
    function init() {
        initPreloader();
        initMobileMenu();
        initSmoothScroll();
        initHeaderScroll();
        initStatsAnimation();
        initDynamicContent();
        initParallax();
        initHoverAnimations();
        initContactForm();
    }

    init();
});