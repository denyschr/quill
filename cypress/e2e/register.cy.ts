describe('Register', () => {
  const user = {
    email: 'email',
    token: 'token',
    username: 'username',
    bio: 'bio',
    image: 'image'
  };

  const usernameInput = () => cy.get('#username');
  const emailInput = () => cy.get('#email');
  const passwordInput = () => cy.get('#password');
  const errorMessage = () => cy.get('div.mb-3 .invalid-feedback > div');
  const passwordToggleButton = () => cy.get('button[type="button"].btn-outline-primary');
  const submitButton = () => cy.get('button[type="submit"]');

  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display a register page', () => {
    cy.intercept('POST', 'api/users', { user }).as('registerUser');

    cy.contains('h1', 'Sign up');
    cy.contains('a', 'Have an account?').should('have.attr', 'href', '/login');

    submitButton().should('be.visible').and('be.disabled');
    usernameInput().focus();
    usernameInput().blur();
    errorMessage().should('be.visible').and('contain', 'The username is required');
    usernameInput().type('us');
    errorMessage()
      .should('be.visible')
      .and('contain', 'The username must be at least 3 characters long');
    usernameInput().clear();
    usernameInput().type('username');
    errorMessage().should('not.exist');

    emailInput().focus();
    emailInput().blur();
    errorMessage().should('be.visible').and('contain', 'The email is required');
    emailInput().type('email@');
    errorMessage().should('be.visible').and('contain', 'The email must be a valid email address');
    emailInput().clear();
    emailInput().type('email@gmail.com');
    errorMessage().should('not.exist');

    passwordInput().focus();
    passwordInput().blur();
    errorMessage().should('be.visible').and('contain', 'The password is required');
    passwordInput().type('1234');
    errorMessage()
      .should('be.visible')
      .and('contain', 'The password must be at least 8 characters long');
    passwordInput().clear();
    passwordInput().type('12345678');
    errorMessage().should('not.exist');
    passwordToggleButton().click();
    passwordInput().should('have.attr', 'type', 'text');
    passwordToggleButton().click();
    passwordInput().should('have.attr', 'type', 'password');
    submitButton().click();

    cy.wait('@registerUser');
    cy.location('pathname').should('eq', '/');
  });

  it('should display errors if registration fails', () => {
    cy.intercept('POST', 'api/users', {
      statusCode: 404,
      body: {
        errors: {
          username: ['has already been taken'],
          'email or password': ['is invalid']
        }
      }
    }).as('failedRegisterUser');

    usernameInput().type('username');
    emailInput().type('email@gmail.com');
    passwordInput().type('password');
    submitButton().click();

    cy.wait('@failedRegisterUser');
    cy.location('pathname').should('eq', '/register');

    cy.get('.alert-danger').should('contain', 'username has already been taken');
    cy.get('.alert-danger').should('contain', 'email or password is invalid');
  });
});
