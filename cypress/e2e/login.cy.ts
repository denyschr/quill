describe('Login', () => {
  const mockUser = {
    email: 'jack@gmail.com',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo',
    username: 'jack',
    bio: 'I work at a state farm',
    image: 'https://i.stack.imgur.com/xHWG8.jpg'
  };

  const emailInput = () => cy.get('input[type=email]');
  const passwordInput = () => cy.get('input[type=password]');
  const errorMessage = () => cy.get('div.mb-3 > .invalid-feedback > div');
  const passwordToggleButton = () => cy.get('button.btn-outline-primary');
  const submitButton = () => cy.get('button[type=submit]');

  it('should display a login page', () => {
    cy.intercept('POST', 'api/users/login', { user: mockUser }).as('loginUser');
    cy.visit('/login');

    cy.contains('h1', 'Sign in');
    cy.contains('a', "Don't have an account?").should('have.attr', 'href', '/register');

    submitButton().should('be.visible').and('be.disabled');
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
    cy.wait('@loginUser');

    cy.location('pathname').should('eq', '/');
  });

  it('should display backend errors if login fails', () => {
    cy.intercept('POST', 'api/users/login', {
      statusCode: 404,
      body: {
        errors: {
          email: ['already exists'],
          'email or password': ['is invalid']
        }
      }
    }).as('failedLoginUser');
    cy.visit('/login');

    emailInput().type('jack@gmail.com');
    passwordInput().type('12345678');

    submitButton().click();
    cy.wait('@failedLoginUser');

    cy.location('pathname').should('eq', '/login');

    cy.get('.alert-danger').should('contain', 'email already exists');
    cy.get('.alert-danger').should('contain', 'email or password is invalid');
  });
});
