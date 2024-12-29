describe('Article', () => {
  const user = {
    email: 'email',
    token: 'token',
    username: 'john',
    bio: 'bio',
    image: 'image'
  };

  const tags = ['tag one', 'tag two'];

  const article = {
    slug: 'title-one',
    title: 'title one',
    body: 'body',
    description: 'description',
    favoritesCount: 1,
    createdAt: new Date('10/8/2024').toString(),
    updatedAt: new Date('10/8/2024').toString(),
    favorited: false,
    author: {
      image: 'image',
      bio: 'bio',
      username: 'john',
      following: false
    },
    tagList: tags
  };

  function startBackend(): void {
    cy.intercept('GET', 'api/user', { user }).as('getCurrentUser');
    cy.intercept('GET', 'api/articles/title-one', { article }).as('getArticle');
  }

  beforeEach(() => {
    startBackend();
  });

  it('should display an article page', () => {
    cy.visit('/article/title-one');
    cy.get('[data-test=banner]').should('not.exist');
    cy.get('[data-test=page]').should('not.exist');
    cy.get('[data-test=article-loading]').should('contain', 'Loading article...');
    cy.wait('@getArticle');
    cy.get('[data-test=favorite-button]')
      .should('have.class', 'btn-outline-danger')
      .and('contain', 1);
    cy.get('h1').should('contain', 'title one');
    cy.get('[data-test=article-author-image]')
      .should('have.attr', 'href', '/profile/john')
      .find('img')
      .should('exist')
      .and('have.attr', 'width', 32)
      .and('have.attr', 'height', 32)
      .and('have.attr', 'alt', 'john');
    cy.get('[data-test=article-author-name]')
      .should('have.attr', 'href', '/profile/john')
      .and('contain', 'john');
    cy.get('[data-test=article-created-date]')
      .should('contain', 'Published on Oct 8, 2024')
      .find('time')
      .should('have.attr', 'datetime', new Date('10/8/2024').toString())
      .and('contain', 'Oct 8, 2024');
    cy.get('p.lead').should('contain', 'body');
    cy.get('[data-test=article-tag-list]')
      .find('span')
      .should('have.length', 2)
      .first()
      .should('contain', 'tag one');
  });

  it('should display an edit link with a delete button if the owner', () => {
    window.localStorage.setItem('jwtToken', user.token);
    cy.visit('/article/title-one');
    cy.wait(['@getCurrentUser', '@getArticle']);
    cy.get('a[href="/editor/title-one"]').should('contain', 'Edit');
    cy.get('button.btn-danger').should('contain', 'Delete');
  });
});
