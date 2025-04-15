/**
 * MAP.JS - OTIMIZAÇÃO AVANÇADA PARA SEO EM SPAs
 * Versão: 2.1
 * Autor: Conexão Visual
 * Data: 15/06/2024
 */

// Configurações (podem ser movidas para config.js)
const SITE_CONFIG = {
  url: 'https://conexaovisual.vercel.app',
  name: 'Conexão Visual',
  description: 'Agência de Marketing Digital em Luanda, Angola',
  defaultImage: 'https://conexaovisual.vercel.app/icone/conexao-social-share.jpg'
};

document.addEventListener('DOMContentLoaded', function() {
  // ======================
  // 1. SCHEMA MARKUP DINÂMICO
  // ======================
  function injectSchemaMarkup() {
    const schemaMarkup = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "url": SITE_CONFIG.url,
      "name": SITE_CONFIG.name,
      "description": SITE_CONFIG.description,
      "image": SITE_CONFIG.defaultImage,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Luanda",
        "addressRegion": "Luanda",
        "addressCountry": "AO"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-8.838333",
        "longitude": "13.234444"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${SITE_CONFIG.url}/#!search?term={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    // Remove schema antigo se existir
    const oldSchema = document.querySelector('script[type="application/ld+json"]');
    if (oldSchema) oldSchema.remove();

    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.text = JSON.stringify(schemaMarkup);
    document.head.appendChild(scriptTag);
  }

  // ======================
  // 2. GERENCIAMENTO DE ROTAS
  // ======================
  function initRouting() {
    // Normaliza URLs hashbang
    function normalizeHashbang() {
      if (window.location.hash && !window.location.hash.startsWith('#!')) {
        history.replaceState(null, null, `#!${window.location.hash.substring(1)}`);
      }
      dispatchRouteEvent();
    }

    // Dispara evento para crawlers
    function dispatchRouteEvent() {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('routechange', {
          detail: { path: window.location.hash }
        }));
      }, 50);
    }

    // Configura listeners
    window.addEventListener('load', normalizeHashbang);
    window.addEventListener('hashchange', normalizeHashbang);
    
    // Atualiza título da página baseado na rota
    window.addEventListener('routechange', function(e) {
      const routeTitles = {
        '#!about': 'Sobre Nós - ' + SITE_CONFIG.name,
        '#!services': 'Serviços - ' + SITE_CONFIG.name,
        '#!portfolio': 'Portfólio - ' + SITE_CONFIG.name
      };
      
      document.title = routeTitles[e.detail.path] || SITE_CONFIG.name;
    });
  }

  // ======================
  // 3. PRÉ-RENDERIZAÇÃO PARA BOTS
  // ======================
  function handlePrerender() {
    const botPattern = /Googlebot|bingbot|Slurp|DuckDuckBot|Baiduspider/i;
    
    if (botPattern.test(navigator.userAgent)) {
      const path = window.location.hash.replace('#!', '') || 'home';
      const prerenderUrl = `/prerender?path=${encodeURIComponent(path)}&v=${Date.now()}`;
      
      fetch(prerenderUrl)
        .then(response => {
          if (!response.ok) throw new Error('Prerender failed');
          return response.text();
        })
        .then(html => {
          document.open();
          document.write(html);
          document.close();
        })
        .catch(error => {
          console.warn('Prerender fallback:', error);
          injectFallbackMeta();
        });
    }
  }

  function injectFallbackMeta() {
    const meta = document.createElement('meta');
    meta.name = 'fragment';
    meta.content = '!';
    document.head.appendChild(meta);
  }

  // ======================
  // INICIALIZAÇÃO
  // ======================
  function init() {
    injectSchemaMarkup();
    initRouting();
    handlePrerender();
    
    // Debug
    if (process.env.NODE_ENV === 'development') {
      console.log('SEO Module initialized:', {
        config: SITE_CONFIG,
        route: window.location.hash
      });
    }
  }

  init();
});

// Exportação para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initSEO: function() {
      document.dispatchEvent(new Event('DOMContentLoaded'));
    },
    SITE_CONFIG // Expõe configurações para outros módulos
  };
}