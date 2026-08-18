Cypress.Commands.add('fillNotaMedicaForm', () => {
  cy.fixture('notas-medicas/notas-medicas').then((notas) => {
    const campos = notas.selectors.campos;
    cy.get(campos.peso).type('70');
    cy.get(campos.talla).type('170');
    cy.get(campos.temperatura).type('36.5');
    cy.get(campos.saturacion).type('98');
    cy.get(campos.ta).type('120/80');
    cy.get(campos.fc).type('72');
    cy.get(campos.fr).type('16');
    cy.get(notas.selectors.editores.motivoConsulta).type('Dolor de cabeza');
    cy.get(notas.selectors.editores.diagnostico).type('Migraña');
    cy.get(notas.selectors.editores.laboratorios).type('Sin laboratorios');
    cy.get(notas.selectors.editores.tratamiento).type('Paracetamol 500mg');
  });
});
