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

describe('CommunityPost e2e test', () => {
  const communityPostPageUrl = '/community-post';
  const communityPostPageUrlPattern = new RegExp('/community-post(\\?.*)?$');
  let username: string;
  let password: string;
  const communityPostSample = { title: 'vision busy unsightly', content: 'precious' };

  let communityPost;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/community-posts+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/community-posts').as('postEntityRequest');
    cy.intercept('DELETE', '/api/community-posts/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (communityPost) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/community-posts/${communityPost.id}`,
      }).then(() => {
        communityPost = undefined;
      });
    }
  });

  it('CommunityPosts menu should load CommunityPosts page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('community-post');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('CommunityPost').should('exist');
    cy.url().should('match', communityPostPageUrlPattern);
  });

  describe('CommunityPost page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(communityPostPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create CommunityPost page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/community-post/new$'));
        cy.getEntityCreateUpdateHeading('CommunityPost');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', communityPostPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/community-posts',
          body: communityPostSample,
        }).then(({ body }) => {
          communityPost = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/community-posts+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/community-posts?page=0&size=20>; rel="last",<http://localhost/api/community-posts?page=0&size=20>; rel="first"',
              },
              body: [communityPost],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(communityPostPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details CommunityPost page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('communityPost');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', communityPostPageUrlPattern);
      });

      it('edit button click should load edit CommunityPost page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CommunityPost');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', communityPostPageUrlPattern);
      });

      it('edit button click should load edit CommunityPost page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CommunityPost');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', communityPostPageUrlPattern);
      });

      it('last delete button click should delete instance of CommunityPost', () => {
        cy.intercept('GET', '/api/community-posts/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('communityPost').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', communityPostPageUrlPattern);

        communityPost = undefined;
      });
    });
  });

  describe('new CommunityPost page', () => {
    beforeEach(() => {
      cy.visit(communityPostPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('CommunityPost');
    });

    it('should create an instance of CommunityPost', () => {
      cy.get(`[data-cy="title"]`).type('greedily how afore');
      cy.get(`[data-cy="title"]`).should('have.value', 'greedily how afore');

      cy.get(`[data-cy="content"]`).type('insolence drain');
      cy.get(`[data-cy="content"]`).should('have.value', 'insolence drain');

      cy.get(`[data-cy="status"]`).type('only bin indeed');
      cy.get(`[data-cy="status"]`).should('have.value', 'only bin indeed');

      cy.get(`[data-cy="createdAt"]`).type('2026-06-14T22:31');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-06-14T22:31');

      cy.get(`[data-cy="updatedAt"]`).type('2026-06-14T10:18');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2026-06-14T10:18');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        communityPost = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', communityPostPageUrlPattern);
    });
  });
});
