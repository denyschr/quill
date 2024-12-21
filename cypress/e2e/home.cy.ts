describe('Home', () => {
  const user = {
    email: 'email@gmail.com',
    token: 'token',
    username: 'username',
    bio: 'bio',
    image: 'image'
  };

  function startBackend(): void {
    cy.intercept('GET', 'api/user', { user }).as('getUser');
  }

  const navbarBrand = () => cy.get('.navbar-brand');
  const navbarLink = () => cy.get('.navbar-nav .nav-link');

  beforeEach(() => {
    startBackend();
  });

  it('should display a navbar', () => {
    cy.visit('/');
    navbarBrand().should('contain', 'Quill').and('have.attr', 'href', '/');
    navbarLink().should('have.length', 3);
    navbarLink()
      .eq(0)
      .should('contain', 'Home')
      .and('have.class', 'active')
      .and('have.attr', 'href', '/');
    navbarLink()
      .eq(1)
      .should('contain', 'Sign in')
      .and('not.have.class', 'active')
      .and('have.attr', 'href', '/login');
    navbarLink()
      .eq(2)
      .should('contain', 'Sign up')
      .and('not.have.class', 'active')
      .and('have.attr', 'href', '/register');
  });

  it('should display a navbar collapsed on a small screen', () => {
    cy.viewport('iphone-6+');
    cy.visit('/');
    navbarBrand().should('contain', 'Quill');
    navbarLink().should('not.be.visible');
    cy.get('.navbar-toggler').click();
    navbarLink().should('be.visible');
  });

  it('should display a user', () => {
    window.localStorage.setItem('jwtToken', user.token);
    cy.visit('/');
    cy.wait('@getUser');

    navbarBrand().should('contain', 'Quill');
    navbarLink().should('have.length', 4);
    navbarLink()
      .eq(0)
      .should('contain', 'Home')
      .and('have.class', 'active')
      .and('have.attr', 'href', '/');
    navbarLink()
      .eq(1)
      .should('contain', 'New Article')
      .and('not.have.class', 'active')
      .and('have.attr', 'href', '/editor');
    navbarLink()
      .eq(2)
      .should('contain', 'Settings')
      .and('not.have.class', 'active')
      .and('have.attr', 'href', '/settings');
    navbarLink()
      .eq(3)
      .should('contain', user.username)
      .and('not.have.class', 'active')
      .and('have.attr', 'href', `/profile/${user.username}`);

    cy.get('.nav-link > img').should('exist');
  });
});
