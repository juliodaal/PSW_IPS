import { HeroEvents } from "../heroEvents/HeroEvents.js";
import { PricingPlans } from "../pricingPlans/PricingPlans.js";

function IndexEvents() {}

IndexEvents.prototype.initEvents = function() {
    this.carruselHeroEvent();
    this.pricingPlans();
}

IndexEvents.prototype.carruselHeroEvent = function() {
    new HeroEvents(
        document.querySelectorAll(".cs-carousel-pager button"), 
        document.getElementById("carousel-inner"),
        document.querySelectorAll("#carousel-inner div"),
        document.getElementById("description-carrusel-hero"),
        ["Project Statistics", "Priority Dashboard", "Creation Tasks"]
    );
}
IndexEvents.prototype.pricingPlans = function() {
    new PricingPlans(
        document.getElementById("priceSwitch"),
        document.getElementsByClassName("pricing-plan-value"),
        [0,29.99,59.99]
    );
}

export { IndexEvents }