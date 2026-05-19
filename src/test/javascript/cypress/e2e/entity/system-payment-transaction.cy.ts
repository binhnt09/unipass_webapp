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

describe('SystemPaymentTransaction e2e test', () => {
  const systemPaymentTransactionPageUrl = '/system-payment-transaction';
  const systemPaymentTransactionPageUrlPattern = new RegExp('/system-payment-transaction(\\?.*)?$');
  let username: string;
  let password: string;
  const systemPaymentTransactionSample = {
    paymentMethod: 'embossing',
    amountVnd: 24872.68,
    coinReceived: 27145.69,
    gatewayReference: 'as only inscribe',
    appOrderId: 'flawed',
  };

  let systemPaymentTransaction;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/system-payment-transactions+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/system-payment-transactions').as('postEntityRequest');
    cy.intercept('DELETE', '/api/system-payment-transactions/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (systemPaymentTransaction) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/system-payment-transactions/${systemPaymentTransaction.id}`,
      }).then(() => {
        systemPaymentTransaction = undefined;
      });
    }
  });

  it('SystemPaymentTransactions menu should load SystemPaymentTransactions page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('system-payment-transaction');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('SystemPaymentTransaction').should('exist');
    cy.url().should('match', systemPaymentTransactionPageUrlPattern);
  });

  describe('SystemPaymentTransaction page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(systemPaymentTransactionPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create SystemPaymentTransaction page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/system-payment-transaction/new$'));
        cy.getEntityCreateUpdateHeading('SystemPaymentTransaction');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', systemPaymentTransactionPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/system-payment-transactions',
          body: systemPaymentTransactionSample,
        }).then(({ body }) => {
          systemPaymentTransaction = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/system-payment-transactions+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/system-payment-transactions?page=0&size=20>; rel="last",<http://localhost/api/system-payment-transactions?page=0&size=20>; rel="first"',
              },
              body: [systemPaymentTransaction],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(systemPaymentTransactionPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details SystemPaymentTransaction page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('systemPaymentTransaction');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', systemPaymentTransactionPageUrlPattern);
      });

      it('edit button click should load edit SystemPaymentTransaction page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('SystemPaymentTransaction');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', systemPaymentTransactionPageUrlPattern);
      });

      it('edit button click should load edit SystemPaymentTransaction page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('SystemPaymentTransaction');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', systemPaymentTransactionPageUrlPattern);
      });

      it('last delete button click should delete instance of SystemPaymentTransaction', () => {
        cy.intercept('GET', '/api/system-payment-transactions/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('systemPaymentTransaction').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', systemPaymentTransactionPageUrlPattern);

        systemPaymentTransaction = undefined;
      });
    });
  });

  describe('new SystemPaymentTransaction page', () => {
    beforeEach(() => {
      cy.visit(systemPaymentTransactionPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('SystemPaymentTransaction');
    });

    it('should create an instance of SystemPaymentTransaction', () => {
      cy.get(`[data-cy="paymentMethod"]`).type('unfortunately nor strictly');
      cy.get(`[data-cy="paymentMethod"]`).should('have.value', 'unfortunately nor strictly');

      cy.get(`[data-cy="paymentChannel"]`).type('gee sophisticated fraternise');
      cy.get(`[data-cy="paymentChannel"]`).should('have.value', 'gee sophisticated fraternise');

      cy.get(`[data-cy="amountVnd"]`).type('18463.34');
      cy.get(`[data-cy="amountVnd"]`).should('have.value', '18463.34');

      cy.get(`[data-cy="coinReceived"]`).type('9067.12');
      cy.get(`[data-cy="coinReceived"]`).should('have.value', '9067.12');

      cy.get(`[data-cy="gatewayReference"]`).type('hmph tremendously');
      cy.get(`[data-cy="gatewayReference"]`).should('have.value', 'hmph tremendously');

      cy.get(`[data-cy="appOrderId"]`).type('upwardly pish');
      cy.get(`[data-cy="appOrderId"]`).should('have.value', 'upwardly pish');

      cy.get(`[data-cy="bankCode"]`).type('abscond');
      cy.get(`[data-cy="bankCode"]`).should('have.value', 'abscond');

      cy.get(`[data-cy="status"]`).type('unlike pace');
      cy.get(`[data-cy="status"]`).should('have.value', 'unlike pace');

      cy.get(`[data-cy="rawResponse"]`).type('../fake-data/blob/hipster.txt');
      cy.get(`[data-cy="rawResponse"]`).invoke('val').should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(`[data-cy="createdAt"]`).type('2026-05-19T03:27');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-05-19T03:27');

      cy.get(`[data-cy="updatedAt"]`).type('2026-05-18T23:58');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2026-05-18T23:58');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        systemPaymentTransaction = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', systemPaymentTransactionPageUrlPattern);
    });
  });
});
