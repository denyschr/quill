describe('Quill', () => {
  it('should display title on home page', () => {
    cy.visit('/');
    cy.contains('h1', 'Quill');
  });
});
