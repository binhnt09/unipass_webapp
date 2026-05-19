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

describe('AiChatSession e2e test', () => {
  const aiChatSessionPageUrl = '/ai-chat-session';
  const aiChatSessionPageUrlPattern = new RegExp('/ai-chat-session(\\?.*)?$');
  let username: string;
  let password: string;
  const aiChatSessionSample = {};

  let aiChatSession;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/ai-chat-sessions+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/ai-chat-sessions').as('postEntityRequest');
    cy.intercept('DELETE', '/api/ai-chat-sessions/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (aiChatSession) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/ai-chat-sessions/${aiChatSession.id}`,
      }).then(() => {
        aiChatSession = undefined;
      });
    }
  });

  it('AiChatSessions menu should load AiChatSessions page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ai-chat-session');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('AiChatSession').should('exist');
    cy.url().should('match', aiChatSessionPageUrlPattern);
  });

  describe('AiChatSession page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(aiChatSessionPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create AiChatSession page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ai-chat-session/new$'));
        cy.getEntityCreateUpdateHeading('AiChatSession');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', aiChatSessionPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/ai-chat-sessions',
          body: aiChatSessionSample,
        }).then(({ body }) => {
          aiChatSession = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/ai-chat-sessions+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [aiChatSession],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(aiChatSessionPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details AiChatSession page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('aiChatSession');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', aiChatSessionPageUrlPattern);
      });

      it('edit button click should load edit AiChatSession page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AiChatSession');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', aiChatSessionPageUrlPattern);
      });

      it('edit button click should load edit AiChatSession page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AiChatSession');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', aiChatSessionPageUrlPattern);
      });

      it('last delete button click should delete instance of AiChatSession', () => {
        cy.intercept('GET', '/api/ai-chat-sessions/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('aiChatSession').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', aiChatSessionPageUrlPattern);

        aiChatSession = undefined;
      });
    });
  });

  describe('new AiChatSession page', () => {
    beforeEach(() => {
      cy.visit(aiChatSessionPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('AiChatSession');
    });

    it('should create an instance of AiChatSession', () => {
      cy.get(`[data-cy="contextSummary"]`).type('../fake-data/blob/hipster.txt');
      cy.get(`[data-cy="contextSummary"]`).invoke('val').should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(`[data-cy="createdAt"]`).type('2026-05-19T12:34');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-05-19T12:34');

      cy.get(`[data-cy="updatedAt"]`).type('2026-05-19T06:11');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2026-05-19T06:11');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        aiChatSession = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', aiChatSessionPageUrlPattern);
    });
  });
});
