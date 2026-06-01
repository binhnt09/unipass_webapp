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

describe('RequestOffer e2e test', () => {
  const requestOfferPageUrl = '/request-offer';
  const requestOfferPageUrlPattern = new RegExp('/request-offer(\\?.*)?$');
  let username: string;
  let password: string;
  const requestOfferSample = { offerPrice: 16356.75 };

  let requestOffer;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/request-offers+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/request-offers').as('postEntityRequest');
    cy.intercept('DELETE', '/api/request-offers/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (requestOffer) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/request-offers/${requestOffer.id}`,
      }).then(() => {
        requestOffer = undefined;
      });
    }
  });

  it('RequestOffers menu should load RequestOffers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('request-offer');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('RequestOffer').should('exist');
    cy.url().should('match', requestOfferPageUrlPattern);
  });

  describe('RequestOffer page', () => {
    it('should have translated page title', () => {
      cy.visit(requestOfferPageUrl);
      cy.getEntityHeading('RequestOffer').should('not.contain', 'unipassWebApp.requestOffer.home.title');
    });

    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(requestOfferPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create RequestOffer page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/request-offer/new$'));
        cy.getEntityCreateUpdateHeading('RequestOffer');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', requestOfferPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/request-offers',
          body: requestOfferSample,
        }).then(({ body }) => {
          requestOffer = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/request-offers+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/request-offers?page=0&size=20>; rel="last",<http://localhost/api/request-offers?page=0&size=20>; rel="first"',
              },
              body: [requestOffer],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(requestOfferPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details RequestOffer page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('requestOffer');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', requestOfferPageUrlPattern);
      });

      it('edit button click should load edit RequestOffer page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('RequestOffer');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', requestOfferPageUrlPattern);
      });

      it('edit button click should load edit RequestOffer page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('RequestOffer');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', requestOfferPageUrlPattern);
      });

      it('last delete button click should delete instance of RequestOffer', () => {
        cy.intercept('GET', '/api/request-offers/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('requestOffer').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', requestOfferPageUrlPattern);

        requestOffer = undefined;
      });
    });
  });

  describe('new RequestOffer page', () => {
    beforeEach(() => {
      cy.visit(requestOfferPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('RequestOffer');
    });

    it('should create an instance of RequestOffer', () => {
      cy.get(`[data-cy="offerPrice"]`).type('7552.91');
      cy.get(`[data-cy="offerPrice"]`).should('have.value', '7552.91');

      cy.get(`[data-cy="message"]`).type('emotional although');
      cy.get(`[data-cy="message"]`).should('have.value', 'emotional although');

      cy.get(`[data-cy="createdAt"]`).type('2026-05-19T05:57');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-05-19T05:57');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        requestOffer = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', requestOfferPageUrlPattern);
    });
  });
});
