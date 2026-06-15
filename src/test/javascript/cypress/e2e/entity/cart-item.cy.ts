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

describe('CartItem e2e test', () => {
  const cartItemPageUrl = '/cart-item';
  const cartItemPageUrlPattern = new RegExp('/cart-item(\\?.*)?$');
  let username: string;
  let password: string;
  const cartItemSample = { quantity: 8415 };

  let cartItem;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/cart-items+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/cart-items').as('postEntityRequest');
    cy.intercept('DELETE', '/api/cart-items/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (cartItem) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/cart-items/${cartItem.id}`,
      }).then(() => {
        cartItem = undefined;
      });
    }
  });

  it('CartItems menu should load CartItems page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('cart-item');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('CartItem').should('exist');
    cy.url().should('match', cartItemPageUrlPattern);
  });

  describe('CartItem page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(cartItemPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create CartItem page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/cart-item/new$'));
        cy.getEntityCreateUpdateHeading('CartItem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', cartItemPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/cart-items',
          body: cartItemSample,
        }).then(({ body }) => {
          cartItem = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/cart-items+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/cart-items?page=0&size=20>; rel="last",<http://localhost/api/cart-items?page=0&size=20>; rel="first"',
              },
              body: [cartItem],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(cartItemPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details CartItem page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('cartItem');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', cartItemPageUrlPattern);
      });

      it('edit button click should load edit CartItem page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CartItem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', cartItemPageUrlPattern);
      });

      it('edit button click should load edit CartItem page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CartItem');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', cartItemPageUrlPattern);
      });

      it('last delete button click should delete instance of CartItem', () => {
        cy.intercept('GET', '/api/cart-items/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('cartItem').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', cartItemPageUrlPattern);

        cartItem = undefined;
      });
    });
  });

  describe('new CartItem page', () => {
    beforeEach(() => {
      cy.visit(cartItemPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('CartItem');
    });

    it('should create an instance of CartItem', () => {
      cy.get(`[data-cy="quantity"]`).type('10830');
      cy.get(`[data-cy="quantity"]`).should('have.value', '10830');

      cy.get(`[data-cy="createdAt"]`).type('2026-05-19T05:57');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-05-19T05:57');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        cartItem = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', cartItemPageUrlPattern);
    });
  });
});
