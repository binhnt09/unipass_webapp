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

describe('University e2e test', () => {
  const universityPageUrl = '/university';
  const universityPageUrlPattern = new RegExp('/university(\\?.*)?$');
  let username: string;
  let password: string;
  const universitySample = { code: 'retool jut reopen', name: 'mad' };

  let university;

  before(() => {
    cy.credentials().then(credentials => {
      ({ username, password } = credentials);
    });
  });

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/universities+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/universities').as('postEntityRequest');
    cy.intercept('DELETE', '/api/universities/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (university) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/universities/${university.id}`,
      }).then(() => {
        university = undefined;
      });
    }
  });

  it('Universities menu should load Universities page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('university');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('University').should('exist');
    cy.url().should('match', universityPageUrlPattern);
  });

  describe('University page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(universityPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create University page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/university/new$'));
        cy.getEntityCreateUpdateHeading('University');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', universityPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/universities',
          body: universitySample,
        }).then(({ body }) => {
          university = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/universities+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/universities?page=0&size=20>; rel="last",<http://localhost/api/universities?page=0&size=20>; rel="first"',
              },
              body: [university],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(universityPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details University page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('university');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', universityPageUrlPattern);
      });

      it('edit button click should load edit University page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('University');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', universityPageUrlPattern);
      });

      it('edit button click should load edit University page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('University');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', universityPageUrlPattern);
      });

      it('last delete button click should delete instance of University', () => {
        cy.intercept('GET', '/api/universities/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('university').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', universityPageUrlPattern);

        university = undefined;
      });
    });
  });

  describe('new University page', () => {
    beforeEach(() => {
      cy.visit(universityPageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('University');
    });

    it('should create an instance of University', () => {
      cy.get(`[data-cy="code"]`).type('though ride than');
      cy.get(`[data-cy="code"]`).should('have.value', 'though ride than');

      cy.get(`[data-cy="name"]`).type('numeric');
      cy.get(`[data-cy="name"]`).should('have.value', 'numeric');

      cy.get(`[data-cy="logoUrl"]`).type('tomorrow wholly legitimize');
      cy.get(`[data-cy="logoUrl"]`).should('have.value', 'tomorrow wholly legitimize');

      cy.get(`[data-cy="status"]`).type('greedily apt');
      cy.get(`[data-cy="status"]`).should('have.value', 'greedily apt');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        university = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', universityPageUrlPattern);
    });
  });
});
