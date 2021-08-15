describe('Vaccine statistics web app', function() {
  it('main pages opens as expected', function() {
    cy.visit('http://localhost:3000/api/statistics');
    cy.contains('Vaccine statistics');
    cy.contains('Currently showing:');
    cy.contains(', a web dev exercise for Solita Dev Academy, 2021');
  });

  it('redirection from / functions correctly', function() {
    cy.visit('http://localhost:3000/');
    cy.contains('Vaccine statistics');
    cy.contains('Currently showing:');
    cy.contains(', a web dev exercise for Solita Dev Academy, 2021');
  });

  it('fetching first available data provides expected result', function() {
    cy.visit('http://localhost:3000');
    cy.get('.datetime-picker').type('2021-01-02T13:27');
    cy.get('.submit-button').click();
    cy.contains('5');
  });

  it('fetching late data provides all expired vaccines', function() {
    cy.visit('http://localhost:3000');
    cy.get('.datetime-picker').type('2021-07-01T00:00');
    cy.get('.submit-button').click();
    cy.contains('18015');
  });
});
