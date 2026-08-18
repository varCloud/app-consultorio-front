Cypress.Commands.add('abrirModalRegistroPaciente', () => {
  cy.contains('button', 'Registrar').click();
  cy.get('.modal-content', { timeout: 5000 }).should('be.visible');
});
