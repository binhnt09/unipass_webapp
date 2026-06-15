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

describe('WalletTransaction e2e test', () => {
  const walletTransactionPageUrl = '/wallet-transaction';
  const walletTransactionPageUrlPattern = new RegExp('/wallet-transaction(\\?.*)?$');
  let username: string;
  let password: string;
  const walletTransactionSample = { amount: 9871.87, transactionType: 'near' };

  let walletTransaction;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/wallet-transactions+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/wallet-transactions').as('postEntityRequest');
    cy.intercept('DELETE', '/api/wallet-transactions/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (walletTransaction) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/wallet-transactions/${walletTransaction.id}`,
      }).then(() => {
        walletTransaction = undefined;
      });
    }
  });

  it('WalletTransactions menu should load WalletTransactions page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('wallet-transaction');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('WalletTransaction').should('exist');
    cy.url().should('match', walletTransactionPageUrlPattern);
  });

  describe('WalletTransaction page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(walletTransactionPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create WalletTransaction page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/wallet-transaction/new$'));
        cy.getEntityCreateUpdateHeading('WalletTransaction');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', walletTransactionPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/wallet-transactions',
          body: walletTransactionSample,
        }).then(({ body }) => {
          walletTransaction = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/wallet-transactions+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/wallet-transactions?page=0&size=20>; rel="last",<http://localhost/api/wallet-transactions?page=0&size=20>; rel="first"',
              },
              body: [walletTransaction],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(walletTransactionPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details WalletTransaction page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('walletTransaction');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', walletTransactionPageUrlPattern);
      });

      it('edit button click should load edit WalletTransaction page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('WalletTransaction');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', walletTransactionPageUrlPattern);
      });

      it('edit button click should load edit WalletTransaction page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('WalletTransaction');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', walletTransactionPageUrlPattern);
      });

      it('last delete button click should delete instance of WalletTransaction', () => {
        cy.intercept('GET', '/api/wallet-transactions/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('walletTransaction').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', walletTransactionPageUrlPattern);

        walletTransaction = undefined;
      });
    });
  });

  describe('new WalletTransaction page', () => {
    beforeEach(() => {
      cy.visit(walletTransactionPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('WalletTransaction');
    });

    it('should create an instance of WalletTransaction', () => {
      cy.get(`[data-cy="amount"]`).type('1798.38');
      cy.get(`[data-cy="amount"]`).should('have.value', '1798.38');

      cy.get(`[data-cy="transactionType"]`).type('generously');
      cy.get(`[data-cy="transactionType"]`).should('have.value', 'generously');

      cy.get(`[data-cy="referenceType"]`).type('lounge');
      cy.get(`[data-cy="referenceType"]`).should('have.value', 'lounge');

      cy.get(`[data-cy="referenceId"]`).type('15188');
      cy.get(`[data-cy="referenceId"]`).should('have.value', '15188');

      cy.get(`[data-cy="description"]`).type('where');
      cy.get(`[data-cy="description"]`).should('have.value', 'where');

      cy.get(`[data-cy="createdAt"]`).type('2026-05-18T23:15');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-05-18T23:15');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        walletTransaction = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', walletTransactionPageUrlPattern);
    });
  });
});
