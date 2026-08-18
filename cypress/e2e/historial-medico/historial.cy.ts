function mockPacientes(historial: any) {
  cy.mockApi();
  cy.intercept('POST', '**/paciente/obtenerPacientes', {
    statusCode: 200,
    body: { estatus: 200, mensaje: 'ok', modelo: [historial.paciente] },
  }).as('pacientes');
}

describe('Historial médico', () => {
  it('abre el dropdown de selección de paciente', () => {
    cy.fixture('historial-medico/historial').then((historial) => {
      cy.loginBypass(historial.routes.historial);
      cy.get(historial.selectors.ngSelect, { timeout: 10000 }).first().click();
      cy.get(historial.selectors.dropdownPanel, { timeout: 5000 }).should('exist');
    });
  });

  it('BUG: las opciones del selector de paciente se renderizan sin texto y no se pueden elegir', () => {
    // lstPacientes arranca sin inicializar (`lstPacientes` sin `= []` en
    // historial.component.ts) y las <ng-option> se generan con *ngFor sobre ese
    // arreglo. Cuando la lista llega async, el <span class="ng-option-label">
    // queda vacío: la opción existe (aria-posinset/aria-setsize correctos) pero
    // sin texto, así que ni el click ni la búsqueda por texto la seleccionan
    // (buscar "Juan" muestra "No se encontraron coincidencias"). Por eso no hay
    // pruebas de "seleccionar paciente y cargar sus notas" en este spec - ese
    // flujo está roto en la UI tal como está hoy.
    cy.fixture('historial-medico/historial').then((historial) => {
      mockPacientes(historial);
      cy.visitWithSession(historial.routes.historial);
      cy.wait('@pacientes');

      cy.get(historial.selectors.ngSelect).click();
      cy.get(historial.selectors.dropdownPanel).should('exist');
      cy.get('.ng-option').should('have.length', 1).first().invoke('text').should('eq', '');

      cy.get('ng-select input').type('Juan', { force: true });
      cy.contains('No se encontraron coincidencias').should('be.visible');
    });
  });
});
