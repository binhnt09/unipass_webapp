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

describe('TradeRequest e2e test', () => {
  const tradeRequestPageUrl = '/trade-request';
  const tradeRequestPageUrlPattern = new RegExp('/trade-request(\\?.*)?$');
  let username: string;
  let password: string;
  const tradeRequestSample = {};

  let tradeRequest;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/trade-requests+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/trade-requests').as('postEntityRequest');
    cy.intercept('DELETE', '/api/trade-requests/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (tradeRequest) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/trade-requests/${tradeRequest.id}`,
      }).then(() => {
        tradeRequest = undefined;
      });
    }
  });

  it('TradeRequests menu should load TradeRequests page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('trade-request');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TradeRequest').should('exist');
    cy.url().should('match', tradeRequestPageUrlPattern);
  });

  describe('TradeRequest page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(tradeRequestPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TradeRequest page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/trade-request/new$'));
        cy.getEntityCreateUpdateHeading('TradeRequest');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeRequestPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/trade-requests',
          body: tradeRequestSample,
        }).then(({ body }) => {
          tradeRequest = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/trade-requests+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/trade-requests?page=0&size=20>; rel="last",<http://localhost/api/trade-requests?page=0&size=20>; rel="first"',
              },
              body: [tradeRequest],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(tradeRequestPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TradeRequest page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('tradeRequest');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeRequestPageUrlPattern);
      });

      it('edit button click should load edit TradeRequest page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TradeRequest');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeRequestPageUrlPattern);
      });

      it('edit button click should load edit TradeRequest page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TradeRequest');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeRequestPageUrlPattern);
      });

      it('last delete button click should delete instance of TradeRequest', () => {
        cy.intercept('GET', '/api/trade-requests/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('tradeRequest').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeRequestPageUrlPattern);

        tradeRequest = undefined;
      });
    });
  });

  describe('new TradeRequest page', () => {
    beforeEach(() => {
      cy.visit(tradeRequestPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TradeRequest');
    });

    it('should create an instance of TradeRequest', () => {
      cy.get(`[data-cy="topUpAmount"]`).type('16267.96');
      cy.get(`[data-cy="topUpAmount"]`).should('have.value', '16267.96');

      cy.get(`[data-cy="status"]`).type('transparency if');
      cy.get(`[data-cy="status"]`).should('have.value', 'transparency if');

      cy.get(`[data-cy="meetupLocation"]`).type('yum gee seriously');
      cy.get(`[data-cy="meetupLocation"]`).should('have.value', 'yum gee seriously');

      cy.get(`[data-cy="createdAt"]`).type('2026-06-02T09:59');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-06-02T09:59');

      cy.get(`[data-cy="updatedAt"]`).type('2026-06-03T05:36');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2026-06-03T05:36');

      cy.get(`[data-cy="isBuyerConfirmed"]`).should('not.be.checked');
      cy.get(`[data-cy="isBuyerConfirmed"]`).click();
      cy.get(`[data-cy="isBuyerConfirmed"]`).should('be.checked');

      cy.get(`[data-cy="isSellerConfirmed"]`).should('not.be.checked');
      cy.get(`[data-cy="isSellerConfirmed"]`).click();
      cy.get(`[data-cy="isSellerConfirmed"]`).should('be.checked');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        tradeRequest = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', tradeRequestPageUrlPattern);
    });
  });
});
