// PerfilComponent no hace ninguna llamada HTTP en ngOnInit (solo arma el FormGroup),
// así que no usamos loginBypass()/mockApi() aquí - el wildcard genérico le ganaría
// (por orden de registro) al intercept específico de cada prueba sobre guardar().
function visitarPerfil(sesion: Record<string, unknown> = {}) {
  cy.fixture('perfil-doc/perfil').then((perfil) => {
    cy.visitWithSession(perfil.routes.perfil, sesion);
  });
}

describe('Perfil doctor', () => {
  it('carga la pantalla de perfil sin errores en consola', () => {
    cy.trackConsoleErrors();
    visitarPerfil();
    cy.get('body').should('be.visible');
    cy.assertNoConsoleErrors();
  });

  it('guarda el perfil enviando los datos de sesión actuales al backend', () => {
    visitarPerfil({ colorFondoEncabezados: '#112233' });
    cy.intercept('POST', '**/paciente/actualizarPerfilUsuario', {
      statusCode: 200,
      body: { estatus: 200, mensaje: 'Perfil actualizado con éxito', modelo: null },
    }).as('guardar');

    cy.contains('button', 'Guardar').click();

    cy.wait('@guardar').its('request.body').then((body) => {
      expect(body).to.have.property('nombre', 'Test');
      expect(body).to.have.property('colorFondoEncabezados', '#112233');
    });
    cy.get('.swal2-popup').should('contain.text', 'Perfil actualizado con éxito');
  });

  it('BUG: muestra un toast de éxito aunque el backend responda un estatus de error', () => {
    // guardar() no valida data.estatus antes de mostrar el toast de éxito - ver perfil.component.ts.
    visitarPerfil();
    cy.intercept('POST', '**/paciente/actualizarPerfilUsuario', {
      statusCode: 200,
      body: { estatus: 400, mensaje: 'No se pudo actualizar el perfil', modelo: null },
    }).as('guardarRechazado');

    cy.contains('button', 'Guardar').click();

    cy.wait('@guardarRechazado');
    cy.get('.swal2-success', { timeout: 5000 }).should('exist');
  });
});
