'use strict';

//on declare les variables en dehors du bloc
var lat;
var long;
var url;
var deg;
var xmlhttp = new XMLHttpRequest();
var rawdata = null;
var xmlhttpville = new XMLHttpRequest();
var rawdata2 = null;
var id_instagram = 'e939f765f2b843f3a503b2e1aff5dfcb';

function onLoad() {
    document.addEventListener("deviceReady", onDeviceReady, false);
    //document.addEventListener("pause", pausefonction, false);
}

// device API available
// function pausefonction() { console.log('en pause') }

function onDeviceReady() {
    // console.log(navigator.accelerometer);
    // console.log('prets');
    appworks(); //tous le js de notre app
}

onLoad(); // on lance notre app

function appworks() {
    //une premiere fonction qui recupere les coordonnees SI le navigateur le supporte. Si ca fonctionne on declenche la fonction determinerPosition qui va renseigner les variables.
    function obtenirLocalisation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(determinerPosition, annulerAffichage);
        } else {
            alert("Geolocalisation non implementee.");
        }
    };

    //si on a la position determinée on remplit les 3 variables
    function determinerPosition(position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        //console.log(lat, long);

        //on appelle l'API openweathermap avec la geoloc activée
        url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&id=kris&APPID=b2d5578f5b4a6205ce508a1f26795330&lang=fr&units=metric";
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    };

    //fonction qui retourne la direction du vent
    function dirVent(deg) {
        var dir;
        if (deg > 337.5 && deg <= 22.5) {
            dir = 'Nord';
        } else if (deg > 22.5 && deg <= 77.5) {
            dir = 'Nord-Est';
        } else if (deg > 77.5 && deg <= 112.5) {
            dir = 'Est';
        } else if (deg > 112.5 && deg <= 157.5) {
            dir = 'Sud-Est';
        } else if (deg > 157.5 && deg <= 202.5) {
            dir = 'Sud';
        } else if (deg > 202.5 && deg <= 247.5) {
            dir = 'Sud-Ouest';
        } else if (deg > 247.5 && deg <= 292.5) {
            dir = 'Ouest';
        } else if (deg > 292.5 && deg <= 337.5) {
            dir = 'Nord-Ouest';
        } else if (deg < 0 || deg > 360) {
            dir = '';
        }
        return dir;
    };

    //gestion des erreurs avec un message pour le user
    function annulerAffichage() {
        var city = new Vue({
            el: '#city',
            data: {
                intro: '',
                city: 'ATTENTION : probleme de géolocalisation',
                temp: 'Veillez à autoriser cette fonction',
                image: 'images/icon.png',
                meteo: '',
                hygrometrie: '',
                vent: '',
                direction: ''
            }
        })
    };


    //on récupère les données de la ville géolocalisée
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            rawdata = JSON.parse(this.responseText);
            console.log('Ville géolocalisée : ' + rawdata.name + ', Pays : ' + rawdata.sys.country);
            var city = new Vue({
                el: '#city',
                data: {
                    intro: 'Actuellement, à ',
                    city: rawdata.name + ' :',
                    temp: Math.round(rawdata.main.temp) + '°C',
                    image: "http://openweathermap.org/img/w/" + rawdata.weather[0].icon + ".png",
                    meteo: rawdata.weather[0].description,
                    hygrometrie: 'humidité : ' + rawdata.main.humidity + '%',
                    vent: 'vent : ' + Math.round(rawdata.wind.speed * 1.852) + ' km/h  ',
                    direction: dirVent(rawdata.wind.deg)
                }
            })
        }
    };

    //on appelle la fonction
    obtenirLocalisation();


    //affichage de la ville recherchée
    var nouvelleVille = new Vue({
        el: '#Ville2',
        data: {
            newcity: '',
            newtemp: '',
            newicone: 'images/search.png',
            newmeteo: '',
            newhygrometrie: '',
            newvent: '',
            newdirection: '',
        },
        methods: {
            searchVille: function(event) {
                var ville = document.getElementById('search').value;
                //console.log(ville);
                var newurl = "http://api.openweathermap.org/data/2.5/weather?q=" + ville + "&id=kris&APPID=b2d5578f5b4a6205ce508a1f26795330&lang=fr&units=metric";
                xmlhttpville.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        rawdata2 = JSON.parse(this.responseText);
                        console.log('Ville recherchée : ' + rawdata2.name + ', Pays : ' + rawdata2.sys.country);

                        nouvelleVille.newcity = rawdata2.name + ' :';
                        nouvelleVille.newtemp = Math.round(rawdata2.main.temp) + '°C';
                        nouvelleVille.newicone = "http://openweathermap.org/img/w/" + rawdata2.weather[0].icon + ".png";
                        nouvelleVille.newmeteo = rawdata2.weather[0].description;
                        nouvelleVille.newhygrometrie = 'humidité : ' + rawdata2.main.humidity + '%';
                        nouvelleVille.newvent = 'vent : ' + Math.round(rawdata2.wind.speed * 1.852) + ' km/h  ';
                        nouvelleVille.newdirection = dirVent(rawdata2.wind.deg);
                    }
                }
                if (event) {
                    xmlhttpville.open("GET", newurl, true);
                    xmlhttpville.send();
                }
            }
        }
    });
}