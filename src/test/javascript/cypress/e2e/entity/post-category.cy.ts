import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('PostCategory e2e test', () => {
  const postCategoryPageUrl = '/post-category';
  const postCategoryPageUrlPattern = new RegExp('/post-category(\\?.*)?$');
  let username: string;
  let password: string;
  const postCategorySample = { name: 'phooey guide onto' };

  let postCategory;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/post-categories+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/post-categories').as('postEntityRequest');
    cy.intercept('DELETE', '/api/post-categories/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (postCategory) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/post-categories/${postCategory.id}`,
      }).then(() => {
        postCategory = undefined;
      });
    }
  });

  it('PostCategories menu should load PostCategories page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('post-category');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('PostCategory').should('exist');
    cy.url().should('match', postCategoryPageUrlPattern);
  });

  describe('PostCategory page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(postCategoryPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create PostCategory page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/post-category/new$'));
        cy.getEntityCreateUpdateHeading('PostCategory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', postCategoryPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/post-categories',
          body: postCategorySample,
        }).then(({ body }) => {
          postCategory = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/post-categories+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/post-categories?page=0&size=20>; rel="last",<http://localhost/api/post-categories?page=0&size=20>; rel="first"',
              },
              body: [postCategory],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(postCategoryPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details PostCategory page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('postCategory');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', postCategoryPageUrlPattern);
      });

      it('edit button click should load edit PostCategory page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PostCategory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', postCategoryPageUrlPattern);
      });

      it('edit button click should load edit PostCategory page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PostCategory');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', postCategoryPageUrlPattern);
      });

      it('last delete button click should delete instance of PostCategory', () => {
        cy.intercept('GET', '/api/post-categories/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('postCategory').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', postCategoryPageUrlPattern);

        postCategory = undefined;
      });
    });
  });

  describe('new PostCategory page', () => {
    beforeEach(() => {
      cy.visit(postCategoryPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('PostCategory');
    });

    it('should create an instance of PostCategory', () => {
      cy.get(`[data-cy="name"]`).type('vice community');
      cy.get(`[data-cy="name"]`).should('have.value', 'vice community');

      cy.get(`[data-cy="description"]`).type('consequently');
      cy.get(`[data-cy="description"]`).should('have.value', 'consequently');

      cy.get(`[data-cy="status"]`).type('tensely');
      cy.get(`[data-cy="status"]`).should('have.value', 'tensely');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        postCategory = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', postCategoryPageUrlPattern);
    });
  });
});
