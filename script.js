let score = 0;
let lives = 3;
let mode = "";
let targetLife = 1500;
let timeLeft = 30;
let timer;
let clock;
let playing = false;

let hits = 0;
let misses = 0;

let field = document.getElementById("field");


function startGame(newMode) {
    mode = newMode;
    score = 0;
    lives = 3;
    timeLeft = 30;
    targetLife = 1500;
    hits = 0;
    misses = 0;
    playing = true;

    field.innerHTML = "";
    document.getElementById("menu").style.display = "none";

    if (mode == "time") {
        clock = setInterval(function () {
            timeLeft = timeLeft - 1;
            updateInfo();
            if (timeLeft <= 0) {
                gameOver();
            }
        }, 1000);
    }

    updateInfo();
    newTarget();
}


function updateInfo() {
    document.getElementById("score").innerHTML = score;

    if (mode == "time") {
        document.getElementById("lives").innerHTML = "⏱ " + timeLeft;
    } else {
        document.getElementById("lives").innerHTML = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
    }
}


function newTarget() {
    if (playing == false) {
        return;
    }

    let target = document.createElement("div");
    target.className = "target";

    let x = Math.random() * (600 - 45);
    let y = Math.random() * (400 - 45);
    target.style.left = x + "px";
    target.style.top = y + "px";

    target.onclick = function (event) {
        event.stopPropagation();
        clearTimeout(timer);
        target.remove();

        score = score + 1;
        hits = hits + 1;
        showPoints(x, y);

        if (mode == "speed" && targetLife > 400) {
            targetLife = targetLife - 50;
        }

        updateInfo();
        newTarget();
    };

    field.appendChild(target);

    timer = setTimeout(function () {
        target.remove();
        misses = misses + 1;
        if (mode != "time") {
            loseLife();
        }
        newTarget();
    }, targetLife);
}


function showPoints(x, y) {
    let points = document.createElement("div");
    points.className = "points";
    points.innerHTML = "+1";
    points.style.left = x + "px";
    points.style.top = y + "px";
    field.appendChild(points);

    setTimeout(function () {
        points.remove();
    }, 600);
}


field.onclick = function () {
    if (playing == true) {
        misses = misses + 1;
    }
};


function loseLife() {
    lives = lives - 1;
    updateInfo();

    let livesBox = document.getElementById("lives");
    livesBox.classList.remove("shake");
    void livesBox.offsetWidth;
    livesBox.classList.add("shake");

    if (lives <= 0) {
        gameOver();
    }
}


function gameOver() {
    playing = false;
    clearTimeout(timer);
    clearInterval(clock);

    let title = "GAME OVER";
    if (mode == "time") {
        title = "ВРЕМЯ!";
    }

    field.innerHTML =
        "<div class='message'>" +
        "<h2>" + title + "</h2>" +
        "<p>Твой счёт: " + score + "</p>" +
        "</div>";

    showStats();
    document.getElementById("menu").style.display = "block";
}


function showStats() {
    let accuracy = 0;
    if (hits + misses > 0) {
        accuracy = Math.round(hits / (hits + misses) * 100);
    }

    document.getElementById("statHits").innerHTML = hits;
    document.getElementById("statMisses").innerHTML = misses;
    document.getElementById("statAccuracy").innerHTML = accuracy + "%";
}
