module.exports = {
    ci: {
      collect: {
        startServerCommand: 'npm run start',
        startServerReadyPattern: 'Ready in',  // Correspond à votre output
        url: ['http://localhost:3000'],
        numberOfRuns: 1,  // Réduire pour tester
        settings: {
          skipAudits: ['uses-http2'],  // Skip HTTPS checks
          onlyCategories: ['performance', 'seo'],  // Focus sur l'essentiel
        },
      },
    },
  };