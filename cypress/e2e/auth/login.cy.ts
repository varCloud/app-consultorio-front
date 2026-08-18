describe('Login', () => {
  it('redirige a login cuando no hay sesión activa', () => {
    cy.visit('/pacientes/paciente');
    cy.location('pathname', { timeout: 10000 }).should('include', '/auth/login');
  });

  it('bloquea el envío con campos requeridos vacíos', () => {
    cy.visit('/auth/login');
    cy.get('button[type="submit"]').click();
    cy.contains('button[type="submit"]', 'Iniciar Sesión').should('exist');
    cy.location('pathname').should('include', '/auth/login');
  });

  it('inicia sesión con credenciales válidas, envía la contraseña hasheada y redirige', () => {
    cy.intercept('POST', '**/paciente/login', {
      statusCode: 200,
      body: {
        estatus: 200,
        mensaje: 'ok',
        model: { idPaciente: 1, nombre: 'Doctor Test', tipoUsuario: 1, tokenWs: 'fake-token' },
      },
    }).as('login');

    cy.visit('/auth/login');
    cy.fillLoginForm('doctor@test.com', 'password123');

    cy.wait('@login').its('request.body').then((body) => {
      expect(body.usuario).to.eq('doctor@test.com');
      // generarContrasena (HmacSHA256) hashea la contraseña antes de mandarla - nunca debe viajar en claro.
      expect(body.contrasena).to.be.a('string').and.not.eq('password123');
    });

    cy.location('pathname', { timeout: 10000 }).should('include', '/pacientes/paciente');
    cy.window().its('localStorage').invoke('getItem', 'sesionActiva').should('eq', 'true');
  });

  it('muestra un toast y limpia la contraseña cuando el backend rechaza las credenciales', () => {
    cy.intercept('POST', '**/paciente/login', {
      statusCode: 200,
      body: { estatus: 400, mensaje: 'Usuario o contraseña incorrectos', modelo: null },
    }).as('loginRechazado');

    cy.visit('/auth/login');
    cy.fillLoginForm('doctor@test.com', 'wrongpass');

    cy.wait('@loginRechazado');
    cy.get('.swal2-toast', { timeout: 5000 }).should('contain.text', 'Usuario o contraseña incorrectos');
    cy.location('pathname').should('include', '/auth/login');
    cy.get('#txtContrasena').should('have.value', '');
  });

  it('muestra un toast de error cuando la petición de login falla (500)', () => {
    cy.intercept('POST', '**/paciente/login', { statusCode: 500, body: {} }).as('loginError');

    cy.visit('/auth/login');
    cy.fillLoginForm('doctor@test.com', 'password123');

    cy.wait('@loginError');
    cy.get('.swal2-toast', { timeout: 5000 }).should('exist');
    cy.location('pathname').should('include', '/auth/login');
    cy.get('#txtContrasena').should('have.value', '');
  });
});
