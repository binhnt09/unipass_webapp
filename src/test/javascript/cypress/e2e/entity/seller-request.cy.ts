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

describe('SellerRequest e2e test', () => {
  const sellerRequestPageUrl = '/seller-request';
  const sellerRequestPageUrlPattern = new RegExp('/seller-request(\\?.*)?$');
  let username: string;
  let password: string;
  // const sellerRequestSample = {"phoneNumber":"glimmer uproot","idCardUrl":"but off eek","status":"whoa","submittedAt":"2026-06-01T06:46:47.564Z"};

  let sellerRequest;
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
      body: {"login":"Hester7","firstName":"Judd","lastName":"Dickens","email":"Molly.Zboncak@gmail.com","langKey":"modulo zea","imageUrl":"happy"},
    }).then(({ body }) => {
      user = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/seller-requests+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/seller-requests').as('postEntityRequest');
    cy.intercept('DELETE', '/api/seller-requests/*').as('deleteEntityRequest');
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
    if (sellerRequest) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/seller-requests/${sellerRequest.id}`,
      }).then(() => {
        sellerRequest = undefined;
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

  it('SellerRequests menu should load SellerRequests page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('seller-request');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('SellerRequest').should('exist');
    cy.url().should('match', sellerRequestPageUrlPattern);
  });

  describe('SellerRequest page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(sellerRequestPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create SellerRequest page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/seller-request/new$'));
        cy.getEntityCreateUpdateHeading('SellerRequest');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', sellerRequestPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/seller-requests',
          body: {
            ...sellerRequestSample,
            user: user,
          },
        }).then(({ body }) => {
          sellerRequest = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/seller-requests+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/seller-requests?page=0&size=20>; rel="last",<http://localhost/api/seller-requests?page=0&size=20>; rel="first"',
              },
              body: [sellerRequest],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(sellerRequestPageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(sellerRequestPageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response?.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details SellerRequest page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('sellerRequest');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', sellerRequestPageUrlPattern);
      });

      it('edit button click should load edit SellerRequest page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('SellerRequest');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', sellerRequestPageUrlPattern);
      });

      it('edit button click should load edit SellerRequest page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('SellerRequest');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', sellerRequestPageUrlPattern);
      });

      // Reason: cannot create a required entity with relationship with required relationships.
      it.skip('last delete button click should delete instance of SellerRequest', () => {
        cy.intercept('GET', '/api/seller-requests/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('sellerRequest').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', sellerRequestPageUrlPattern);

        sellerRequest = undefined;
      });
    });
  });

  describe('new SellerRequest page', () => {
    beforeEach(() => {
      cy.visit(sellerRequestPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('SellerRequest');
    });

    // Reason: cannot create a required entity with relationship with required relationships.
    it.skip('should create an instance of SellerRequest', () => {
      cy.get(`[data-cy="phoneNumber"]`).type('boohoo');
      cy.get(`[data-cy="phoneNumber"]`).should('have.value', 'boohoo');

      cy.get(`[data-cy="hostelLocation"]`).type('knavishly skean');
      cy.get(`[data-cy="hostelLocation"]`).should('have.value', 'knavishly skean');

      cy.get(`[data-cy="bio"]`).type('pace');
      cy.get(`[data-cy="bio"]`).should('have.value', 'pace');

      cy.get(`[data-cy="idCardUrl"]`).type('recovery softly');
      cy.get(`[data-cy="idCardUrl"]`).should('have.value', 'recovery softly');

      cy.get(`[data-cy="status"]`).type('orchestrate midst');
      cy.get(`[data-cy="status"]`).should('have.value', 'orchestrate midst');

      cy.get(`[data-cy="rejectionReason"]`).type('phooey as');
      cy.get(`[data-cy="rejectionReason"]`).should('have.value', 'phooey as');

      cy.get(`[data-cy="submittedAt"]`).type('2026-06-01T05:27');
      cy.get(`[data-cy="submittedAt"]`).blur();
      cy.get(`[data-cy="submittedAt"]`).should('have.value', '2026-06-01T05:27');

      cy.get(`[data-cy="reviewedAt"]`).type('2026-06-01T06:59');
      cy.get(`[data-cy="reviewedAt"]`).blur();
      cy.get(`[data-cy="reviewedAt"]`).should('have.value', '2026-06-01T06:59');

      cy.get(`[data-cy="reviewedBy"]`).type('pixellate');
      cy.get(`[data-cy="reviewedBy"]`).should('have.value', 'pixellate');

      cy.get(`[data-cy="user"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        sellerRequest = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', sellerRequestPageUrlPattern);
    });
  });
});
