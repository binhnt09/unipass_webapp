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

describe('AiChatMessage e2e test', () => {
  const aiChatMessagePageUrl = '/ai-chat-message';
  const aiChatMessagePageUrlPattern = new RegExp('/ai-chat-message(\\?.*)?$');
  let username: string;
  let password: string;
  const aiChatMessageSample = { role: 'ack once confusion', content: 'motivate amid qua' };

  let aiChatMessage;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/ai-chat-messages+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/ai-chat-messages').as('postEntityRequest');
    cy.intercept('DELETE', '/api/ai-chat-messages/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (aiChatMessage) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/ai-chat-messages/${aiChatMessage.id}`,
      }).then(() => {
        aiChatMessage = undefined;
      });
    }
  });

  it('AiChatMessages menu should load AiChatMessages page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('ai-chat-message');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('AiChatMessage').should('exist');
    cy.url().should('match', aiChatMessagePageUrlPattern);
  });

  describe('AiChatMessage page', () => {
    it('should have translated page title', () => {
      cy.visit(aiChatMessagePageUrl);
      cy.getEntityHeading('AiChatMessage').should('not.contain', 'unipassWebApp.aiChatMessage.home.title');
    });

    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(aiChatMessagePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create AiChatMessage page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/ai-chat-message/new$'));
        cy.getEntityCreateUpdateHeading('AiChatMessage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', aiChatMessagePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/ai-chat-messages',
          body: aiChatMessageSample,
        }).then(({ body }) => {
          aiChatMessage = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/ai-chat-messages+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/ai-chat-messages?page=0&size=20>; rel="last",<http://localhost/api/ai-chat-messages?page=0&size=20>; rel="first"',
              },
              body: [aiChatMessage],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(aiChatMessagePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details AiChatMessage page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('aiChatMessage');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', aiChatMessagePageUrlPattern);
      });

      it('edit button click should load edit AiChatMessage page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AiChatMessage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', aiChatMessagePageUrlPattern);
      });

      it('edit button click should load edit AiChatMessage page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AiChatMessage');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', aiChatMessagePageUrlPattern);
      });

      it('last delete button click should delete instance of AiChatMessage', () => {
        cy.intercept('GET', '/api/ai-chat-messages/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('aiChatMessage').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', aiChatMessagePageUrlPattern);

        aiChatMessage = undefined;
      });
    });
  });

  describe('new AiChatMessage page', () => {
    beforeEach(() => {
      cy.visit(aiChatMessagePageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('AiChatMessage');
    });

    it('should create an instance of AiChatMessage', () => {
      cy.get(`[data-cy="role"]`).type('within energetically below');
      cy.get(`[data-cy="role"]`).should('have.value', 'within energetically below');

      cy.get(`[data-cy="content"]`).type('behind enormously');
      cy.get(`[data-cy="content"]`).should('have.value', 'behind enormously');

      cy.get(`[data-cy="tokensUsed"]`).type('13779');
      cy.get(`[data-cy="tokensUsed"]`).should('have.value', '13779');

      cy.get(`[data-cy="createdAt"]`).type('2026-05-18T23:36');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-05-18T23:36');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        aiChatMessage = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', aiChatMessagePageUrlPattern);
    });
  });
});
