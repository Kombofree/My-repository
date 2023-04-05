/// <reference types="cypress" />

let direction = "Djerba" 
let stay = 9; // from 2 to 17 days
let month = "September" //Avaiable: June, July, August, September
let priceFrom = 4500 //cena za 2 osoby od...
let priceTo = 12500  //cena za 2 osoby do...

describe("E2E - Search for X Holiday with TUI", ()=>{
    it("Accepting cookies and ridding of newsletter, perform API tests",()=>{
        cy.intercept("GET", "https://www.tui.pl/api/user-info").as("reqtag");
        cy.visit("https://www.tui.pl/");
        cy.contains('[class="button__content"]',"Zaakceptuj").click(); //akceptacja cookie
        cy.wait(7000);
        cy.get('body').click(0,0); //klikniecie w body lewo góra
        cy.wait("@reqtag")
        cy.get("@reqtag").then(res => {
            console.log(res)
            expect(res.state).to.contain("Complete")
            expect(res.response.statusCode).to.eql(200)
            expect(res.response.body.language).to.contain("pl")
            expect(res.request.headers.host).to.contain("www.tui.pl");
        })
    })
    

    it("Choise the airport", ()=>{
        cy.contains('[class="dropdown-field__value"]', "Dowolne lotnisko").click();
        cy.get('[class="dropdown-items-list__group dropdown-items-list__group--split"]').find("input").then(checkbox =>{
            cy.get(checkbox).get('[value="KTW|Katowice"]').check({force: true});
            cy.get(checkbox).get('[value="KRK|Kraków"]').check({force: true}).type('{esc}');
        })
    })

    it("Choose a destination",()=>{
        cy.contains('[class="dropdown-field__value"]', "Dowolny kierunek").click();
        cy.get('input[placeholder="Wyszukaj kraj lub region..."]').type(direction);
        cy.get('[class="bp3-control bp3-checkbox checkbox direction-item"]').click();
    })

    it("Choose a length of stay", ()=>{
        cy.get('[class="dropdown-field-wrapper"]').eq(4).click();
        if(stay >= 2 && stay <= 5){
        cy.get('[class="dropdown-items-list__group"]').find("input").eq(0).check({force: true});
        } else if(stay >= 6 && stay <= 8){
        cy.get('[class="dropdown-items-list__group"]').find("input").eq(1).check({force: true});
        } else if(stay >= 9 && stay <= 12){
        cy.get('[class="dropdown-items-list__group"]').find("input").eq(2).check({force: true});
        } else if(stay >= 13 && stay <= 17){
        cy.get('[class="dropdown-items-list__group"]').find("input").eq(3).check({force: true});
        }
        cy.get('body').click(0,0);
    })

    it("Choose the month", ()=>{
        cy.get('[class="dropdown-field-wrapper"]').eq(5).click();
        cy.get('#bp3-tab-title_gs-travelDate_tab-gs-travelDate-Caly-miesiac').click();
        if(month == "June"){
        cy.contains("czerwiec").eq(0).click();
        } else if(month == "July"){
        cy.contains("lipiec").eq(0).click();
        } else if(month == "August"){
        cy.contains("sierpień").eq(0).click();
        } else if(month == "September"){
        cy.contains("wrzesień").eq(0).click();
        }
        cy.contains('[class="button__content"]', "Wybierz").click();
        cy.contains('[class="button__content"]', "Szukaj").click();
        cy.contains('[class="button__content"]',"Zaakceptuj").click();
    })

    
    it("Setting filters, performin API tests", ()=>{
        cy.intercept("POST", "https://www.tui.pl/search/offers").as("searchOfferts")
        cy.get('[data-testid="GT06-AI"]').check({force: true});
        cy.get('#priceFrom').type(priceFrom, {delay: 300})
        cy.get('#priceTo').type(priceTo, {delay: 300})
        cy.get('[data-testid="4s"]').check({force: true});
        cy.get('[data-testid="GT03-DIBE#ST03-DIRE"]').check({force: true});
        cy.get('[data-testid="GT03-BEAC#ST03-SAND"]').check({force: true});
        cy.get('[data-testid="GT13-SEVI"]').check({force: true});
        cy.get('[class="results-header"]').scrollIntoView();
        cy.wait("@searchOfferts")
        cy.get("@searchOfferts").then(results =>{
            console.log(results)
            expect(results.state).to.contains("Received")
            expect(results.request.method).to.contains("POST")
            expect(results.request.responseTimeout).to.eql(30000)
        })
        
    })

})