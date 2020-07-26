"use strict";

//List of species and their number of villagers.
var species = { "강아지": 16, 
"개구리": 18, 
"개미핥기": 7, 
"고릴라": 9, 
"고양이": 23, 
"곰": 15, 
"늑대": 11, 
"다람쥐": 18, 
"닭": 9, 
"독수리": 9, 
"돼지": 15, 
"말": 15, 
"문어": 3, 
"사슴": 10, 
"사자": 7, 
"새": 13, 
"수소": 6, 
"아기곰": 16, 
"악어": 7, 
"암소": 4, 
"양": 13, 
"염소": 8, 
"오리": 17, 
"원숭이": 8, 
"쥐": 15, 
"캥거루": 8, 
"코끼리": 11, 
"코뿔소": 6, 
"코알라": 9, 
"타조": 10, 
"토끼": 20, 
"펭귄": 13, 
"하마": 7, 
"햄스터": 8, 
"호랑이": 7, 
};

var speciesSelector = document.getElementById('species-select');
var result = document.getElementById('result');
var currentFormula = document.getElementById('formula-span');

//Create Chart
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: '확률',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            pointRadius: 0,
            borderWidth: 1
        }]
    },
    options: {
        title: {
            display: true,
            text: "확률/티켓 수"
        } 
    }
});

//Creates the entries in the villager species select.
for (var villagerKind in species) {
    var opt = document.createElement('option');
    opt.value = villagerKind;
    opt.innerHTML = villagerKind;
    speciesSelector.appendChild(opt);
}

function calculateVillagersOdds() {
    //Get the user inputs.
    var numberOfVillager = species[document.getElementById("species-select").value];
    var selectedSpecies = document.getElementById("species-select").value.toLowerCase();
    var numberOwned = +document.getElementById("villager-number").value;
    var nmtNumber = +document.getElementById("nmt-number").value;
    var decimalPlaces = +document.getElementById("decimal-places").value;

    //Limits the number of decimal places to 1 (would also break toFixed() if user entered something smaller than 1).
    if (decimalPlaces < 1) {
        decimalPlaces = 1;
    }

    //Update the number of species that can be found if the user has complete species on his island (eg: all octopi and all cows...).
    var numberOfSpecies = Object.keys(species).length;
    if (document.getElementById('has-1-species').checked || document.getElementById('has-2-species').checked) {
        numberOfSpecies--;
        if (document.getElementById('has-2-species').checked) {
            numberOfSpecies--;
        }
    }
    var percent = (1 / numberOfSpecies * 1 / (numberOfVillager - numberOwned) * 100).toFixed(decimalPlaces);

    //Calculate the odds of finding a specific villager based on the number of tickets.
    var bernoulli = (100 - Math.pow((100 - (1 / numberOfSpecies * 1 / (numberOfVillager - numberOwned) * 100)) / 100, nmtNumber) * 100).toFixed(decimalPlaces);

    //Don't blame me if you don't get Raymond in 40000 islands.
    if (bernoulli == 100) {
        bernoulli = 99.99;
    }

    //Calcalates the fractional odds.
    var fractionalOdd = 1 / ((1 / numberOfSpecies * 1 / (numberOfVillager - numberOwned) * 100) / 100);

    //Check if the percent is positive and not equal to 0. Which would mean that the number of villager entered is greater than the number within the species.
    if (Math.sign(percent) !== -1 && Math.sign(percent) !== 0 && isFinite(percent)) {
        result.innerHTML = "당신이 게임 플레이를 하며 <b> "+selectedSpecies +"</b>" + " 종 한 마리를 만날 확률은 <b>" + percent + "%</b> (<b>1:" + Math.round(fractionalOdd) + "</b>) 입니다. <br><br>마일 티켓 하나 당 <b>" + (1/numberOfSpecies * 100).toFixed(decimalPlaces) + "%</b>  (<b>1:" + numberOfSpecies + "</b>) 확률을 가지고 있습니다.  <b></b>";
        currentFormula.innerHTML = "<br><br>현재 공식: 1/" + numberOfSpecies + " * 1/(" + numberOfVillager + "-" + numberOwned + ")"; 

        //Check if the entered number of NMT is greater than 1. Otherwise the result would be the same as the line above.
        if (Math.sign(nmtNumber) !== -1 && Math.sign(nmtNumber) !== 0 && nmtNumber !== 1 && !isNaN(nmtNumber)) {
            result.innerHTML += "<br><br>마일 티켓 <b>"+nmtNumber+"</b>개를 쓸 것이라면, 해당 주민을 만날 확률은<b>" + bernoulli + "%</b> 입니다. ";
        }
    } else {
        result.innerHTML = "입력한 수가 해당 종 수보다 많습니다. ";
        currentFormula.innerHTML = "";
    }

    updateChart(nmtNumber, numberOfSpecies, numberOwned, decimalPlaces, numberOfVillager);
    
}

function updateChart(nmtNumber, numberOfSpecies, numberOwned, decimalPlaces,  numberOfVillager) {
    var probArray = [];
    var labelArray = [];
    if(nmtNumber < 1000) {
        for (let index = 0; index <= nmtNumber; index++) {
            probArray.push((100 - Math.pow((100 - (1 / numberOfSpecies * 1 / (numberOfVillager - numberOwned) * 100)) / 100, index) * 100).toFixed(decimalPlaces))
            labelArray.push("" + index);
         }
    } else if (nmtNumber < 10000) {
        for (let index = 0; index <= nmtNumber; index+=10) {
            probArray.push((100 - Math.pow((100 - (1 / numberOfSpecies * 1 / (numberOfVillager - numberOwned) * 100)) / 100, index) * 100).toFixed(decimalPlaces))
            labelArray.push("" + index);
         }
    } else if (nmtNumber < 50000){
        for (let index = 0; index <= nmtNumber; index+=100) {
            probArray.push((100 - Math.pow((100 - (1 / numberOfSpecies * 1 / (numberOfVillager - numberOwned) * 100)) / 100, index) * 100).toFixed(decimalPlaces))
            labelArray.push("" + index);
         }
    } else {
        for (let index = 0; index <= nmtNumber; index+=1000) {
            probArray.push((100 - Math.pow((100 - (1 / numberOfSpecies * 1 / (numberOfVillager - numberOwned) * 100)) / 100, index) * 100).toFixed(decimalPlaces))
            labelArray.push("" + index);
         }
    }
    myChart.data.datasets[0].data = probArray;
    myChart.data.labels = labelArray;
    myChart.update();
}
