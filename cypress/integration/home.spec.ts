/// <reference types="cypress" />

describe('The Home Page', function() {
  it('successfully loads', function() {
    cy.visit('http://localhost:4200'); // change URL to match your dev URL
  });
});
