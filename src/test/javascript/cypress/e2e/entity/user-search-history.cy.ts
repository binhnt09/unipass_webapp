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

describe('UserSearchHistory e2e test', () => {
  const userSearchHistoryPageUrl = '/user-search-history';
  const userSearchHistoryPageUrlPattern = new RegExp('/user-search-history(\\?.*)?$');
  let username: string;
  let password: string;
  const userSearchHistorySample = { keyword: 'duh' };

  let userSearchHistory;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/user-search-histories+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-search-histories').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-search-histories/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (userSearchHistory) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-search-histories/${userSearchHistory.id}`,
      }).then(() => {
        userSearchHistory = undefined;
      });
    }
  });

  it('UserSearchHistories menu should load UserSearchHistories page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-search-history');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserSearchHistory').should('exist');
    cy.url().should('match', userSearchHistoryPageUrlPattern);
  });

  describe('UserSearchHistory page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userSearchHistoryPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserSearchHistory page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-search-history/new$'));
        cy.getEntityCreateUpdateHeading('UserSearchHistory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userSearchHistoryPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-search-histories',
          body: userSearchHistorySample,
        }).then(({ body }) => {
          userSearchHistory = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-search-histories+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/user-search-histories?page=0&size=20>; rel="last",<http://localhost/api/user-search-histories?page=0&size=20>; rel="first"',
              },
              body: [userSearchHistory],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(userSearchHistoryPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details UserSearchHistory page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userSearchHistory');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userSearchHistoryPageUrlPattern);
      });

      it('edit button click should load edit UserSearchHistory page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserSearchHistory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userSearchHistoryPageUrlPattern);
      });

      it('edit button click should load edit UserSearchHistory page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserSearchHistory');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userSearchHistoryPageUrlPattern);
      });

      it('last delete button click should delete instance of UserSearchHistory', () => {
        cy.intercept('GET', '/api/user-search-histories/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('userSearchHistory').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userSearchHistoryPageUrlPattern);

        userSearchHistory = undefined;
      });
    });
  });

  describe('new UserSearchHistory page', () => {
    beforeEach(() => {
      cy.visit(userSearchHistoryPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserSearchHistory');
    });

    it('should create an instance of UserSearchHistory', () => {
      cy.get(`[data-cy="keyword"]`).type('ha');
      cy.get(`[data-cy="keyword"]`).should('have.value', 'ha');

      cy.get(`[data-cy="searchCount"]`).type('10414');
      cy.get(`[data-cy="searchCount"]`).should('have.value', '10414');

      cy.get(`[data-cy="lastSearchedAt"]`).type('2026-05-19T03:26');
      cy.get(`[data-cy="lastSearchedAt"]`).blur();
      cy.get(`[data-cy="lastSearchedAt"]`).should('have.value', '2026-05-19T03:26');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        userSearchHistory = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', userSearchHistoryPageUrlPattern);
    });
  });
});
