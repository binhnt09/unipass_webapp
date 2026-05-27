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

describe('Campus e2e test', () => {
  const campusPageUrl = '/campus';
  const campusPageUrlPattern = new RegExp('/campus(\\?.*)?$');
  let username: string;
  let password: string;
  const campusSample = { name: 'openly squirm gadzooks', address: 'meh' };

  let campus;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/campuses+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/campuses').as('postEntityRequest');
    cy.intercept('DELETE', '/api/campuses/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (campus) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/campuses/${campus.id}`,
      }).then(() => {
        campus = undefined;
      });
    }
  });

  it('Campuses menu should load Campuses page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('campus');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Campus').should('exist');
    cy.url().should('match', campusPageUrlPattern);
  });

  describe('Campus page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(campusPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Campus page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/campus/new$'));
        cy.getEntityCreateUpdateHeading('Campus');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', campusPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/campuses',
          body: campusSample,
        }).then(({ body }) => {
          campus = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/campuses+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/campuses?page=0&size=20>; rel="last",<http://localhost/api/campuses?page=0&size=20>; rel="first"',
              },
              body: [campus],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(campusPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Campus page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('campus');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', campusPageUrlPattern);
      });

      it('edit button click should load edit Campus page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Campus');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', campusPageUrlPattern);
      });

      it('edit button click should load edit Campus page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Campus');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', campusPageUrlPattern);
      });

      it('last delete button click should delete instance of Campus', () => {
        cy.intercept('GET', '/api/campuses/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('campus').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', campusPageUrlPattern);

        campus = undefined;
      });
    });
  });

  describe('new Campus page', () => {
    beforeEach(() => {
      cy.visit(campusPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Campus');
    });

    it('should create an instance of Campus', () => {
      cy.get(`[data-cy="name"]`).type('aw vibraphone');
      cy.get(`[data-cy="name"]`).should('have.value', 'aw vibraphone');

      cy.get(`[data-cy="address"]`).type('dutiful fake per');
      cy.get(`[data-cy="address"]`).should('have.value', 'dutiful fake per');

      cy.get(`[data-cy="latitude"]`).type('28029.06');
      cy.get(`[data-cy="latitude"]`).should('have.value', '28029.06');

      cy.get(`[data-cy="longitude"]`).type('27095.79');
      cy.get(`[data-cy="longitude"]`).should('have.value', '27095.79');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        campus = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', campusPageUrlPattern);
    });
  });
});
