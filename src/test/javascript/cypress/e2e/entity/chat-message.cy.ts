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

describe('ChatMessage e2e test', () => {
  const chatMessagePageUrl = '/chat-message';
  const chatMessagePageUrlPattern = new RegExp('/chat-message(\\?.*)?$');
  let username: string;
  let password: string;
  const chatMessageSample = { content: 'pinion zebra' };

  let chatMessage;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/chat-messages+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/chat-messages').as('postEntityRequest');
    cy.intercept('DELETE', '/api/chat-messages/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (chatMessage) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/chat-messages/${chatMessage.id}`,
      }).then(() => {
        chatMessage = undefined;
      });
    }
  });

  it('ChatMessages menu should load ChatMessages page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('chat-message');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ChatMessage').should('exist');
    cy.url().should('match', chatMessagePageUrlPattern);
  });

  describe('ChatMessage page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(chatMessagePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ChatMessage page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/chat-message/new$'));
        cy.getEntityCreateUpdateHeading('ChatMessage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', chatMessagePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/chat-messages',
          body: chatMessageSample,
        }).then(({ body }) => {
          chatMessage = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/chat-messages+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/chat-messages?page=0&size=20>; rel="last",<http://localhost/api/chat-messages?page=0&size=20>; rel="first"',
              },
              body: [chatMessage],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(chatMessagePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ChatMessage page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('chatMessage');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', chatMessagePageUrlPattern);
      });

      it('edit button click should load edit ChatMessage page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ChatMessage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', chatMessagePageUrlPattern);
      });

      it('edit button click should load edit ChatMessage page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ChatMessage');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', chatMessagePageUrlPattern);
      });

      it('last delete button click should delete instance of ChatMessage', () => {
        cy.intercept('GET', '/api/chat-messages/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('chatMessage').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', chatMessagePageUrlPattern);

        chatMessage = undefined;
      });
    });
  });

  describe('new ChatMessage page', () => {
    beforeEach(() => {
      cy.visit(chatMessagePageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ChatMessage');
    });

    it('should create an instance of ChatMessage', () => {
      cy.get(`[data-cy="content"]`).type('meh');
      cy.get(`[data-cy="content"]`).should('have.value', 'meh');

      cy.get(`[data-cy="isRead"]`).should('not.be.checked');
      cy.get(`[data-cy="isRead"]`).click();
      cy.get(`[data-cy="isRead"]`).should('be.checked');

      cy.get(`[data-cy="createdAt"]`).type('2026-05-19T12:54');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-05-19T12:54');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        chatMessage = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', chatMessagePageUrlPattern);
    });
  });
});
