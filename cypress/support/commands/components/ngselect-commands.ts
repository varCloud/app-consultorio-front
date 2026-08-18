// This app's ng-select usages are template-driven ([(ngModel)]), not reactive
// forms, so selection here is by CSS selector for the host element rather than
// by formcontrolname.
Cypress.Commands.add('ngSelectFirst', (selector: string) => {
  cy.get(selector).click();
  cy.get('.ng-dropdown-panel').should('exist');
  cy.get('.ng-option').first().click();
});

Cypress.Commands.add('ngSelectByText', (selector: string, text: string) => {
  cy.get(selector).click();
  cy.get('.ng-dropdown-panel').should('exist');
  cy.get('.ng-option').contains(text).click();
});
