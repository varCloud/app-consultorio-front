function visitarFormulario() {
  cy.fixture('notas-medicas/notas-medicas').then((notas) => {
    cy.loginBypass(`${notas.routes.agregarNota}?idPaciente=1&editar=true`);
  });
}

describe('Notas médicas - agregar nota', () => {
  it('muestra "Required" en los campos obligatorios vacíos al intentar guardar', () => {
    cy.fixture('notas-medicas/notas-medicas').then((notas) => {
      cy.loginBypass(`${notas.routes.agregarNota}?idPaciente=1&editar=true`);
      cy.contains('button', 'Guardar').click();
      cy.get(notas.selectors.invalidFeedback).should('have.length.greaterThan', 0);
      cy.get(notas.selectors.invalidFeedback).first().should('be.visible').and('contain.text', 'Required');
    });
  });

  it('guarda la nota médica con los datos capturados y muestra el diálogo de éxito', () => {
    visitarFormulario();
    cy.intercept('POST', '**/notas/guardarNotaMedica', {
      statusCode: 200,
      body: { estatus: 200, mensaje: 'Nota médica guardada con éxito', modelo: { idNotaMedica: 99 } },
    }).as('guardar');

    cy.fillNotaMedicaForm();
    cy.contains('button', 'Guardar').click();

    cy.wait('@guardar').its('request.body').then((body) => {
      expect(body.idPaciente).to.eq('1');
      expect(body.peso).to.eq('70');
      // Quill serializa el espacio como &nbsp; en vez de un espacio normal.
      expect(body.motivoConsulta).to.contain('Dolor').and.contain('cabeza');
    });
    cy.get('.swal2-popup').should('contain.text', 'Nota médica guardada con éxito');
    cy.contains('.swal2-confirm', 'Imprimir nota medica').should('be.visible');
  });

  it('no muestra el diálogo de éxito cuando el backend responde un estatus de error', () => {
    visitarFormulario();
    cy.intercept('POST', '**/notas/guardarNotaMedica', {
      statusCode: 200,
      body: { estatus: 400, mensaje: 'No se pudo guardar la nota', modelo: null },
    }).as('guardarRechazado');

    cy.fillNotaMedicaForm();
    cy.contains('button', 'Guardar').click();

    cy.wait('@guardarRechazado');
    cy.get('.swal2-popup').should('not.exist');
    cy.location('pathname').should('include', '/notas/agregar-nota');
  });

  it('no rompe la pantalla cuando la petición de guardado falla (500)', () => {
    visitarFormulario();
    cy.intercept('POST', '**/notas/guardarNotaMedica', { statusCode: 500, body: {} }).as('guardarError');

    cy.fillNotaMedicaForm();
    cy.contains('button', 'Guardar').click();

    cy.wait('@guardarError');
    cy.get('.swal2-popup').should('not.exist');
    cy.get('body').should('be.visible');
  });
});
