Cypress.Commands.add('fillLoginForm', (usuario: string, contrasena: string) => {
  cy.fixture('auth/login').then((login) => {
    cy.get(login.selectors.usuario).clear().type(usuario);
    cy.get(login.selectors.contrasena).clear().type(contrasena);
    cy.get(login.selectors.submit).click();
  });
});
