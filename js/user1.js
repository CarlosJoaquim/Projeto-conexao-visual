/**
 * USER.JS - GERENCIAMENTO DE USUÁRIO E FORMULÁRIOS
 * Versão: 3.2
 * Compatível com map.js v2.1
 */

// ======================
// 1. CONFIGURAÇÕES
// ======================
const USER_CONFIG = {
    maxFormAttempts: 3,
    retryDelay: 2000,
    animationDuration: 300,
    debug: true // Altere para false em produção
  };
  
  // ======================
  // 2. GERENCIAMENTO DE FORMULÁRIO
  // ======================
  class FormManager {
    constructor(formId) {
      this.form = document.getElementById(formId);
      this.attempts = 0;
      this.initialize();
    }
  
    initialize() {
      if (!this.form) return;
  
      this.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleSubmit();
      });
  
      if (USER_CONFIG.debug) {
        console.log(`Formulário ${this.form.id} inicializado`);
      }
    }
  
    async handleSubmit() {
      if (this.attempts >= USER_CONFIG.maxFormAttempts) {
        this.showMessage('Limite de tentativas excedido', 'error');
        return;
      }
  
      this.attempts++;
      this.setFormState('loading');
  
      try {
        const response = await this.sendFormData();
        this.handleSuccess(response);
      } catch (error) {
        this.handleError(error);
      }
    }
  
    async sendFormData() {
      if (!window.emailjs || !window.emailjs.init) {
        throw new Error('EmailJS não carregado');
      }
  
      return emailjs.sendForm(
        'service_vz4bceg', // Seu Service ID
        'template_9slap3q', // Seu Template ID
        this.form
      );
    }
  
    handleSuccess(response) {
      this.showMessage('Mensagem enviada com sucesso!', 'success');
      this.form.reset();
      this.attempts = 0;
      
      if (USER_CONFIG.debug) {
        console.log('Email enviado:', response);
      }
    }
  
    handleError(error) {
      const message = this.attempts < USER_CONFIG.maxFormAttempts 
        ? `Erro ao enviar (tentativa ${this.attempts}/${USER_CONFIG.maxFormAttempts})` 
        : 'Erro crítico. Por favor, recarregue a página.';
  
      this.showMessage(message, 'error');
      
      if (USER_CONFIG.debug) {
        console.error('Falha no envio:', error);
      }
  
      if (this.attempts < USER_CONFIG.maxFormAttempts) {
        setTimeout(() => this.handleSubmit(), USER_CONFIG.retryDelay);
      }
    }
  
    setFormState(state) {
      const button = this.form.querySelector('button[type="submit"]');
      if (!button) return;
  
      switch (state) {
        case 'loading':
          button.disabled = true;
          button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
          break;
        case 'ready':
          button.disabled = false;
          button.textContent = 'Enviar Mensagem';
          break;
        case 'error':
          button.disabled = false;
          button.innerHTML = '<i class="fas fa-exclamation-circle"></i> Tentar Novamente';
          break;
      }
    }
  
    showMessage(text, type) {
      const messageDiv = document.getElementById('formMessage') || this.createMessageElement();
      messageDiv.textContent = text;
      messageDiv.className = `form-message ${type}`;
  
      gsap.fromTo(messageDiv,
        { y: -20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1,
          duration: USER_CONFIG.animationDuration / 1000,
          ease: 'power2.out'
        }
      );
  
      if (type !== 'error') {
        setTimeout(() => {
          gsap.to(messageDiv, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            onComplete: () => messageDiv.textContent = ''
          });
        }, 5000);
      }
    }
  
    createMessageElement() {
      const div = document.createElement('div');
      div.id = 'formMessage';
      div.className = 'form-message';
      this.form.appendChild(div);
      return div;
    }
  }
  
  // ======================
  // 3. GERENCIAMENTO DE USUÁRIO
  // ======================
  class UserSession {
    constructor() {
      this.sessionTimeout = 30 * 60 * 1000; // 30 minutos
      this.initSession();
    }
  
    initSession() {
      this.lastActivity = Date.now();
      this.setupListeners();
    }
  
    setupListeners() {
      ['click', 'mousemove', 'keypress', 'scroll'].forEach(event => {
        document.addEventListener(event, () => this.updateActivity());
      });
    }
  
    updateActivity() {
      this.lastActivity = Date.now();
    }
  
    checkSession() {
      setInterval(() => {
        if (Date.now() - this.lastActivity > this.sessionTimeout) {
          this.showTimeoutWarning();
        }
      }, 60000); // Verifica a cada minuto
    }
  
    showTimeoutWarning() {
      if (USER_CONFIG.debug) {
        console.log('Sessão inativa - mostrando aviso');
      }
      // Implemente sua lógica de aviso aqui
    }
  }
  
  // ======================
  // 4. INICIALIZAÇÃO
  // ======================
  document.addEventListener('DOMContentLoaded', function() {
    // Inicializa formulários
    const contactForm = new FormManager('contactForm');
    const newsletterForm = new FormManager('newsletterForm');
  
    // Inicia sessão de usuário
    if (window.location.pathname === '/dashboard') {
      const userSession = new UserSession();
      userSession.checkSession();
    }
  
    // Carrega EmailJS quando disponível
    if (typeof emailjs !== 'undefined') {
      emailjs.init('cbT_hzYhhTb2mGX21').then(() => {
        if (USER_CONFIG.debug) {
          console.log('EmailJS pronto para uso');
        }
      });
    }
  });
  
  // ======================
  // 5. EXPORTAÇÃO PARA MÓDULOS
  // ======================
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      FormManager,
      UserSession,
      USER_CONFIG
    };
  }