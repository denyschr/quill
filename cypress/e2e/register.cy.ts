describe('Register', () => {
  const mockUser = {
    email: 'jack@gmail.com',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo',
    username: 'jack',
    bio: 'I work at a state farm',
    image: 'https://i.stack.imgur.com/xHWG8.jpg'
  };

  const getUsernameInput = () => cy.get('[data-test=username-input]');
  const getEmailInput = () => cy.get('[data-test=email-input]');
  const getPasswordInput = () => cy.get('[data-test=password-input]');
  const getValidationErrorMessage = () => cy.get('.invalid-feedback');
  const getPasswordToggleButton = () => cy.get('[data-test=toggle-password-button]');
  const getSubmitButton = () => cy.get('[data-test=submit-button]');

  it('should display a register page', () => {
    cy.intercept('POST', 'api/users', { user: mockUser }).as('registerUser');
    cy.visit('/register');

    cy.contains('h1', 'Sign up');
    cy.contains('a', 'Have an account?').should('have.attr', 'href', '/login');

    getSubmitButton().should('be.visible').and('be.disabled');
    getUsernameInput().focus().blur();
    getValidationErrorMessage().should('be.visible').and('contain', 'The username is required');
    getUsernameInput().type('ja');
    getValidationErrorMessage()
      .should('be.visible')
      .and('contain', 'The username must be at least 3 characters long');
    getUsernameInput().clear();
    getUsernameInput().type('jack');
    getValidationErrorMessage().should('not.be.visible');

    getEmailInput().focus().blur();
    getValidationErrorMessage().should('be.visible').and('contain', 'The email is required');
    getEmailInput().type('jack@');
    getValidationErrorMessage()
      .should('be.visible')
      .and('contain', 'The email must be a valid email address');
    getEmailInput().clear();
    getEmailInput().type('jack@gmail.com');
    getValidationErrorMessage().should('not.be.visible');

    getPasswordInput().focus().blur();
    getValidationErrorMessage().should('be.visible').and('contain', 'The password is required');
    getPasswordInput().type('1234');
    getValidationErrorMessage()
      .should('be.visible')
      .and('contain', 'The password must be at least 8 characters long');
    getPasswordInput().clear();
    getPasswordInput().type('12345678');
    getValidationErrorMessage().should('not.be.visible');

    getPasswordToggleButton().click();
    getPasswordInput().should('have.attr', 'type', 'text');
    getPasswordToggleButton().click();
    getPasswordInput().should('have.attr', 'type', 'password');

    getSubmitButton().click();
    cy.wait('@registerUser');

    cy.location('pathname').should('eq', '/');
  });

  it('should display backend errors if registration fails', () => {
    cy.intercept('POST', 'api/users', {
      statusCode: 404,
      body: {
        errors: {
          username: ['has already been taken'],
          'email or password': ['is invalid']
        }
      }
    }).as('failedRegisterUser');
    cy.visit('/register');

    getUsernameInput().type('jack');
    getEmailInput().type('jack@gmail.com');
    getPasswordInput().type('12345678');

    getSubmitButton().click();
    cy.wait('@failedRegisterUser');

    cy.location('pathname').should('eq', '/register');

    const getErrorMessage = () => cy.get('[data-test=error-message]');

    getErrorMessage().should('contain', 'username has already been taken');
    getErrorMessage().should('contain', 'email or password is invalid');
  });
});
