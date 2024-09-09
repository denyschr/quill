describe('Register', () => {
  const user = {
    email: 'den@gmail.com',
    token: 'eyJ1c9VyIj7ImlkIjoz0DV9LCJpYXQmOjE3MjUxMjk1NzEsImV4cCI6MTczMDMxMzU3MX0',
    username: 'den',
    bio: null,
    image: 'https://api.realworld.io/images/smiley-cyrus.jpeg'
  };

  function startBackend(): void {
    cy.intercept('POST', 'api/users', user).as('registerUser');
  }

  const formFields = () => cy.get('#form-fields');
  const usernameInput = () => cy.get('#username');
  const emailInput = () => cy.get('#email');
  const passwordInput = () => cy.get('#password');
  const errorMessage = () => cy.get('.invalid-feedback');
  const passwordToggleButton = () => cy.get('.btn-outline-secondary');
  const submitButton = () => cy.get('button[type="submit"]');

  beforeEach(() => {
    cy.visit('/register');
    startBackend();
  });

  it('should display a register page', () => {
    cy.contains('h1', 'Sign up');
    cy.contains('a').contains('Have an account?').should('have.attr', 'href', '/login');
    formFields().should('be.visible').and('not.be.disabled');
    cy.get('button').should('be.visible').and('not.be.disabled');

    usernameInput().type('de');
    usernameInput().blur();
    errorMessage()
      .should('be.visible')
      .and('contain', 'The username must be at least 3 characters long.');
    usernameInput().clear();
    errorMessage().should('be.visible').and('contain', 'The username is required.');
    usernameInput().type('den');
    errorMessage().should('have.css', 'display', 'none');

    emailInput().type('den@');
    emailInput().blur();
    errorMessage().should('be.visible').and('contain', 'The email must be a valid email address.');
    emailInput().clear();
    errorMessage().should('be.visible').and('contain', 'The email is required.');
    emailInput().type('den@gmail.com');
    errorMessage().should('have.css', 'display', 'none');

    passwordInput().type('1234');
    passwordInput().blur();
    errorMessage()
      .should('be.visible')
      .and('contain', 'The password must be at least 8 characters long.');
    passwordInput().clear();
    errorMessage().should('be.visible').and('contain', 'The password is required');
    passwordInput().type('12345678');
    errorMessage().should('have.css', 'display', 'none');
    passwordToggleButton().click();
    passwordInput().should('have.attr', 'type', 'text');
    passwordToggleButton().click();
    passwordInput().should('have.attr', 'type', 'password');

    submitButton().click();
    formFields().should('be.disabled');
    submitButton().should('be.disabled');
    cy.wait('@registerUser');

    cy.location('pathname').should('eq', '/');
  });
});
