describe('Home', () => {
  const user = {
    email: 'email',
    token: 'token',
    username: 'username',
    bio: 'bio',
    image: 'image'
  };

  const tags = ['tag one', 'tag two'];

  const articles = [
    {
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
    },
    {
      slug: 'title-two',
      title: 'title two',
      body: 'body',
      description: 'description',
      favoritesCount: 2,
      createdAt: new Date('10/6/2024').toString(),
      updatedAt: new Date('10/6/2024').toString(),
      favorited: true,
      author: {
        image: 'image',
        bio: 'bio',
        username: 'jack',
        following: false
      },
      tagList: tags
    }
  ];

  function startBackend(): void {
    cy.intercept('GET', 'api/user', { user }).as('getCurrentUser');
    cy.intercept('GET', 'api/tags', { tags }).as('getTags');
    cy.intercept('GET', 'api/articles?limit=10', { articles, articlesCount: 20 }).as(
      'getGlobalFeed'
    );
    cy.intercept('GET', 'api/articles/feed?limit=10', { articles, articlesCount: 20 }).as(
      'yourFeed'
    );
    cy.intercept('GET', 'api/articles?limit=10&tag=tag%20one', { articles, articlesCount: 20 }).as(
      'getSelectedTagFeed'
    );
    cy.intercept('GET', 'api/articles?limit=10&offset=10', { articles, articlesCount: 20 }).as(
      'getSecondPage'
    );
    cy.intercept('GET', 'api/articles?limit=10&offset=0', { articles, articlesCount: 20 }).as(
      'getFirstPage'
    );
  }

  function storeJwtTokenInLocalStorage(): void {
    window.localStorage.setItem('jwtToken', user.token);
  }

  const navbarBrand = () => cy.get('.navbar-brand');
  const navbarLink = () => cy.get('.navbar-nav .nav-link');
  const feedTabs = () => cy.get('.nav-tabs .nav-link');
  const globalFeedTab = () => feedTabs().first();
  const yourFeedTab = () => feedTabs().eq(1);
  const selectedTagFeedTab = () => feedTabs().eq(2);
  const articlesLoadingMessage = () => cy.get('[data-test=articles-loading]');
  const articlePreviews = () => cy.get('[data-test=article-preview]');

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

  it('should display a logged-in user', () => {
    storeJwtTokenInLocalStorage();
    cy.visit('/');
    cy.wait('@getCurrentUser');

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
  });

  it('should display a global feed by default', () => {
    cy.visit('/');
    articlesLoadingMessage().should('contain', 'Loading articles...');
    cy.wait('@getGlobalFeed');

    feedTabs().should('have.length', 1);
    globalFeedTab()
      .should('have.class', 'active')
      .and('have.css', 'pointer-events', 'none')
      .and('contain', 'Global Feed');

    const authorImage = () => cy.get('[data-test=article-author-image]').first();
    const authorName = () => cy.get('[data-test=article-author-name]').first();
    const articleCreatedDate = () => cy.get('[data-test=article-created-date]').first();
    const articleTitle = () => cy.get('[data-test=article-title]').first();
    const articleDescription = () => cy.get('[data-test=article-description]').first();
    const articleDetailsLink = () => cy.get('[data-test=article-details-link]').first();
    const articleTagList = () => cy.get('[data-test=article-tag-list]').first();
    const favoriteButtons = () => cy.get('[data-test=favorite-button]');

    articlePreviews().should('have.length', 2);
    authorImage()
      .should('have.attr', 'href', '/profile/john')
      .find('img')
      .should('exist')
      .and('have.attr', 'width', 32)
      .and('have.attr', 'height', 32)
      .and('have.attr', 'alt', 'john');
    authorName().should('have.attr', 'href', '/profile/john').and('contain', 'john');
    articleCreatedDate()
      .should('contain', 'Published on Oct 8, 2024')
      .find('time')
      .should('have.attr', 'datetime', new Date('10/8/2024').toString())
      .and('contain', 'Oct 8, 2024');
    favoriteButtons().first().should('have.class', 'btn-outline-danger').and('contain', 1);
    favoriteButtons().eq(1).should('have.class', 'btn-danger').and('contain', 2);
    articleTitle()
      .find('a')
      .should('have.attr', 'href', '/article/title-one')
      .and('contain', 'title one');
    articleDescription().should('contain', 'description');
    articleDetailsLink()
      .should('have.attr', 'href', '/article/title-one')
      .and('contain', 'Read more');
    articleTagList().find('span').should('have.length', 2).first().should('contain', 'tag one');

    cy.get('.pagination .page-item').should('have.length', 4);

    cy.get('.pagination .page-item').eq(2).click();
    cy.wait('@getSecondPage');

    cy.get('.pagination .page-item').eq(0).click();
    cy.wait('@getFirstPage');

    cy.get('.pagination .page-item').eq(3).click();
    cy.wait('@getSecondPage');
  });

  it("should display a user's feed in a second tab if logged in", () => {
    storeJwtTokenInLocalStorage();
    cy.visit('/');
    articlesLoadingMessage().should('contain', 'Loading articles...');
    cy.wait(['@getCurrentUser', '@getGlobalFeed']);

    feedTabs().should('have.length', 2);
    globalFeedTab()
      .should('have.class', 'active')
      .and('have.css', 'pointer-events', 'none')
      .and('contain', 'Global Feed');
    yourFeedTab()
      .should('not.have.class', 'active')
      .and('not.have.css', 'pointer-events', 'none')
      .and('contain', 'Your Feed');
    yourFeedTab().click().should('have.class', 'active').and('have.css', 'pointer-events', 'none');
    globalFeedTab()
      .should('not.have.class', 'active')
      .and('not.have.css', 'pointer-events', 'none');

    cy.wait('@yourFeed');
    articlePreviews().should('have.length', 2);
  });

  it('should display a feed with the selected tag in the last tab', () => {
    storeJwtTokenInLocalStorage();
    cy.visit('/');
    articlesLoadingMessage().should('contain', 'Loading articles...');
    cy.get('[data-test=tags-loading]').should('contain', 'Loading tags...');
    cy.wait(['@getCurrentUser', '@getGlobalFeed', '@getTags']);

    cy.contains('Popular tags');
    cy.get('[data-test=tags] a')
      .should('have.length', 2)
      .and('have.css', 'cursor', 'pointer')
      .first()
      .find('span')
      .should('contain', 'tag one');
    cy.get('[data-test=tags] a').first().click();

    feedTabs().should('have.length', 3);
    globalFeedTab()
      .should('not.have.class', 'active')
      .and('not.have.css', 'pointer-events', 'none')
      .and('contain', 'Global Feed');
    yourFeedTab()
      .should('not.have.class', 'active')
      .and('not.have.css', 'pointer-events', 'none')
      .and('contain', 'Your Feed');
    selectedTagFeedTab()
      .should('have.class', 'active')
      .and('have.css', 'pointer-events', 'none')
      .and('contain', '#tag one');

    cy.wait('@getSelectedTagFeed');
    articlePreviews().should('have.length', 2);

    globalFeedTab().click();
    cy.wait('@getGlobalFeed');

    selectedTagFeedTab().should('not.exist');
  });
});
