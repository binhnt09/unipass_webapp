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

describe('PostReaction e2e test', () => {
  const postReactionPageUrl = '/post-reaction';
  const postReactionPageUrlPattern = new RegExp('/post-reaction(\\?.*)?$');
  let username: string;
  let password: string;
  const postReactionSample = { reactionType: 'pupil indeed' };

  let postReaction;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/post-reactions+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/post-reactions').as('postEntityRequest');
    cy.intercept('DELETE', '/api/post-reactions/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (postReaction) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/post-reactions/${postReaction.id}`,
      }).then(() => {
        postReaction = undefined;
      });
    }
  });

  it('PostReactions menu should load PostReactions page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('post-reaction');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('PostReaction').should('exist');
    cy.url().should('match', postReactionPageUrlPattern);
  });

  describe('PostReaction page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(postReactionPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create PostReaction page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/post-reaction/new$'));
        cy.getEntityCreateUpdateHeading('PostReaction');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', postReactionPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/post-reactions',
          body: postReactionSample,
        }).then(({ body }) => {
          postReaction = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/post-reactions+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/post-reactions?page=0&size=20>; rel="last",<http://localhost/api/post-reactions?page=0&size=20>; rel="first"',
              },
              body: [postReaction],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(postReactionPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details PostReaction page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('postReaction');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', postReactionPageUrlPattern);
      });

      it('edit button click should load edit PostReaction page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PostReaction');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', postReactionPageUrlPattern);
      });

      it('edit button click should load edit PostReaction page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PostReaction');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', postReactionPageUrlPattern);
      });

      it('last delete button click should delete instance of PostReaction', () => {
        cy.intercept('GET', '/api/post-reactions/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('postReaction').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', postReactionPageUrlPattern);

        postReaction = undefined;
      });
    });
  });

  describe('new PostReaction page', () => {
    beforeEach(() => {
      cy.visit(postReactionPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('PostReaction');
    });

    it('should create an instance of PostReaction', () => {
      cy.get(`[data-cy="reactionType"]`).type('scheme bludgeon ugh');
      cy.get(`[data-cy="reactionType"]`).should('have.value', 'scheme bludgeon ugh');

      cy.get(`[data-cy="createdAt"]`).type('2026-06-14T08:23');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-06-14T08:23');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        postReaction = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', postReactionPageUrlPattern);
    });
  });
});
