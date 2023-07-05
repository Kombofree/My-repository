/// <reference types="cypress" />

describe("e2e - xkom ListingPage",()=>{
    it("ListingPage",()=>{
        cy.intercept("GET","https://api-cdn.mypurecloud.de/webdeployments/v1/deployments/3860fa2d-3a22-4040-8d15-a1b5df24b429/domains.json").as("apiCall");  
      cy.visit("https://www.x-kom.pl/");
      cy.get('[class="modal modal--after-open"]').should('be.visible');
      cy.contains("W porządku").click();
      cy.wait(3000);
      cy.getCookie("trackingPermissionConsentsValue").should('have.have.property','value','%7B%22cookies_analytics%22%3Atrue%2C%22cookies_personalization%22%3Atrue%2C%22cookies_advertisement%22%3Atrue%7D');
      cy.get('[class="sc-1h16fat-0 sc-13hctwf-0 llTAgR"]').eq(2).click()
      cy.wait("@apiCall").then((res) => {
        expect(res.response.statusCode).to.equal(200);
            
    })
      cy.contains('[class="sc-16n31g-4 jWhMsI"]', 'Laptopy do gier').click()
      cy.url().should('eq','https://www.x-kom.pl/g-7/c/2382-laptopy-do-gier.html');
      cy.get('#listing-naglowek').should('be.visible');
      cy.wait(2000);
      //cy.get('[data-name="productCard"]').eq(3).click({force: true});
      cy.get('[class="sc-1yu46qn-10 cLngvW"]').eq(0).click();
      cy.get('[data-name="productTitle"]').should('be.visible');
      cy.wait(3000)
      cy.go('back')
      cy.get('#listing-naglowek').should('be.visible');
      cy.wait(6000)
      cy.get('[fill="#1A1A1A"]').eq(1).click({force: true})
      cy.url().should('eq','https://www.x-kom.pl/g-7/c/2382-laptopy-do-gier.html?page=2');
      cy.get('[class="sc-3qnozx-2 kNGrNi sc-1sjec7y-2 gYUUtM"]').find("input").then(checkbox =>{
        cy.get(checkbox).eq(0).check({force: true});
      })
      cy.url().should('include', 'producent=46-lenovo');
      cy.get('#listing-naglowek').should('have.text', 'Laptopy gamingowe Lenovo(217 wyników)');
      cy.get('[class="sc-1oodwne-0 hGgLsk"]').should('have.text', 'Lenovo');
      cy.contains("Wyczyść wszystkie").eq(0).click();
      cy.get('#listing-naglowek').should('have.text', 'Laptopy do gier(901 wyników)');
      cy.contains('Wyczyść (1)').should('not.exist');
    })
})