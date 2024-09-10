describe('Login', () => {
  const user = {
    email: 'den@gmail.com',
    token: 'eyJ1c9VyIj7ImlkIjoz0DV9LCJpYXQmOjE3MjUxMjk1NzEsImV4cCI6MTczMDMxMzU3MX0',
    username: 'den',
    bio: null,
    image: 'https://api.realworld.io/images/smiley-cyrus.jpeg'
  };

  function startBackend(): void {
    cy.intercept('POST', 'api/users/login', user).as('authenticateUser');
  }

  const formFields = () => cy.get('#form-fields');
  const emailInput = () => cy.get('#email');
  const passwordInput = () => cy.get('#password');
  const errorMessage = () => cy.get('.invalid-feedback');
  const passwordToggleButton = () => cy.get('.btn-outline-secondary');
  const submitButton = () => cy.get('button[type="submit"]');

  beforeEach(() => {
    startBackend();
    cy.visit('/login');
  });

  it('should display a login page', () => {
    cy.contains('h1', 'Sign in');
    cy.contains('a', "Don't have an account?").should('have.attr', 'href', '/register');
    formFields().should('be.visible').and('not.be.disabled');
    cy.get('button').should('be.visible').and('not.be.disabled');

    emailInput().type('den');
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
    errorMessage().should('be.visible').and('contain', 'The password is required.');
    passwordInput().type('12345678');
    errorMessage().should('have.css', 'display', 'none');
    passwordToggleButton().click();
    passwordInput().should('have.attr', 'type', 'text');
    passwordToggleButton().click();
    passwordInput().should('have.attr', 'type', 'password');

    submitButton().click();
    formFields().should('be.disabled');
    submitButton().should('be.disabled');
    cy.wait('@authenticateUser');

    cy.location('pathname').should('eq', '/');
  });
});
