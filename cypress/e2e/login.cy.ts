describe('Login', () => {
  const user = {
    email: 'email',
    token: 'token',
    username: 'username',
    bio: 'bio',
    image: 'image'
  };

  const emailInput = () => cy.get('#email');
  const passwordInput = () => cy.get('#password');
  const errorMessage = () => cy.get('div.mb-3 .invalid-feedback > div');
  const passwordToggleButton = () => cy.get('button[type="button"].btn-outline-primary');
  const submitButton = () => cy.get('button[type="submit"]');

  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display a login page', () => {
    cy.intercept('POST', 'api/users/login', { user }).as('loginUser');

    cy.contains('h1', 'Sign in');
    cy.contains('a', "Don't have an account?").should('have.attr', 'href', '/register');

    submitButton().should('be.visible').and('be.disabled');
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

    cy.wait('@loginUser');
    cy.location('pathname').should('eq', '/');
  });

  it('should display errors if login fails', () => {
    cy.intercept('POST', 'api/users/login', {
      statusCode: 404,
      body: {
        errors: {
          email: ['already exists'],
          'email or password': ['is invalid']
        }
      }
    }).as('failedLoginUser');

    emailInput().type('email@gmail.com');
    passwordInput().type('password');
    submitButton().click();

    cy.wait('@failedLoginUser');
    cy.location('pathname').should('eq', '/login');

    cy.get('.alert-danger').should('contain', 'email already exists');
    cy.get('.alert-danger').should('contain', 'email or password is invalid');
  });
});
