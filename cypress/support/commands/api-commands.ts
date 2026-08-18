Cypress.Commands.add('mockApi', () => {
  cy.fixture('shared/api-envelope').then((envelope) => {
    cy.intercept('https://crm-consultorio-api.onrender.com/**', {
      statusCode: 200,
      body: envelope,
    }).as('api');
  });
});
