window.onload = (function () {
    var onchangePostalCode = function onchangePostalCode() {
        document.getElementById("postalDescription").textContent = "";
        if (this.value) {
            var url = "/postal-description/" + this.value;
            var xhr;
            if (window.XMLHttpRequest) { //IE7+, Firefox, Chrome, Opera, Safari
                xhr = new XMLHttpRequest();
            } else { //IE5, IE6
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            if (xhr) {
                xhr.open("GET", url, true);
                xhr.responseType = "json";
                xhr.addEventListener("load", function () {
                    if (this.status === 200) {
                        document.getElementById("internalCode").value = xhr.response.internalCode;
                        document.getElementById("postalDescription").textContent = xhr.response.postalDescription;
                    }
                });
                xhr.send();
            }
        }
    };
    return function () {
        document.getElementById("postalCode").onchange = onchangePostalCode;
    };
}());