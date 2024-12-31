describe('Settings', () => {
  const user = {
    email: 'email@gmail.com',
    token: 'token',
    username: 'username',
    bio: 'bio',
    image: 'image'
  };

  const updatedSettings = {
    image: 'new image',
    username: 'new username',
    bio: 'new bio',
    email: 'newemail@gmail.com',
    password: '12345678'
  };

  function startBackend(): void {
    cy.intercept('GET', 'api/user', { user }).as('getCurrentUser');
    cy.intercept('PUT', 'api/user', { user: updatedSettings }).as('updateSettings');
  }

  const imageInput = () => cy.get('#image');
  const usernameInput = () => cy.get('#username');
  const bioInput = () => cy.get('#bio');
  const emailInput = () => cy.get('#email');
  const passwordInput = () => cy.get('#password');
  const errorMessage = () => cy.get('div.mb-3 > .invalid-feedback > div');
  const passwordToggleButton = () => cy.get('button[type="button"].btn-outline-primary');
  const submitButton = () => cy.get('button[type="submit"]');

  beforeEach(() => {
    window.localStorage.setItem('jwtToken', user.token);
    startBackend();
  });

  it('should display a settings page', () => {
    cy.visit('/settings');
    cy.wait('@getCurrentUser');
    cy.contains('h1', 'Your Settings');

    submitButton().should('be.visible').and('be.disabled');
    imageInput().should('have.value', user.image);
    imageInput().type(updatedSettings.image);

    usernameInput().should('have.value', user.username);
    usernameInput().clear().blur();
    errorMessage().should('be.visible').and('contain', 'The username is required');
    usernameInput().type('us');
    errorMessage()
      .should('be.visible')
      .and('contain', 'The username must be at least 3 characters long');
    usernameInput().clear();
    usernameInput().type(updatedSettings.username);
    errorMessage().should('not.exist');

    bioInput().should('have.value', user.bio);
    bioInput().clear();
    bioInput().type(updatedSettings.bio);

    emailInput().should('have.value', user.email);
    emailInput().clear().blur();
    errorMessage().should('be.visible').and('contain', 'The email is required');
    emailInput().type('email@');
    errorMessage().should('be.visible').and('contain', 'The email must be a valid email address');
    emailInput().clear();
    emailInput().type(updatedSettings.email);
    errorMessage().should('not.exist');

    passwordInput().focus().blur();
    errorMessage().should('be.visible').and('contain', 'The password is required');
    passwordInput().type('1234');
    errorMessage()
      .should('be.visible')
      .and('contain', 'The password must be at least 8 characters long');
    passwordInput().clear();
    passwordInput().type(updatedSettings.password);
    errorMessage().should('not.exist');
    passwordToggleButton().click();
    passwordInput().should('have.attr', 'type', 'text');
    passwordToggleButton().click();
    passwordInput().should('have.attr', 'type', 'password');
    submitButton().click();

    cy.wait('@updateSettings');
    cy.get('.navbar-nav .nav-link').eq(3).should('contain', updatedSettings.username);
  });

  it('should display backend errors if settings update fails', () => {
    cy.intercept('PUT', 'api/user', {
      statusCode: 404,
      body: {
        errors: {
          username: ['has already been taken'],
          'email or password': ['is invalid']
        }
      }
    }).as('failedUpdateSettings');

    cy.visit('/settings');
    cy.wait('@getCurrentUser');

    imageInput().clear();
    imageInput().type(updatedSettings.image);
    usernameInput().clear();
    usernameInput().type(updatedSettings.username);
    bioInput().clear();
    bioInput().type(updatedSettings.bio);
    emailInput().clear();
    emailInput().type(updatedSettings.email);
    passwordInput().type(updatedSettings.password);
    submitButton().click();

    cy.wait('@failedUpdateSettings');
    cy.get('.alert-danger').should('contain', 'username has already been taken');
    cy.get('.alert-danger').should('contain', 'email or password is invalid');
  });

  it('should log out the user', () => {
    cy.visit('/settings');
    cy.wait('@getCurrentUser');
    cy.get('button.btn-outline-danger').click();
    cy.location('pathname')
      .should('eq', '/')
      .and(() => expect(localStorage.getItem('jwtToken')).to.eq(null));
    cy.get('.navbar-nav .nav-link').should('have.length', 3);
  });
});
