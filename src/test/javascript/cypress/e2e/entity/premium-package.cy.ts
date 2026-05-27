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

describe('PremiumPackage e2e test', () => {
  const premiumPackagePageUrl = '/premium-package';
  const premiumPackagePageUrlPattern = new RegExp('/premium-package(\\?.*)?$');
  let username: string;
  let password: string;
  const premiumPackageSample = { name: 'frightfully meatloaf', priceCoin: 14501.52, durationDays: 6942 };

  let premiumPackage;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/premium-packages+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/premium-packages').as('postEntityRequest');
    cy.intercept('DELETE', '/api/premium-packages/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (premiumPackage) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/premium-packages/${premiumPackage.id}`,
      }).then(() => {
        premiumPackage = undefined;
      });
    }
  });

  it('PremiumPackages menu should load PremiumPackages page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('premium-package');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('PremiumPackage').should('exist');
    cy.url().should('match', premiumPackagePageUrlPattern);
  });

  describe('PremiumPackage page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(premiumPackagePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create PremiumPackage page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/premium-package/new$'));
        cy.getEntityCreateUpdateHeading('PremiumPackage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', premiumPackagePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/premium-packages',
          body: premiumPackageSample,
        }).then(({ body }) => {
          premiumPackage = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/premium-packages+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/premium-packages?page=0&size=20>; rel="last",<http://localhost/api/premium-packages?page=0&size=20>; rel="first"',
              },
              body: [premiumPackage],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(premiumPackagePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details PremiumPackage page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('premiumPackage');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', premiumPackagePageUrlPattern);
      });

      it('edit button click should load edit PremiumPackage page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PremiumPackage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', premiumPackagePageUrlPattern);
      });

      it('edit button click should load edit PremiumPackage page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PremiumPackage');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', premiumPackagePageUrlPattern);
      });

      it('last delete button click should delete instance of PremiumPackage', () => {
        cy.intercept('GET', '/api/premium-packages/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('premiumPackage').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', premiumPackagePageUrlPattern);

        premiumPackage = undefined;
      });
    });
  });

  describe('new PremiumPackage page', () => {
    beforeEach(() => {
      cy.visit(premiumPackagePageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('PremiumPackage');
    });

    it('should create an instance of PremiumPackage', () => {
      cy.get(`[data-cy="name"]`).type('gadzooks busy');
      cy.get(`[data-cy="name"]`).should('have.value', 'gadzooks busy');

      cy.get(`[data-cy="priceCoin"]`).type('13141.34');
      cy.get(`[data-cy="priceCoin"]`).should('have.value', '13141.34');

      cy.get(`[data-cy="durationDays"]`).type('4232');
      cy.get(`[data-cy="durationDays"]`).should('have.value', '4232');

      cy.get(`[data-cy="features"]`).type('frantically');
      cy.get(`[data-cy="features"]`).should('have.value', 'frantically');

      cy.get(`[data-cy="isDeleted"]`).should('not.be.checked');
      cy.get(`[data-cy="isDeleted"]`).click();
      cy.get(`[data-cy="isDeleted"]`).should('be.checked');

      cy.get(`[data-cy="createdAt"]`).type('2026-05-19T09:43');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-05-19T09:43');

      cy.get(`[data-cy="updatedAt"]`).type('2026-05-19T00:58');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2026-05-19T00:58');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        premiumPackage = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', premiumPackagePageUrlPattern);
    });
  });
});
