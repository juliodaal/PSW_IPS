function ModalsEvent(button, modal, close, changeModal = false) {
        this.button = button;
        this.modal = modal;
        this.close = close;
        this.changeModal = changeModal;
        this.initEvents();
};

ModalsEvent.prototype.initEvents = function() {
    this.changeModal 
    ? this.button.onclick = () => { this.show(this.modal); this.hidden(this.changeModal); }
    : this.button.onclick = () => { this.show(this.modal); } ;
    this.close.onclick = () => { this.hidden(this.modal); }
    this.modal.onmouseup = (e) => { this.hiddenOverlay(e, this.modal); }
    this.showPassword();
}

ModalsEvent.prototype.show = function(_modal) {
    _modal.style.display = "block";
    setTimeout(() => {
        _modal.classList.add("show");
    }, 100);
} 

ModalsEvent.prototype.hidden = function(_modal) {
    _modal.classList.remove("show");
    setTimeout(() => {
        _modal.style.display = "none";
    }, 100);
}

ModalsEvent.prototype.hiddenOverlay = function(e,_modal) {
    if(e.target == _modal)
        this.hidden(_modal);
}

ModalsEvent.prototype.showPassword = function() {
    const arrCheckPassword = Array.from(document.getElementsByClassName("check-password"));
    const arrInputPasswords = Array.from(document.getElementsByClassName("password"));
    arrCheckPassword.map(input => {
        input.onclick = () => {
            arrInputPasswords.forEach(element =>{
                if(input.dataset.check === element.dataset.pass)
                    input.checked === true ? element.type = "text" : element.type = "password"; });
        }});
}

export { ModalsEvent }