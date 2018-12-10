console.log("In Main.js_1");
function ShowRegisterDiv(num) {
    document.getElementById("SignUp_button").style.display = "none";
    document.getElementById("LogIn_button").style.display = "none";
    if (num === 1) {
        document.getElementById("SignUp").style.display = "block";
        document.getElementById("LogIn").style.display = "none";
    }
    if (num === 2) {
        document.getElementById("SignUp").style.display = "none";
        document.getElementById("LogIn").style.display = "block";
    }
}

console.log("In Main.js_2");
function ShowTrips(id) {
    var heading_ID= "Trip_"+id;
    var div_ID= "Trips_Div_"+id;
    //console.log("Trips_Div: "+div_ID);

    var element = document.querySelector(".active_box");
    element.classList.remove("active_box");

    var element2 = document.querySelector(".box-style");
    element2.classList.remove("box-style");

    document.getElementById(heading_ID).classList.add("active_box");

    document.getElementById(heading_ID).firstElementChild.classList.add("box-style");

    for(var i=1;i<=3;i++){
        var tempID="Trips_Div_"+i;
        //console.log("tempID: "+tempID);
        document.getElementById(tempID).style.display = "none";
    }

    document.getElementById(div_ID).style.display = "block";
}

$('#DeleteModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var recipient = button.data('whatever');


    var modal = $(this)
    modal.find('.modal-footer a').attr("href", recipient);
});

$( document ).ready(function() {

    setInterval(stopAnimation,10000);

    function stopAnimation(){
        $( "#thread1" ).css("display", "none" );
    }

});
$(".heart").click(function() {
    $(this).toggleClass("fa-heart fa-heart-o");
});

$(function() {
    $(".heart").on("click", function() {
        $(this).toggleClass("is-active");
    });
});
// function showTripsDiv() {
//     document.getElementById("loader").style.display = "none";
//     document.getElementById("Trips_Div").style.display = "block";
// }
//
// function progress_timer() {
//     setTimeout(showTripsDiv, 3000);
// }
console.log("In Main.js_3");
(function getLocation() {
    console.log("In GeLocation");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
})();

