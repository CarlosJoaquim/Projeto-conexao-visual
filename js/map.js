// map.js - Otimização para SEO de Single Page Applications (SPA)
document.addEventListener('DOMContentLoaded', function() {
    // 1. Configuração do Schema Markup dinâmico
    const schemaMarkup = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://conexaovisual.vercel.app/",
      "name": "Conexão Visual",
      "description": "Especialistas em Marketing Digital, Design Gráfico e Desenvolvimento Web",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://conexaovisual.vercel.app/#!search?term={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };
  
    // 2. Injeção do Schema no DOM
    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.text = JSON.stringify(schemaMarkup);
    document.head.appendChild(scriptTag);
  
    // 3. Controle de URLs hashbang para SEO
    function handleHashbangRouting() {
      if (window.location.hash) {
        const hash = window.location.hash.replace('#!', '');
        if (hash && !window.location.hash.startsWith('#!')) {
          history.replaceState(null, null, `#!${hash}`);
        }
        
        // Dispara evento para crawlers
        setTimeout(() => {
          window.dispatchEvent(new Event('hashchange'));
        }, 100);
      }
    }
  
    // 4. Configuração inicial
    handleHashbangRouting();
  
    // 5. Monitoramento de mudanças de rota
    window.addEventListener('hashchange', handleHashbangRouting);
  
    // 6. Pré-renderização para bots (opcional)
    if (/Googlebot|bingbot|Slurp|DuckDuckBot|Baiduspider/i.test(navigator.userAgent)) {
      const path = window.location.hash.replace('#!', '');
      fetch(`/prerender?path=${encodeURIComponent(path)}`)
        .then(response => response.text())
        .then(html => {
          document.open();
          document.write(html);
          document.close();
        });
    }
  });
  
  // 7. Exportação para uso em módulos (se necessário)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      initSEO: function() {
        // Função para inicialização manual
        document.dispatchEvent(new Event('DOMContentLoaded'));
      }
    };
  }