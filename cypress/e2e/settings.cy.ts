describe('Settings', () => {
  const mockUser = {
    email: 'jack@gmail.com',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo',
    username: 'jack',
    bio: 'I work at a state farm',
    image: 'https://i.stack.imgur.com/xHWG8.jpg'
  };

  const mockNewUser = {
    ...mockUser,
    username: 'john',
    bio: 'I do karate'
  };

  const startBackend = (): void => {
    cy.intercept('GET', 'api/user', { user: mockUser }).as('getCurrentUser');
    cy.intercept('PUT', 'api/user', { user: mockNewUser }).as('updateSettings');
  };

  const getImageUrlInput = () => cy.get('[data-test=image-url-input]');
  const getUsernameInput = () => cy.get('[data-test=username-input]');
  const getBioInput = () => cy.get('[data-test=bio-input]');
  const getEmailInput = () => cy.get('[data-test=email-input]');
  const getPasswordInput = () => cy.get('[data-test=password-input]');
  const getValidationErrorMessage = () => cy.get('.invalid-feedback');
  const getPasswordToggleButton = () => cy.get('[data-test=toggle-password-button]');
  const getSubmitButton = () => cy.get('[data-test=submit-button]');

  beforeEach(() => {
    localStorage.setItem('jwtToken', mockUser.token);
    startBackend();
  });

  it('should display a settings page', () => {
    cy.visit('/settings');
    cy.wait('@getCurrentUser');

    cy.contains('h1', 'Settings');

    getSubmitButton().should('be.visible').and('be.disabled');
    getImageUrlInput().should('have.value', mockUser.image);

    getUsernameInput().should('have.value', mockUser.username);
    getUsernameInput().clear().blur();
    getValidationErrorMessage().should('be.visible').and('contain', 'The username is required');
    getUsernameInput().type('us');
    getValidationErrorMessage()
      .should('be.visible')
      .and('contain', 'The username must be at least 3 characters long');
    getUsernameInput().clear();
    getUsernameInput().type(mockNewUser.username);
    getValidationErrorMessage().should('not.be.visible');

    getBioInput().should('have.value', mockUser.bio);
    getBioInput().clear();
    getBioInput().type(mockNewUser.bio);

    getEmailInput().should('have.value', mockUser.email);
    getEmailInput().clear().blur();
    getValidationErrorMessage().should('be.visible').and('contain', 'The email is required');
    getEmailInput().type('email@');
    getValidationErrorMessage()
      .should('be.visible')
      .and('contain', 'The email must be a valid email address');
    getEmailInput().clear();
    getEmailInput().type(mockUser.email);
    getValidationErrorMessage().should('not.be.visible');

    getPasswordInput().type('1234').blur();
    getValidationErrorMessage()
      .should('be.visible')
      .and('contain', 'The password must be at least 8 characters long');
    getPasswordInput().clear();
    getValidationErrorMessage().should('not.be.visible');
    getPasswordToggleButton().click();
    getPasswordInput().should('have.attr', 'type', 'text');
    getPasswordToggleButton().click();
    getPasswordInput().should('have.attr', 'type', 'password');

    getSubmitButton().click();
    cy.wait('@updateSettings');

    cy.location('pathname').should('eq', `/profile/${mockNewUser.username}`);
    cy.get('[data-test=navbar-link]').last().should('contain', mockNewUser.username);
  });

  it('should display backend errors if updating the user fails', () => {
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

    getUsernameInput().clear();
    getUsernameInput().type(mockNewUser.username);

    getSubmitButton().click();
    cy.wait('@failedUpdateSettings');

    const getErrorMessage = () => cy.get('[data-test=error-message]');

    getErrorMessage().should('contain', 'username has already been taken');
    getErrorMessage().should('contain', 'email or password is invalid');
  });

  it('should log out the user', () => {
    cy.visit('/settings');
    cy.wait('@getCurrentUser');

    cy.get('[data-test=logout-button]').click();
    cy.location('pathname')
      .should('eq', '/')
      .and(() => expect(localStorage.getItem('jwtToken')).to.eq(null));
    cy.get('[data-test=navbar-link]').should('have.length', 3);
  });
});
