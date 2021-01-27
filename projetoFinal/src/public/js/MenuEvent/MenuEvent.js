function MenuEvent(buttonMenu, buttonTimes, navMenu) {
    this.buttonMenu = buttonMenu;
    this.buttonTimes = buttonTimes;
    this.navMenu = navMenu;
    this.initEvents();
};

MenuEvent.prototype.initEvents = function() {
    this.buttonMenu.onclick = () => { this.show(); }
    this.buttonTimes.onclick = () => { this.close(); } ;
}

MenuEvent.prototype.show = function() {
    this.navMenu.style.display = "block";
    setTimeout(() => {
        this.navMenu.style.right = `0px`;
    }, 100);
} 

MenuEvent.prototype.close = function() {
    let width = this.navMenu.offsetWidth;
    this.navMenu.style.right = `-${width}px`;
    setTimeout(() => {
    this.navMenu.style.display = "none";
    }, 300);
}

export { MenuEvent }