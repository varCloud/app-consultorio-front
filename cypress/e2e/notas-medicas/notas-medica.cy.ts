describe('Notas médicas - listado', () => {
  it('carga el listado de notas médicas sin errores en consola', () => {
    cy.trackConsoleErrors();
    cy.fixture('notas-medicas/notas-medicas').then((notas) => {
      cy.loginBypass(notas.routes.notas);
      cy.location('pathname', { timeout: 10000 }).should('include', notas.routes.notas);
    });
    cy.get('body').should('be.visible');
    cy.assertNoConsoleErrors();
  });
});
