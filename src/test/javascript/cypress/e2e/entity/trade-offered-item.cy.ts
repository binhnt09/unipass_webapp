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

describe('TradeOfferedItem e2e test', () => {
  const tradeOfferedItemPageUrl = '/trade-offered-item';
  const tradeOfferedItemPageUrlPattern = new RegExp('/trade-offered-item(\\?.*)?$');
  let username: string;
  let password: string;
  const tradeOfferedItemSample = {};

  let tradeOfferedItem;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/trade-offered-items+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/trade-offered-items').as('postEntityRequest');
    cy.intercept('DELETE', '/api/trade-offered-items/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (tradeOfferedItem) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/trade-offered-items/${tradeOfferedItem.id}`,
      }).then(() => {
        tradeOfferedItem = undefined;
      });
    }
  });

  it('TradeOfferedItems menu should load TradeOfferedItems page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('trade-offered-item');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TradeOfferedItem').should('exist');
    cy.url().should('match', tradeOfferedItemPageUrlPattern);
  });

  describe('TradeOfferedItem page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(tradeOfferedItemPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TradeOfferedItem page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/trade-offered-item/new$'));
        cy.getEntityCreateUpdateHeading('TradeOfferedItem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeOfferedItemPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/trade-offered-items',
          body: tradeOfferedItemSample,
        }).then(({ body }) => {
          tradeOfferedItem = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/trade-offered-items+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/trade-offered-items?page=0&size=20>; rel="last",<http://localhost/api/trade-offered-items?page=0&size=20>; rel="first"',
              },
              body: [tradeOfferedItem],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(tradeOfferedItemPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TradeOfferedItem page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('tradeOfferedItem');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeOfferedItemPageUrlPattern);
      });

      it('edit button click should load edit TradeOfferedItem page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TradeOfferedItem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeOfferedItemPageUrlPattern);
      });

      it('edit button click should load edit TradeOfferedItem page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TradeOfferedItem');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeOfferedItemPageUrlPattern);
      });

      it('last delete button click should delete instance of TradeOfferedItem', () => {
        cy.intercept('GET', '/api/trade-offered-items/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('tradeOfferedItem').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', tradeOfferedItemPageUrlPattern);

        tradeOfferedItem = undefined;
      });
    });
  });

  describe('new TradeOfferedItem page', () => {
    beforeEach(() => {
      cy.visit(tradeOfferedItemPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TradeOfferedItem');
    });

    it('should create an instance of TradeOfferedItem', () => {
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        tradeOfferedItem = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', tradeOfferedItemPageUrlPattern);
    });
  });
});
