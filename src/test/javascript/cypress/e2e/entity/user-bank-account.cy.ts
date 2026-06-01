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

describe('UserBankAccount e2e test', () => {
  const userBankAccountPageUrl = '/user-bank-account';
  const userBankAccountPageUrlPattern = new RegExp('/user-bank-account(\\?.*)?$');
  let username: string;
  let password: string;
  const userBankAccountSample = { bankName: 'censor chubby gripper', accountNumber: 'angrily', accountName: 'Savings Account' };

  let userBankAccount;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/user-bank-accounts+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-bank-accounts').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-bank-accounts/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (userBankAccount) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-bank-accounts/${userBankAccount.id}`,
      }).then(() => {
        userBankAccount = undefined;
      });
    }
  });

  it('UserBankAccounts menu should load UserBankAccounts page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-bank-account');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserBankAccount').should('exist');
    cy.url().should('match', userBankAccountPageUrlPattern);
  });

  describe('UserBankAccount page', () => {
    it('should have translated page title', () => {
      cy.visit(userBankAccountPageUrl);
      cy.getEntityHeading('UserBankAccount').should('not.contain', 'unipassWebApp.userBankAccount.home.title');
    });

    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userBankAccountPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserBankAccount page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-bank-account/new$'));
        cy.getEntityCreateUpdateHeading('UserBankAccount');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userBankAccountPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-bank-accounts',
          body: userBankAccountSample,
        }).then(({ body }) => {
          userBankAccount = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-bank-accounts+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/user-bank-accounts?page=0&size=20>; rel="last",<http://localhost/api/user-bank-accounts?page=0&size=20>; rel="first"',
              },
              body: [userBankAccount],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(userBankAccountPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details UserBankAccount page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userBankAccount');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userBankAccountPageUrlPattern);
      });

      it('edit button click should load edit UserBankAccount page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserBankAccount');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userBankAccountPageUrlPattern);
      });

      it('edit button click should load edit UserBankAccount page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserBankAccount');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userBankAccountPageUrlPattern);
      });

      it('last delete button click should delete instance of UserBankAccount', () => {
        cy.intercept('GET', '/api/user-bank-accounts/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('userBankAccount').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userBankAccountPageUrlPattern);

        userBankAccount = undefined;
      });
    });
  });

  describe('new UserBankAccount page', () => {
    beforeEach(() => {
      cy.visit(userBankAccountPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserBankAccount');
    });

    it('should create an instance of UserBankAccount', () => {
      cy.get(`[data-cy="bankName"]`).type('live yowza busily');
      cy.get(`[data-cy="bankName"]`).should('have.value', 'live yowza busily');

      cy.get(`[data-cy="accountNumber"]`).type('because anenst');
      cy.get(`[data-cy="accountNumber"]`).should('have.value', 'because anenst');

      cy.get(`[data-cy="accountName"]`).type('Investment Account');
      cy.get(`[data-cy="accountName"]`).should('have.value', 'Investment Account');

      cy.get(`[data-cy="isDefault"]`).should('not.be.checked');
      cy.get(`[data-cy="isDefault"]`).click();
      cy.get(`[data-cy="isDefault"]`).should('be.checked');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        userBankAccount = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', userBankAccountPageUrlPattern);
    });
  });
});
