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

describe('StatusHistory e2e test', () => {
  const statusHistoryPageUrl = '/status-history';
  const statusHistoryPageUrlPattern = new RegExp('/status-history(\\?.*)?$');
  let username: string;
  let password: string;
  const statusHistorySample = { referenceId: 26337, referenceType: 'near vanish fatally', status: 'pushy armoire offensively' };

  let statusHistory;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/status-histories+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/status-histories').as('postEntityRequest');
    cy.intercept('DELETE', '/api/status-histories/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (statusHistory) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/status-histories/${statusHistory.id}`,
      }).then(() => {
        statusHistory = undefined;
      });
    }
  });

  it('StatusHistories menu should load StatusHistories page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('status-history');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('StatusHistory').should('exist');
    cy.url().should('match', statusHistoryPageUrlPattern);
  });

  describe('StatusHistory page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(statusHistoryPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create StatusHistory page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/status-history/new$'));
        cy.getEntityCreateUpdateHeading('StatusHistory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', statusHistoryPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/status-histories',
          body: statusHistorySample,
        }).then(({ body }) => {
          statusHistory = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/status-histories+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/status-histories?page=0&size=20>; rel="last",<http://localhost/api/status-histories?page=0&size=20>; rel="first"',
              },
              body: [statusHistory],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(statusHistoryPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details StatusHistory page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('statusHistory');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', statusHistoryPageUrlPattern);
      });

      it('edit button click should load edit StatusHistory page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('StatusHistory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', statusHistoryPageUrlPattern);
      });

      it('edit button click should load edit StatusHistory page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('StatusHistory');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', statusHistoryPageUrlPattern);
      });

      it('last delete button click should delete instance of StatusHistory', () => {
        cy.intercept('GET', '/api/status-histories/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('statusHistory').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', statusHistoryPageUrlPattern);

        statusHistory = undefined;
      });
    });
  });

  describe('new StatusHistory page', () => {
    beforeEach(() => {
      cy.visit(statusHistoryPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('StatusHistory');
    });

    it('should create an instance of StatusHistory', () => {
      cy.get(`[data-cy="referenceId"]`).type('9950');
      cy.get(`[data-cy="referenceId"]`).should('have.value', '9950');

      cy.get(`[data-cy="referenceType"]`).type('bah gloomy once');
      cy.get(`[data-cy="referenceType"]`).should('have.value', 'bah gloomy once');

      cy.get(`[data-cy="status"]`).type('whoever the offensively');
      cy.get(`[data-cy="status"]`).should('have.value', 'whoever the offensively');

      cy.get(`[data-cy="previousStatus"]`).type('which searchingly');
      cy.get(`[data-cy="previousStatus"]`).should('have.value', 'which searchingly');

      cy.get(`[data-cy="note"]`).type('appreciate bench');
      cy.get(`[data-cy="note"]`).should('have.value', 'appreciate bench');

      cy.get(`[data-cy="createdAt"]`).type('2026-06-02T23:23');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-06-02T23:23');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        statusHistory = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', statusHistoryPageUrlPattern);
    });
  });
});
