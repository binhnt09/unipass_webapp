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

describe('ItemRequest e2e test', () => {
  const itemRequestPageUrl = '/item-request';
  const itemRequestPageUrlPattern = new RegExp('/item-request(\\?.*)?$');
  let username: string;
  let password: string;
  const itemRequestSample = { title: 'qua' };

  let itemRequest;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/item-requests+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/item-requests').as('postEntityRequest');
    cy.intercept('DELETE', '/api/item-requests/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (itemRequest) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/item-requests/${itemRequest.id}`,
      }).then(() => {
        itemRequest = undefined;
      });
    }
  });

  it('ItemRequests menu should load ItemRequests page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('item-request');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ItemRequest').should('exist');
    cy.url().should('match', itemRequestPageUrlPattern);
  });

  describe('ItemRequest page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(itemRequestPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ItemRequest page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/item-request/new$'));
        cy.getEntityCreateUpdateHeading('ItemRequest');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', itemRequestPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/item-requests',
          body: itemRequestSample,
        }).then(({ body }) => {
          itemRequest = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/item-requests+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/item-requests?page=0&size=20>; rel="last",<http://localhost/api/item-requests?page=0&size=20>; rel="first"',
              },
              body: [itemRequest],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(itemRequestPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ItemRequest page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('itemRequest');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', itemRequestPageUrlPattern);
      });

      it('edit button click should load edit ItemRequest page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ItemRequest');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', itemRequestPageUrlPattern);
      });

      it('edit button click should load edit ItemRequest page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ItemRequest');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', itemRequestPageUrlPattern);
      });

      it('last delete button click should delete instance of ItemRequest', () => {
        cy.intercept('GET', '/api/item-requests/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('itemRequest').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', itemRequestPageUrlPattern);

        itemRequest = undefined;
      });
    });
  });

  describe('new ItemRequest page', () => {
    beforeEach(() => {
      cy.visit(itemRequestPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ItemRequest');
    });

    it('should create an instance of ItemRequest', () => {
      cy.get(`[data-cy="title"]`).type('out energetically');
      cy.get(`[data-cy="title"]`).should('have.value', 'out energetically');

      cy.get(`[data-cy="description"]`).type('ideal opposite');
      cy.get(`[data-cy="description"]`).should('have.value', 'ideal opposite');

      cy.get(`[data-cy="expectedPrice"]`).type('18004.77');
      cy.get(`[data-cy="expectedPrice"]`).should('have.value', '18004.77');

      cy.get(`[data-cy="status"]`).type('which reluctantly unto');
      cy.get(`[data-cy="status"]`).should('have.value', 'which reluctantly unto');

      cy.get(`[data-cy="createdAt"]`).type('2026-05-19T18:51');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-05-19T18:51');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        itemRequest = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', itemRequestPageUrlPattern);
    });
  });
});
