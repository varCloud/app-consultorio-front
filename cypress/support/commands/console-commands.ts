Cypress.Commands.add('trackConsoleErrors', () => {
  const errors: string[] = [];
  cy.on('window:before:load', (win) => {
    cy.stub(win.console, 'error').callsFake((...args: unknown[]) => {
      errors.push(args.join(' '));
    });
  });
  cy.wrap(errors, { log: false }).as('consoleErrors');
});

Cypress.Commands.add('assertNoConsoleErrors', () => {
  cy.get('@consoleErrors').then((errors) => {
    const list = errors as unknown as string[];
    expect(list, list.join('\n')).to.have.length(0);
  });
});
