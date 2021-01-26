function PricingPlans(button,arrElements, arrValues) {
    this.button = button;
    this.arrElements = Array.from(arrElements);
    this.arrValues = arrValues

    this.initEvents();
}

PricingPlans.prototype.initEvents = function() {
    this.originalPrice()
    this.button.onclick = () => { this.changeValue() }
}

PricingPlans.prototype.changeValue = function() {
    if(this.button.checked){
        for (let i = 0; i < this.arrElements.length; i++) {
            this.arrElements[i].innerText = Math.floor(this.arrValues[i] * 12);
        }
    } else {
        this.originalPrice()
    }
}
PricingPlans.prototype.originalPrice = function() {
    for (let i = 0; i < this.arrElements.length; i++) {
        this.arrElements[i].innerText = this.arrValues[i];
    }
}

export { PricingPlans }