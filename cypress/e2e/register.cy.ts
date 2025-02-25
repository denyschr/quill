describe('Register', () => {
  const mockUser = {
    email: 'jack@gmail.com',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo',
    username: 'jack',
    bio: 'I work at a state farm',
    image: 'https://i.stack.imgur.com/xHWG8.jpg'
  };

  const usernameInput = () => cy.get('input[type=text]');
  const emailInput = () => cy.get('input[type=email]');
  const passwordInput = () => cy.get('input[type=password]');
  const errorMessage = () => cy.get('div.mb-3 > .invalid-feedback > div');
  const passwordToggleButton = () => cy.get('button.btn-outline-primary');
  const submitButton = () => cy.get('button[type=submit]');

  it('should display a register page', () => {
    cy.intercept('POST', 'api/users', { user: mockUser }).as('registerUser');
    cy.visit('/register');

    cy.contains('h1', 'Sign up');
    cy.contains('a', 'Have an account?').should('have.attr', 'href', '/login');

    submitButton().should('be.visible').and('be.disabled');
    usernameInput().focus().blur();
    errorMessage().should('be.visible').and('contain', 'The username is required');
    usernameInput().type('ja');
    errorMessage()
      .should('be.visible')
      .and('contain', 'The username must be at least 3 characters long');
    usernameInput().clear();
    usernameInput().type('jack');
    errorMessage().should('not.exist');

    emailInput().focus().blur();
    errorMessage().should('be.visible').and('contain', 'The email is required');
    emailInput().type('jack@');
    errorMessage().should('be.visible').and('contain', 'The email must be a valid email address');
    emailInput().clear();
    emailInput().type('jack@gmail.com');
    errorMessage().should('not.exist');

    passwordInput().focus().blur();
    errorMessage().should('be.visible').and('contain', 'The password is required');
    passwordInput().type('1234');
    errorMessage()
      .should('be.visible')
      .and('contain', 'The password must be at least 8 characters long');
    passwordInput().clear();
    passwordInput().type('12345678');
    errorMessage().should('not.exist');

    passwordToggleButton().click();
    cy.get('input#password').should('have.attr', 'type', 'text');
    passwordToggleButton().click();
    cy.get('input#password').should('have.attr', 'type', 'password');

    submitButton().click();
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

    usernameInput().type('jack');
    emailInput().type('jack@gmail.com');
    passwordInput().type('12345678');

    submitButton().click();
    cy.wait('@failedRegisterUser');

    cy.location('pathname').should('eq', '/register');

    cy.get('.alert-danger').should('contain', 'username has already been taken');
    cy.get('.alert-danger').should('contain', 'email or password is invalid');
  });
});
