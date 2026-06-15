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

describe('UserPremium e2e test', () => {
  const userPremiumPageUrl = '/user-premium';
  const userPremiumPageUrlPattern = new RegExp('/user-premium(\\?.*)?$');
  let username: string;
  let password: string;
  const userPremiumSample = { startDate: '2026-05-19T18:29:26.594Z', endDate: '2026-05-19T19:22:37.020Z' };

  let userPremium;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/user-premiums+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-premiums').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-premiums/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (userPremium) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-premiums/${userPremium.id}`,
      }).then(() => {
        userPremium = undefined;
      });
    }
  });

  it('UserPremiums menu should load UserPremiums page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-premium');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserPremium').should('exist');
    cy.url().should('match', userPremiumPageUrlPattern);
  });

  describe('UserPremium page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userPremiumPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserPremium page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-premium/new$'));
        cy.getEntityCreateUpdateHeading('UserPremium');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userPremiumPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-premiums',
          body: userPremiumSample,
        }).then(({ body }) => {
          userPremium = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-premiums+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/user-premiums?page=0&size=20>; rel="last",<http://localhost/api/user-premiums?page=0&size=20>; rel="first"',
              },
              body: [userPremium],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(userPremiumPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details UserPremium page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userPremium');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userPremiumPageUrlPattern);
      });

      it('edit button click should load edit UserPremium page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserPremium');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userPremiumPageUrlPattern);
      });

      it('edit button click should load edit UserPremium page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserPremium');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userPremiumPageUrlPattern);
      });

      it('last delete button click should delete instance of UserPremium', () => {
        cy.intercept('GET', '/api/user-premiums/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('userPremium').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userPremiumPageUrlPattern);

        userPremium = undefined;
      });
    });
  });

  describe('new UserPremium page', () => {
    beforeEach(() => {
      cy.visit(userPremiumPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserPremium');
    });

    it('should create an instance of UserPremium', () => {
      cy.get(`[data-cy="startDate"]`).type('2026-05-19T00:15');
      cy.get(`[data-cy="startDate"]`).blur();
      cy.get(`[data-cy="startDate"]`).should('have.value', '2026-05-19T00:15');

      cy.get(`[data-cy="endDate"]`).type('2026-05-19T15:21');
      cy.get(`[data-cy="endDate"]`).blur();
      cy.get(`[data-cy="endDate"]`).should('have.value', '2026-05-19T15:21');

      cy.get(`[data-cy="status"]`).type('cutlet boo modulo');
      cy.get(`[data-cy="status"]`).should('have.value', 'cutlet boo modulo');

      cy.get(`[data-cy="updatedAt"]`).type('2026-05-18T22:44');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2026-05-18T22:44');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        userPremium = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', userPremiumPageUrlPattern);
    });
  });
});
