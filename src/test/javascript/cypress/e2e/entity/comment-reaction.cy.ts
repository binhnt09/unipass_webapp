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

describe('CommentReaction e2e test', () => {
  const commentReactionPageUrl = '/comment-reaction';
  const commentReactionPageUrlPattern = new RegExp('/comment-reaction(\\?.*)?$');
  let username: string;
  let password: string;
  const commentReactionSample = { reactionType: 'calmly writhing finally' };

  let commentReaction;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/comment-reactions+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/comment-reactions').as('postEntityRequest');
    cy.intercept('DELETE', '/api/comment-reactions/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (commentReaction) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/comment-reactions/${commentReaction.id}`,
      }).then(() => {
        commentReaction = undefined;
      });
    }
  });

  it('CommentReactions menu should load CommentReactions page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('comment-reaction');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('CommentReaction').should('exist');
    cy.url().should('match', commentReactionPageUrlPattern);
  });

  describe('CommentReaction page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(commentReactionPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create CommentReaction page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/comment-reaction/new$'));
        cy.getEntityCreateUpdateHeading('CommentReaction');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', commentReactionPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/comment-reactions',
          body: commentReactionSample,
        }).then(({ body }) => {
          commentReaction = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/comment-reactions+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/comment-reactions?page=0&size=20>; rel="last",<http://localhost/api/comment-reactions?page=0&size=20>; rel="first"',
              },
              body: [commentReaction],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(commentReactionPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details CommentReaction page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('commentReaction');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', commentReactionPageUrlPattern);
      });

      it('edit button click should load edit CommentReaction page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CommentReaction');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', commentReactionPageUrlPattern);
      });

      it('edit button click should load edit CommentReaction page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CommentReaction');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', commentReactionPageUrlPattern);
      });

      it('last delete button click should delete instance of CommentReaction', () => {
        cy.intercept('GET', '/api/comment-reactions/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('commentReaction').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', commentReactionPageUrlPattern);

        commentReaction = undefined;
      });
    });
  });

  describe('new CommentReaction page', () => {
    beforeEach(() => {
      cy.visit(commentReactionPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('CommentReaction');
    });

    it('should create an instance of CommentReaction', () => {
      cy.get(`[data-cy="reactionType"]`).type('natural kit festival');
      cy.get(`[data-cy="reactionType"]`).should('have.value', 'natural kit festival');

      cy.get(`[data-cy="createdAt"]`).type('2026-06-15T01:55');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-06-15T01:55');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        commentReaction = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', commentReactionPageUrlPattern);
    });
  });
});
