/**
 * CONEXÃO VISUAL - SCRIPT PRINCIPAL OTIMIZADO
 * Versão: 3.0
 * Autor: Carlos Joaquim
 * Data: 15/06/2024
 * Melhorias:
 * - Adicionado fechamento do menu mobile pelo botão de fechar
 * - Melhor organização do código
 * - Otimização de performance
 * - Tratamento de erros aprimorado
 */

document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // CONFIGURAÇÕES INICIAIS E CONSTANTES
    // =============================================
    const DOM = {
        preloader: document.querySelector('.preloader'),
        mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
        mobileMenu: document.querySelector('.mobile-menu'),
        mobileMenuClose: document.querySelector('.mobile-menu-close'),
        header: document.querySelector('.header'),
        dynamicContainer: document.getElementById('dynamic-content-container'),
        dynamicContent: document.getElementById('dynamic-content'),
        closeBtn: document.getElementById('close-content-btn'),
        contactForm: document.getElementById('contactForm'),
        formMessage: document.getElementById('formMessage'),
        body: document.body
    };

    const CLASSES = {
        active: 'active',
        scrolled: 'scrolled'
    };

    const SELECTORS = {
        mobileNavLinks: '.mobile-menu a',
        smoothScrollLinks: 'a[href^="#"]',
        serviceLinks: '[href^="#design"], [href^="#marketing"], [href^="#desenvolvimento"], [href^="#redes-sociais"], [href^="#seo"]',
        statsSection: '.about-stats',
        statItems: '.stat-item h3',
        serviceCards: '.service-card',
        portfolioItems: '.portfolio-item',
        portfolioOverlays: '.portfolio-overlay',
        testimonialItems: '.testimonial-item'
    };

    // Mapeamento de serviços para conteúdo dinâmico
    const SERVICES_MAP = {
        '#design': 'design-grafico.html',
        '#marketing': 'marketing-digital.html',
        '#desenvolvimento': 'desenvolvimento-web.html',
        '#redes-sociais': 'gestao-redes-sociais.html',
        '#seo': 'seo.html'
    };

    // Configurações de animação
    const ANIMATION_SETTINGS = {
        defaultDuration: 0.5,
        fastDuration: 0.3,
        slowDuration: 0.8,
        easePower3: 'power3.out',
        easeBack: 'back.out(1.7)',
        easeElastic: 'elastic.out(1, 0.3)'
    };

    // =============================================
    // FUNÇÕES UTILITÁRIAS
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

    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // =============================================
    // PRELOADER
    // =============================================
    function initPreloader() {
        if (!DOM.preloader) return;

        window.addEventListener('load', function() {
            gsap.to(DOM.preloader, {
                duration: ANIMATION_SETTINGS.slowDuration,
                opacity: 0,
                display: 'none',
                ease: ANIMATION_SETTINGS.easePower3,
                onComplete: () => {
                    DOM.preloader.style.display = 'none';
                    initScrollAnimations();
                }
            });
        });
    }

    // =============================================
    // MENU MOBILE - MELHORADO
    // =============================================
    function initMobileMenu() {
        if (!DOM.mobileMenuBtn || !DOM.mobileMenu) return;

        // Abrir menu
        DOM.mobileMenuBtn.addEventListener('click', openMobileMenu);

        // Fechar menu pelo botão X (adicionado)
        if (DOM.mobileMenuClose) {
            DOM.mobileMenuClose.addEventListener('click', closeMobileMenu);
        }

        // Fechar menu ao clicar em links
        document.querySelectorAll(SELECTORS.mobileNavLinks).forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Fechar ao pressionar ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && DOM.mobileMenu.classList.contains(CLASSES.active)) {
                closeMobileMenu();
            }
        });
    }

    function openMobileMenu() {
        DOM.mobileMenuBtn.classList.add(CLASSES.active);
        DOM.mobileMenu.classList.add(CLASSES.active);
        DOM.body.style.overflow = 'hidden';

        gsap.fromTo(DOM.mobileMenu, 
            { x: '100%' }, 
            { 
                x: '0%', 
                duration: ANIMATION_SETTINGS.defaultDuration, 
                ease: ANIMATION_SETTINGS.easePower3 
            }
        );
        
        gsap.from('.mobile-menu li', {
            x: 30,
            opacity: 0,
            stagger: 0.1,
            duration: ANIMATION_SETTINGS.fastDuration,
            delay: 0.3
        });
    }

    function closeMobileMenu() {
        gsap.to(DOM.mobileMenu, {
            x: '100%',
            duration: ANIMATION_SETTINGS.fastDuration,
            ease: 'power3.in',
            onComplete: () => {
                DOM.mobileMenu.classList.remove(CLASSES.active);
                DOM.mobileMenuBtn.classList.remove(CLASSES.active);
                DOM.body.style.overflow = 'auto';
            }
        });
    }

    // =============================================
    // SCROLL SUAVE - OTIMIZADO
    // =============================================
    function initSmoothScroll() {
        document.querySelectorAll(SELECTORS.smoothScrollLinks).forEach(link => {
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
                        if (DOM.mobileMenu.classList.contains(CLASSES.active)) {
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
            DOM.header.classList.toggle(CLASSES.scrolled, window.scrollY > 50);
        }, 100));
    }

    // =============================================
    // ANIMAÇÃO DE ESTATÍSTICAS
    // =============================================
    function initStatsAnimation() {
        const statsSection = document.querySelector(SELECTORS.statsSection);
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
        const statItems = document.querySelectorAll(SELECTORS.statItems);
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
    // CONTEÚDO DINÂMICO DE SERVIÇOS - OTIMIZADO
    // =============================================
    function initDynamicContent() {
        if (!DOM.dynamicContainer || !DOM.dynamicContent) return;

        // Configura listeners para links de serviço
        document.querySelectorAll(SELECTORS.serviceLinks).forEach(link => {
            const href = link.getAttribute('href');
            if (SERVICES_MAP[href]) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadDynamicContent(SERVICES_MAP[href]);
                });
            }
        });

        // Botão de fechar
        DOM.closeBtn.addEventListener('click', closeDynamicContent);
    }

    async function loadDynamicContent(file) {
        try {
            const response = await fetch(`includes/${file}`);
            if (!response.ok) throw new Error('Falha ao carregar conteúdo');
            
            const data = await response.text();
            DOM.dynamicContent.innerHTML = data;
            showDynamicContent();
            setupDynamicLinks();
        } catch (error) {
            handleDynamicContentError(error);
        }
    }

    function showDynamicContent() {
        gsap.to(DOM.dynamicContainer, {
            duration: ANIMATION_SETTINGS.defaultDuration,
            opacity: 1,
            display: 'block',
            ease: ANIMATION_SETTINGS.easePower3,
            onStart: () => {
                DOM.dynamicContainer.style.display = 'block';
                DOM.body.style.overflow = 'hidden';
            }
        });
        
        gsap.from(DOM.dynamicContent, { 
            duration: ANIMATION_SETTINGS.slowDuration,
            y: 50,
            opacity: 0,
            ease: ANIMATION_SETTINGS.easeBack
        });
    }

    function closeDynamicContent() {
        gsap.to(DOM.dynamicContainer, { 
            duration: ANIMATION_SETTINGS.fastDuration,
            opacity: 0,
            ease: 'power2.in',
            onComplete: () => {
                DOM.dynamicContainer.style.display = 'none';
                DOM.body.style.overflow = 'auto';
            }
        });
    }

    function setupDynamicLinks() {
        DOM.dynamicContent.querySelectorAll(SELECTORS.smoothScrollLinks).forEach(link => {
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
    // ANIMAÇÕES AO SCROLL - REORGANIZADO
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

                const animationFunc = animations[entry.target.id || entry.target.className];
                if (animationFunc) {
                    animationFunc(entry.target);
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
            duration: ANIMATION_SETTINGS.slowDuration,
            y: 30,
            opacity: 0,
            delay: 0.8,
            ease: ANIMATION_SETTINGS.easePower3
        });
        
        gsap.from(section.querySelectorAll('.btn'), {
            duration: ANIMATION_SETTINGS.defaultDuration,
            y: 30,
            opacity: 0,
            delay: 1.2,
            ease: ANIMATION_SETTINGS.easePower3,
            stagger: 0.2
        });
        
        gsap.from(section.querySelector('.hero-image'), {
            duration: 1.5,
            x: 100,
            opacity: 0,
            delay: 0.5,
            ease: ANIMATION_SETTINGS.easeElastic
        });
    }

    function animateAboutSection(section) {
        gsap.from(section.querySelector('.about-image'), {
            duration: ANIMATION_SETTINGS.slowDuration,
            x: -50,
            opacity: 0,
            ease: ANIMATION_SETTINGS.easePower3
        });
        
        gsap.from(section.querySelector('.about-content h2'), {
            duration: ANIMATION_SETTINGS.slowDuration,
            y: 30,
            opacity: 0,
            ease: ANIMATION_SETTINGS.easePower3
        });
        
        gsap.from(section.querySelectorAll('.about-content p'), {
            duration: ANIMATION_SETTINGS.defaultDuration,
            y: 30,
            opacity: 0,
            delay: 0.3,
            ease: ANIMATION_SETTINGS.easePower3,
            stagger: 0.15
        });
        
        gsap.from(section.querySelectorAll('.stat-item'), {
            duration: ANIMATION_SETTINGS.defaultDuration,
            y: 50,
            opacity: 0,
            delay: 0.6,
            ease: ANIMATION_SETTINGS.easeBack,
            stagger: 0.2
        });
    }

    function animateServicesSection(section) {
        gsap.from(section.querySelectorAll(SELECTORS.serviceCards), {
            duration: ANIMATION_SETTINGS.defaultDuration,
            y: 80,
            opacity: 0,
            ease: ANIMATION_SETTINGS.easeBack,
            stagger: 0.2
        });
    }

    function animatePortfolioSection(section) {
        gsap.from(section.querySelectorAll(SELECTORS.portfolioItems), {
            duration: ANIMATION_SETTINGS.slowDuration,
            scale: 0.9,
            opacity: 0,
            ease: ANIMATION_SETTINGS.easePower3,
            stagger: 0.15
        });
    }

    function animateTestimonialsSection(section) {
        gsap.from(section.querySelectorAll(SELECTORS.testimonialItems), {
            duration: ANIMATION_SETTINGS.defaultDuration,
            x: -50,
            opacity: 0,
            ease: ANIMATION_SETTINGS.easePower3,
            stagger: 0.3
        });
    }

    function animateContactSection(section) {
        gsap.from(section.querySelector('.contact-content'), {
            duration: ANIMATION_SETTINGS.defaultDuration,
            x: -50,
            opacity: 0,
            ease: ANIMATION_SETTINGS.easePower3
        });
        
        gsap.from(section.querySelector('.contact-form'), {
            duration: ANIMATION_SETTINGS.defaultDuration,
            x: 50,
            opacity: 0,
            delay: 0.2,
            ease: ANIMATION_SETTINGS.easePower3
        });
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
                    duration: ANIMATION_SETTINGS.fastDuration,
                    ease: 'power1.out'
                });
            }
        }, 16));
    }

    // =============================================
    // ANIMAÇÕES DE HOVER - OTIMIZADO
    // =============================================
    function initHoverAnimations() {
        // Cards de serviço
        document.querySelectorAll(SELECTORS.serviceCards).forEach(card => {
            card.addEventListener('mouseenter', () => animateCardHover(card, true));
            card.addEventListener('mouseleave', () => animateCardHover(card, false));
        });

        // Itens do portfólio
        document.querySelectorAll(SELECTORS.portfolioItems).forEach(item => {
            item.addEventListener('mouseenter', () => animatePortfolioHover(item, true));
            item.addEventListener('mouseleave', () => animatePortfolioHover(item, false));
        });
    }

    function animateCardHover(card, isHover) {
        const serviceIcon = card.querySelector('.service-icon');
        if (!serviceIcon) return;

        gsap.to(card, {
            duration: ANIMATION_SETTINGS.fastDuration,
            y: isHover ? -10 : 0,
            boxShadow: isHover ? '0 15px 30px rgba(0, 0, 0, 0.15)' : '0 5px 15px rgba(0, 0, 0, 0.1)',
            ease: ANIMATION_SETTINGS.easePower3
        });
        
        gsap.to(serviceIcon, {
            duration: ANIMATION_SETTINGS.defaultDuration,
            rotationY: isHover ? 180 : 0,
            ease: ANIMATION_SETTINGS.easeBack
        });
    }

    function animatePortfolioHover(item, isHover) {
        const overlay = item.querySelector(SELECTORS.portfolioOverlays);
        if (!overlay) return;

        if (isHover) {
            gsap.to(overlay, {
                duration: ANIMATION_SETTINGS.fastDuration,
                opacity: 1,
                ease: ANIMATION_SETTINGS.easePower3
            });
            
            gsap.from(overlay.children, {
                duration: ANIMATION_SETTINGS.defaultDuration,
                y: 20,
                opacity: 0,
                stagger: 0.1,
                ease: ANIMATION_SETTINGS.easePower3
            });
        } else {
            gsap.to(overlay, {
                duration: ANIMATION_SETTINGS.fastDuration,
                opacity: 0,
                ease: ANIMATION_SETTINGS.easePower3
            });
        }
    }

    // =============================================
    // FORMULÁRIO DE CONTATO - MELHORADO
    // =============================================
    function initContactForm() {
        if (!DOM.contactForm || !DOM.formMessage) return;

        DOM.contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Estado de carregamento
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            DOM.formMessage.style.display = 'none';
            
            try {
                await emailjs.sendForm(
                    'service_vz4bceg', // ID do serviço
                    'template_9slap3q', // ID do template
                    this
                );
                
                showFormMessage('Mensagem enviada com sucesso!', 'success');
                this.reset();
            } catch (error) {
                console.error('Erro no envio:', error);
                showFormMessage('Ocorreu um erro. Tente novamente mais tarde.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    function showFormMessage(message, type) {
        DOM.formMessage.textContent = message;
        DOM.formMessage.style.color = type === 'success' ? '#4DD1E6' : '#FF7A45';
        DOM.formMessage.style.display = 'block';
        
        gsap.fromTo(DOM.formMessage, 
            { y: 20, opacity: 0 }, 
            { 
                y: 0, 
                opacity: 1, 
                duration: ANIMATION_SETTINGS.defaultDuration 
            }
        );
    }

    // =============================================
    // INICIALIZAÇÃO - ORGANIZADA
    // =============================================
    function init() {
        // Configurações iniciais
        initPreloader();
        
        // Navegação
        initMobileMenu();
        initSmoothScroll();
        initHeaderScroll();
        
        // Animações
        initStatsAnimation();
        initDynamicContent();
        initParallax();
        initHoverAnimations();
        
        // Formulários
        initContactForm();
    }

    // Inicia a aplicação
    init();
});