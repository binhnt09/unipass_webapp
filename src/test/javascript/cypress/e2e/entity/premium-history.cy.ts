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

describe('PremiumHistory e2e test', () => {
  const premiumHistoryPageUrl = '/premium-history';
  const premiumHistoryPageUrlPattern = new RegExp('/premium-history(\\?.*)?$');
  let username: string;
  let password: string;
  const premiumHistorySample = { coinSpent: 13584.87, durationDays: 19946 };

  let premiumHistory;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/premium-histories+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/premium-histories').as('postEntityRequest');
    cy.intercept('DELETE', '/api/premium-histories/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (premiumHistory) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/premium-histories/${premiumHistory.id}`,
      }).then(() => {
        premiumHistory = undefined;
      });
    }
  });

  it('PremiumHistories menu should load PremiumHistories page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('premium-history');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('PremiumHistory').should('exist');
    cy.url().should('match', premiumHistoryPageUrlPattern);
  });

  describe('PremiumHistory page', () => {
    it('should have translated page title', () => {
      cy.visit(premiumHistoryPageUrl);
      cy.getEntityHeading('PremiumHistory').should('not.contain', 'unipassWebApp.premiumHistory.home.title');
    });

    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(premiumHistoryPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create PremiumHistory page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/premium-history/new$'));
        cy.getEntityCreateUpdateHeading('PremiumHistory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', premiumHistoryPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/premium-histories',
          body: premiumHistorySample,
        }).then(({ body }) => {
          premiumHistory = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/premium-histories+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/premium-histories?page=0&size=20>; rel="last",<http://localhost/api/premium-histories?page=0&size=20>; rel="first"',
              },
              body: [premiumHistory],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(premiumHistoryPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details PremiumHistory page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('premiumHistory');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', premiumHistoryPageUrlPattern);
      });

      it('edit button click should load edit PremiumHistory page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PremiumHistory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', premiumHistoryPageUrlPattern);
      });

      it('edit button click should load edit PremiumHistory page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PremiumHistory');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', premiumHistoryPageUrlPattern);
      });

      it('last delete button click should delete instance of PremiumHistory', () => {
        cy.intercept('GET', '/api/premium-histories/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('premiumHistory').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', premiumHistoryPageUrlPattern);

        premiumHistory = undefined;
      });
    });
  });

  describe('new PremiumHistory page', () => {
    beforeEach(() => {
      cy.visit(premiumHistoryPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('PremiumHistory');
    });

    it('should create an instance of PremiumHistory', () => {
      cy.get(`[data-cy="coinSpent"]`).type('16705.2');
      cy.get(`[data-cy="coinSpent"]`).should('have.value', '16705.2');

      cy.get(`[data-cy="durationDays"]`).type('25202');
      cy.get(`[data-cy="durationDays"]`).should('have.value', '25202');

      cy.get(`[data-cy="createdAt"]`).type('2026-05-19T05:37');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-05-19T05:37');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        premiumHistory = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', premiumHistoryPageUrlPattern);
    });
  });
});
