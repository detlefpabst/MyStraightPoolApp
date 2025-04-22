let turn = 1;
let player1TotalPoints = 0;
let player2TotalPoints = 0;
let foulsPlayer1 = 0;
let foulsPlayer2 = 0;
let highestSeriesPlayer1 = 0;
let highestSeriesPlayer2 = 0;
let player1TurnEnded = false;
let player2TurnEnded = false;
let remainingPointsPlayer1 = 0;
let remainingPointsPlayer2 = 0;
let winnerName = "";
let loserName = "";
let highestPoints = 0;



/* Responsive Navigation Menu */

function toggleMenu() {
    let navLinks = document.getElementById("navLinks");
    if (navLinks.style.display === "flex") {
        navLinks.style.display = "none";
    } else {
        navLinks.style.display = "flex";
    }
}

function closeMenu() {
    let navLinks = document.getElementById("navLinks");
    navLinks.style.display = "none";
}

/* Winner calclation */

function calculateWinner() {
    const targetScore = parseInt(document.getElementById("targetScore").value) || 100;
    const maxTurns = parseInt(document.getElementById("maxTurns").value) || 10;
    let averagePointsPerTurnPlayer1 = player1TotalPoints / (turn - 1);
    let averagePointsPerTurnPlayer2 = player2TotalPoints / (turn - 1);
    if (player1TotalPoints > player2TotalPoints) {
        winnerName = document.getElementById("player1Name").value;
        loserName = document.getElementById("player2Name").value;
        highestPoints = player1TotalPoints;
    } else if (player2TotalPoints > player1TotalPoints) {
        winnerName = document.getElementById("player2Name").value;
        loserName = document.getElementById("player1Name").value;
        highestPoints = player2TotalPoints;
    } else {
        winnerName = "Unentschieden";
        loserName = "Unentschieden";
        highestPoints = player1TotalPoints; // Beide haben die gleiche Punktzahl
    }

    // Speichere die Ergebnisse in localStorage
    localStorage.setItem("winnerName", winnerName);
    localStorage.setItem("loserName", loserName);
    localStorage.setItem("player1AveragePoints", `${document.getElementById("player1Name").value} - Punktedurchschnitt pro Aufnahme: ${averagePointsPerTurnPlayer1.toFixed(2)}`);
    localStorage.setItem("player1HighestSeries", `${document.getElementById("player1Name").value} - Höchstserie an Punkten: ${highestSeriesPlayer1}`);
    localStorage.setItem("player2AveragePoints", `${document.getElementById("player2Name").value} - Punktedurchschnitt pro Aufnahme: ${averagePointsPerTurnPlayer2.toFixed(2)}`);
    localStorage.setItem("player2HighestSeries", `${document.getElementById("player2Name").value} - Höchstserie an Punkten: ${highestSeriesPlayer2}`);

    // Debugging statements
    console.log("Winner:", winnerName);
    console.log("Loser:", loserName);
    console.log("Redirecting to result.html");

    // Weiterleitung zu result.html
    window.location.href = "./result.html";
}

// Button event listener
document.getElementById("calculateButton").addEventListener("click", calculateWinner);


function addPoints(playerId, addPointsId) {
    const playerInput = document.getElementById(playerId);
    const addPointsInput = document.getElementById(addPointsId);
    const inputValue = parseInt(addPointsInput.value) || 0;
    let pointsToAdd = 15 - inputValue;
    if (inputValue === 0) {
        pointsToAdd = 0;
    }
    let currentPoints = parseInt(playerInput.value) || 0;
    let newPoints = currentPoints + pointsToAdd;
    if (playerId === 'player1') {
        highestSeriesPlayer1 = Math.max(highestSeriesPlayer1, newPoints);
        remainingPointsPlayer1 = 15 - newPoints;
    } else {
        highestSeriesPlayer2 = Math.max(highestSeriesPlayer2, newPoints);
        remainingPointsPlayer2 = 15 - newPoints;
    }
    playerInput.value = newPoints;
    addPointsInput.value = 0;
}

// Aufnahme manuell beenden
function endTurn(playerId) {
    const player1Points = parseInt(document.getElementById("player1").value) || 0;
    const player2Points = parseInt(document.getElementById("player2").value) || 0;
    const maxTurns = parseInt(document.getElementById("maxTurns").value) || 10;

    if (playerId === "player1") {
        player1TotalPoints += player1Points;
        player1TurnEnded = true;
        document.getElementById("endTurnPlayer1").disabled = true;
        document.getElementById("endTurnPlayer2").disabled = false;
    } else {
        player2TotalPoints += player2Points;
        player2TurnEnded = true;
        document.getElementById("endTurnPlayer1").disabled = false;
        document.getElementById("endTurnPlayer2").disabled = true;
    }

    if (player1TurnEnded && player2TurnEnded) {
        const tableBody = document.getElementById("scoreTable").getElementsByTagName("tbody")[0];
        const newRow = tableBody.insertRow();
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        cell1.innerHTML = turn;
        cell2.innerHTML = player1TotalPoints;
        cell3.innerHTML = player2TotalPoints;
        turn++;
        player1TurnEnded = false;
        player2TurnEnded = false;
        document.getElementById("player1").value = 0; // Punktefeld zurücksetzen
        document.getElementById("player2").value = 0; // Punktefeld zurücksetzen
        document.getElementById("endTurnPlayer1").disabled = false;
        document.getElementById("endTurnPlayer2").disabled = false;
        document.getElementById("scoreTable").scrollIntoView({ behavior: "smooth" }); // Tabelle fokussieren
    }

    if (turn > maxTurns) {
        alert("Maximale Anzahl an Aufnahmen erreicht!");
        calculateWinner();
    }

    updateHeaders();
}

