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

describe('UserWallet e2e test', () => {
  const userWalletPageUrl = '/user-wallet';
  const userWalletPageUrlPattern = new RegExp('/user-wallet(\\?.*)?$');
  let username: string;
  let password: string;
  // const userWalletSample = {};

  let userWallet;
  // let user;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/users',
      body: {"login":"Nathaniel.Tremblay88","firstName":"Elisa","lastName":"Sanford","email":"Valentina.Roberts9@gmail.com","langKey":"lest","imageUrl":"pronoun afraid down"},
    }).then(({ body }) => {
      user = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/user-wallets+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-wallets').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-wallets/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [user],
    });

  });
   */

  afterEach(() => {
    if (userWallet) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-wallets/${userWallet.id}`,
      }).then(() => {
        userWallet = undefined;
      });
    }
  });

  /* Disabled due to incompatibility
  afterEach(() => {
    if (user) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/users/${user.id}`,
      }).then(() => {
        user = undefined;
      });
    }
  });
   */

  it('UserWallets menu should load UserWallets page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-wallet');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserWallet').should('exist');
    cy.url().should('match', userWalletPageUrlPattern);
  });

  describe('UserWallet page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userWalletPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserWallet page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-wallet/new$'));
        cy.getEntityCreateUpdateHeading('UserWallet');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userWalletPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-wallets',
          body: {
            ...userWalletSample,
            user: user,
          },
        }).then(({ body }) => {
          userWallet = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-wallets+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [userWallet],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(userWalletPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(userWalletPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response?.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details UserWallet page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userWallet');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userWalletPageUrlPattern);
      });

      it('edit button click should load edit UserWallet page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserWallet');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userWalletPageUrlPattern);
      });

      it('edit button click should load edit UserWallet page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserWallet');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userWalletPageUrlPattern);
      });

      // Reason: cannot create a required entity with relationship with required relationships.
      it.skip('last delete button click should delete instance of UserWallet', () => {
        cy.intercept('GET', '/api/user-wallets/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('userWallet').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userWalletPageUrlPattern);

        userWallet = undefined;
      });
    });
  });

  describe('new UserWallet page', () => {
    beforeEach(() => {
      cy.visit(userWalletPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserWallet');
    });

    // Reason: cannot create a required entity with relationship with required relationships.
    it.skip('should create an instance of UserWallet', () => {
      cy.get(`[data-cy="balance"]`).type('8923.15');
      cy.get(`[data-cy="balance"]`).should('have.value', '8923.15');

      cy.get(`[data-cy="frozenBalance"]`).type('7411.83');
      cy.get(`[data-cy="frozenBalance"]`).should('have.value', '7411.83');

      cy.get(`[data-cy="status"]`).type('shabby');
      cy.get(`[data-cy="status"]`).should('have.value', 'shabby');

      cy.get(`[data-cy="isDeleted"]`).should('not.be.checked');
      cy.get(`[data-cy="isDeleted"]`).click();
      cy.get(`[data-cy="isDeleted"]`).should('be.checked');

      cy.get(`[data-cy="createdAt"]`).type('2026-05-18T22:27');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-05-18T22:27');

      cy.get(`[data-cy="updatedAt"]`).type('2026-05-19T20:22');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2026-05-19T20:22');

      cy.get(`[data-cy="user"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        userWallet = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', userWalletPageUrlPattern);
    });
  });
});
