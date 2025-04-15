/**
 * CONFIG.JS - CONFIGURAÇÕES CENTRALIZADAS
 * Arquivo sensível - deve ser adicionado ao .gitignore
 * Última atualização: 15/06/2024
 */

// =============================================
// 1. CONFIGURAÇÕES GERAIS DA APLICAÇÃO
// =============================================
const AppConfig = {
    // Identificação
    appName: "Conexão Visual",
    appVersion: "3.2.0",
    environment: process.env.NODE_ENV || "development", // 'production' em deploy
  
    // URLs
    baseUrl: "https://conexaovisual.vercel.app",
    apiEndpoint: "https://api.conexaovisual.app/v1",
  
    // Tempos
    sessionTimeout: 1800, // 30 minutos em segundos
    cacheTTL: 3600, // 1 hora em segundos
  
    // Funcionalidades
    debugMode: true, // false em produção
    maintenanceMode: false
  };
  
  // =============================================
  // 2. CONFIGURAÇÕES DE INTEGRAÇÃO (EMAILJS)
  // =============================================
  const EmailJSConfig = {
    serviceID: "service_vz4bceg", // Seu Service ID real
    templateID: "template_p28xvac", // Seu Template ID real
    publicKey: "cbT_hzYhhTb2mGX21", // Sua Public Key
    privateKey: process.env.EMAILJS_PRIVATE_KEY || "", // Só no server-side
  
    // Templates adicionais
    templates: {
      newsletter: "template_newsletter123",
      support: "template_support456"
    },
  
    // Limites
    rateLimit: 200, // Emails/dia
    timeout: 10000 // 10 segundos
  };
  
  // =============================================
  // 3. CONFIGURAÇÕES DE SEO
  // =============================================
  const SeoConfig = {
    defaultTitle: "Conexão Visual | Marketing Digital em Luanda",
    defaultDescription: "Agência especializada em soluções digitais para negócios em Angola",
    defaultImage: "/assets/images/social-share.jpg",
    
    // Schema.org
    companyInfo: {
      type: "ProfessionalService",
      name: "Conexão Visual",
      url: "https://conexaovisual.vercel.app",
      logo: "/assets/images/logo-schema.jpg",
      foundingDate: "2024-01-01",
      founders: ["Fundador 1", "Fundador 2"],
      address: {
        street: "Rua da Tecnologia, 123",
        city: "Luanda",
        region: "Luanda",
        postalCode: "1234-567",
        country: "Angola"
      },
      geoCoordinates: {
        latitude: "-8.838333",
        longitude: "13.234444"
      },
      contactPoints: [
        {
          type: "CustomerService",
          telephone: "+244123456789",
          contactType: "sales",
          areaServed: "AO"
        }
      ]
    }
  };
  
  // =============================================
  // 4. CONFIGURAÇÕES DE SEGURANÇA
  // =============================================
  const SecurityConfig = {
    // CORS
    allowedOrigins: [
      "https://conexaovisual.vercel.app",
      "https://www.conexaovisual.vercel.app"
    ],
  
    // Content Security Policy
    cspDirectives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.emailjs.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"]
    },
  
    // Cookies
    cookieSettings: {
      secure: true,
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 86400 // 1 dia
    }
  };
  
  // =============================================
  // 5. EXPORTAÇÃO SEGURA
  // =============================================
  // Exporta apenas o necessário para o client-side
  if (typeof window !== 'undefined') {
    window.CONFIG = {
      App: {
        name: AppConfig.appName,
        version: AppConfig.appVersion,
        debug: AppConfig.debugMode,
        baseUrl: AppConfig.baseUrl
      },
      EmailJS: {
        serviceID: EmailJSConfig.serviceID,
        templateID: EmailJSConfig.templateID,
        publicKey: EmailJSConfig.publicKey
      },
      SEO: {
        title: SeoConfig.defaultTitle,
        description: SeoConfig.defaultDescription
      }
    };
  }
  
  // Exportação completa para server-side
  export {
    AppConfig,
    EmailJSConfig,
    SeoConfig,
    SecurityConfig
  };