function registerFoul(playerId) {
    if (playerId === "player1") {
        foulsPlayer1++;
        document.getElementById("foulsPlayer1").innerText = foulsPlayer1;
        subtractPoints(playerId, 1);
        if (foulsPlayer1 === 3) {
            subtractPoints(playerId, 15);
            foulsPlayer1 = 0;
        }
    } else {
        foulsPlayer2++;
        document.getElementById("foulsPlayer2").innerText = foulsPlayer2;
        subtractPoints(playerId, 1);
        if (foulsPlayer2 === 3) {
            subtractPoints(playerId, 15);
            foulsPlayer2 = 0;
        }
    }
}

function subtractPoints(playerId, points) {
    const playerInput = document.getElementById(playerId);
    let currentPoints = parseInt(playerInput.value) || 0;
    let newPoints = currentPoints - points;
    playerInput.value = newPoints;
}
/* Reset Funktions */
function resetGame() {
    turn = 1;
    player1TotalPoints = 0;
    player2TotalPoints = 0;
    foulsPlayer1 = 0;
    foulsPlayer2 = 0;
    highestSeriesPlayer1 = 0;
    highestSeriesPlayer2 = 0;
    player1TurnEnded = false;
    player2TurnEnded = false;
    remainingPointsPlayer1 = 0;
    remainingPointsPlayer2 = 0;
    document.getElementById("player1").value = 0;
    document.getElementById("player2").value = 0;
    document.getElementById("player1AddPoints").value = 0;
    document.getElementById("player2AddPoints").value = 0;
    document.getElementById("foulsPlayer1").innerText = "0";
    document.getElementById("foulsPlayer2").innerText = "0";
    document.getElementById("result").innerText = "";
    document.getElementById("scoreTable").getElementsByTagName("tbody")[0].innerHTML = "";
    document.getElementById("endTurnPlayer1").disabled = false;
    document.getElementById("endTurnPlayer2").disabled = true;
    updateHeaders();
}

function resetFouls(playerId) {
    if (playerId === 'player1') {
        foulsPlayer1 = 0;
        document.getElementById("foulsPlayer1").innerText = foulsPlayer1;
    } else if (playerId === 'player2') {
        foulsPlayer2 = 0;
        document.getElementById("foulsPlayer2").innerText = foulsPlayer2;
    }
    alert(`Fouls von ${playerId === 'player1' ? 'Spieler 1' : 'Spieler 2'} wurden zurückgesetzt.`);
}


function updateHeaders() {
    const player1Name = document.getElementById("player1Name").value;
    const player2Name = document.getElementById("player2Name").value;
    document.getElementById("player1Header").innerText = `${player1Name} Punkte`;
    document.getElementById("player2Header").innerText = `${player2Name} Punkte`;
}

/* Save Results */
function saveResult() {
    const result = {
        player1Name: localStorage.getItem("player1Name"),
        player2Name: localStorage.getItem("player2Name"),
        player1Points: localStorage.getItem("player1Points"),
        player2Points: localStorage.getItem("player2Points"),
        highestSeriesPlayer1: localStorage.getItem("highestSeriesPlayer1"),
        highestSeriesPlayer2: localStorage.getItem("highestSeriesPlayer2"),
        averagePointsPerTurnPlayer1: localStorage.getItem("averagePointsPerTurnPlayer1"),
        averagePointsPerTurnPlayer2: localStorage.getItem("averagePointsPerTurnPlayer2"),
        winner: localStorage.getItem("winnerName")
    };

    const resultText = `
        Ergebnis Straight Pool
        ========================================================================
        Spieler 1: ${result.player1Name}
        Punkte Spieler 1: ${result.player1Points}
        Höchstserie Spieler 1: ${result.highestSeriesPlayer1}
        Durchschnitt Punkte pro Aufnahme Spieler 1: ${result.averagePointsPerTurnPlayer1}
        ========================================================================
        Spieler 2: ${result.player2Name}
        Punkte Spieler 2: ${result.player2Points}
        Höchstserie Spieler 2: ${result.highestSeriesPlayer2}
        Durchschnitt Punkte pro Aufnahme Spieler 2: ${result.averagePointsPerTurnPlayer2}
        ========================================================================
        Glückwunsch!
        Gewinner: ${result.winner}`;

    const blob = new Blob([resultText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'straightpool_result.txt';
    link.click();
    alert('Ergebnis gespeichert und heruntergeladen!');
}

//
function toggleDiv() {
    let div = document.getElementById("playGoal");
    if (div.style.display === "none") {
        div.style.display = "block";
    } else {
        div.style.display = "none";
    }
}

