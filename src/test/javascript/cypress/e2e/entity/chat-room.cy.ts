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

describe('ChatRoom e2e test', () => {
  const chatRoomPageUrl = '/chat-room';
  const chatRoomPageUrlPattern = new RegExp('/chat-room(\\?.*)?$');
  let username: string;
  let password: string;
  const chatRoomSample = {};

  let chatRoom;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/chat-rooms+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/chat-rooms').as('postEntityRequest');
    cy.intercept('DELETE', '/api/chat-rooms/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (chatRoom) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/chat-rooms/${chatRoom.id}`,
      }).then(() => {
        chatRoom = undefined;
      });
    }
  });

  it('ChatRooms menu should load ChatRooms page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('chat-room');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ChatRoom').should('exist');
    cy.url().should('match', chatRoomPageUrlPattern);
  });

  describe('ChatRoom page', () => {
    it('should have translated page title', () => {
      cy.visit(chatRoomPageUrl);
      cy.getEntityHeading('ChatRoom').should('not.contain', 'unipassWebApp.chatRoom.home.title');
    });

    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(chatRoomPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ChatRoom page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/chat-room/new$'));
        cy.getEntityCreateUpdateHeading('ChatRoom');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', chatRoomPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/chat-rooms',
          body: chatRoomSample,
        }).then(({ body }) => {
          chatRoom = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/chat-rooms+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/chat-rooms?page=0&size=20>; rel="last",<http://localhost/api/chat-rooms?page=0&size=20>; rel="first"',
              },
              body: [chatRoom],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(chatRoomPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ChatRoom page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('chatRoom');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', chatRoomPageUrlPattern);
      });

      it('edit button click should load edit ChatRoom page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ChatRoom');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', chatRoomPageUrlPattern);
      });

      it('edit button click should load edit ChatRoom page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ChatRoom');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', chatRoomPageUrlPattern);
      });

      it('last delete button click should delete instance of ChatRoom', () => {
        cy.intercept('GET', '/api/chat-rooms/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('chatRoom').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', chatRoomPageUrlPattern);

        chatRoom = undefined;
      });
    });
  });

  describe('new ChatRoom page', () => {
    beforeEach(() => {
      cy.visit(chatRoomPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ChatRoom');
    });

    it('should create an instance of ChatRoom', () => {
      cy.get(`[data-cy="createdAt"]`).type('2026-05-19T06:57');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-05-19T06:57');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        chatRoom = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', chatRoomPageUrlPattern);
    });
  });
});
