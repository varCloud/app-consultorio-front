describe('Pacientes - listado', () => {
  it('carga el listado de pacientes sin errores en consola', () => {
    cy.trackConsoleErrors();
    cy.fixture('pacientes/paciente').then((paciente) => {
      cy.loginBypass(paciente.routes.list);
      cy.location('pathname', { timeout: 10000 }).should('include', paciente.routes.list);
    });
    cy.get('body').should('be.visible');
    cy.assertNoConsoleErrors();
  });
});
