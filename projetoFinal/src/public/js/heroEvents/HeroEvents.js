function HeroEvents(arrButton, carouselInner, arrImage, descriptionCarruselHero, texts) {
    this.arrButton = Array.from(arrButton);
    this.carouselInner = carouselInner;
    this.arrImage = Array.from(arrImage);
    this.descriptionCarruselHero = descriptionCarruselHero;
    this.texts = texts
    this.initEvents();
};

HeroEvents.prototype.initEvents = function() {
    this.arrButton.forEach(button => {
        button.onclick = (e) => { this.show(e,button.dataset.goto); }
    });
}

HeroEvents.prototype.show = function(e,goto) {
    this.carouselInner.style.opacity = "0";
    setTimeout(() => {
        this.arrImage.map(image => { image.style.zIndex = "0"; });
        this.arrButton.map(button => { button.classList.remove("active"); });
        this.arrImage.map(image => {
            if(image.dataset.image == goto)
                image.style.zIndex = "1";
                e.target.classList.add("active")
                this.descriptionCarruselHero.innerText = this.texts[goto - 1] || this.texts[2]
            this.carouselInner.style.opacity = "1";
        });
    }, 300);
}

export { HeroEvents }