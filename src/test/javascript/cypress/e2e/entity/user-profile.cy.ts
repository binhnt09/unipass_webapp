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

describe('UserProfile e2e test', () => {
  const userProfilePageUrl = '/user-profile';
  const userProfilePageUrlPattern = new RegExp('/user-profile(\\?.*)?$');
  let username: string;
  let password: string;
  // const userProfileSample = {};

  let userProfile;
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
      body: {"login":"Wilbur_Beier","firstName":"Catherine","lastName":"Jakubowski","email":"Gloria_Von@hotmail.com","langKey":"agile sequ","imageUrl":"where shy after"},
    }).then(({ body }) => {
      user = body;
    });
  });
   */

  beforeEach(() => {
    cy.intercept('GET', '/api/user-profiles+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/user-profiles').as('postEntityRequest');
    cy.intercept('DELETE', '/api/user-profiles/*').as('deleteEntityRequest');
  });

  /* Disabled due to incompatibility
  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [user],
    });

    cy.intercept('GET', '/api/campuses', {
      statusCode: 200,
      body: [],
    });

  });
   */

  afterEach(() => {
    if (userProfile) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/user-profiles/${userProfile.id}`,
      }).then(() => {
        userProfile = undefined;
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

  it('UserProfiles menu should load UserProfiles page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-profile');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserProfile').should('exist');
    cy.url().should('match', userProfilePageUrlPattern);
  });

  describe('UserProfile page', () => {
    it('should have translated page title', () => {
      cy.visit(userProfilePageUrl);
      cy.getEntityHeading('UserProfile').should('not.contain', 'unipassWebApp.userProfile.home.title');
    });

    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userProfilePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserProfile page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-profile/new$'));
        cy.getEntityCreateUpdateHeading('UserProfile');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userProfilePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      /* Disabled due to incompatibility
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/user-profiles',
          body: {
            ...userProfileSample,
            user: user,
          },
        }).then(({ body }) => {
          userProfile = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/user-profiles+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/user-profiles?page=0&size=20>; rel="last",<http://localhost/api/user-profiles?page=0&size=20>; rel="first"',
              },
              body: [userProfile],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(userProfilePageUrl);

        cy.wait('@entitiesRequestInternal');
      });
       */

      beforeEach(function () {
        cy.visit(userProfilePageUrl);

        cy.wait('@entitiesRequest').then(({ response }) => {
          if (response?.body.length === 0) {
            this.skip();
          }
        });
      });

      it('detail button click should load details UserProfile page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userProfile');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userProfilePageUrlPattern);
      });

      it('edit button click should load edit UserProfile page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserProfile');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userProfilePageUrlPattern);
      });

      it('edit button click should load edit UserProfile page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserProfile');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userProfilePageUrlPattern);
      });

      // Reason: cannot create a required entity with relationship with required relationships.
      it.skip('last delete button click should delete instance of UserProfile', () => {
        cy.intercept('GET', '/api/user-profiles/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('userProfile').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userProfilePageUrlPattern);

        userProfile = undefined;
      });
    });
  });

  describe('new UserProfile page', () => {
    beforeEach(() => {
      cy.visit(userProfilePageUrl);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserProfile');
    });

    // Reason: cannot create a required entity with relationship with required relationships.
    it.skip('should create an instance of UserProfile', () => {
      cy.get(`[data-cy="phoneNumber"]`).type('overvalue aw whose');
      cy.get(`[data-cy="phoneNumber"]`).should('have.value', 'overvalue aw whose');

      cy.get(`[data-cy="studentIdNumber"]`).type('yum');
      cy.get(`[data-cy="studentIdNumber"]`).should('have.value', 'yum');

      cy.get(`[data-cy="reputationScore"]`).type('21880');
      cy.get(`[data-cy="reputationScore"]`).should('have.value', '21880');

      cy.get(`[data-cy="referralCode"]`).type('whereas enormously c');
      cy.get(`[data-cy="referralCode"]`).should('have.value', 'whereas enormously c');

      cy.get(`[data-cy="fingerprintId"]`).type('unabashedly snowplow');
      cy.get(`[data-cy="fingerprintId"]`).should('have.value', 'unabashedly snowplow');

      cy.get(`[data-cy="currentPremiumLevel"]`).type('9997');
      cy.get(`[data-cy="currentPremiumLevel"]`).should('have.value', '9997');

      cy.get(`[data-cy="isStudentVerified"]`).should('not.be.checked');
      cy.get(`[data-cy="isStudentVerified"]`).click();
      cy.get(`[data-cy="isStudentVerified"]`).should('be.checked');

      cy.get(`[data-cy="isDeleted"]`).should('not.be.checked');
      cy.get(`[data-cy="isDeleted"]`).click();
      cy.get(`[data-cy="isDeleted"]`).should('be.checked');

      cy.get(`[data-cy="createdAt"]`).type('2026-05-19T08:12');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2026-05-19T08:12');

      cy.get(`[data-cy="updatedAt"]`).type('2026-05-19T00:49');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2026-05-19T00:49');

      cy.get(`[data-cy="user"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        userProfile = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', userProfilePageUrlPattern);
    });
  });
});
