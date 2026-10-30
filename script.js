import {
    getJSONData,
    modLoop,
    getParagraphDiv,
    createImage,
    genElem,
    genLink,
    randomInRange
} from './generic-functions.js';

document.addEventListener("DOMContentLoaded", () => {
    const publicURL = "https://pub-d7d467f2fbd74f29bcd6f7f704f242c1.r2.dev";

    let primaryGame = document.getElementById("primary-game");
    let bananaImg = document.getElementsByClassName("banana-img");
    let bananaName = document.getElementById("banana-name");
    let bananaDescription = document.getElementById("banana-description");
    let punContainer = document.getElementById("pun-container");
    let bananaScore = document.getElementById("banana-score");
    let primaryBanana = document.getElementById("primary-banana");
    let firstHalf = document.getElementById("first-half");
    let secondHalf = document.getElementById("second-half");
    let gamePiece = document.getElementById("game-piece");
    let prevButton = null;

    let game = false;
    let start = 0;
    let leftDistance = 0;
    let bananasData = "";
    let punsData = "";
    let slottedIndex = null;
    let currentDifficulty = 1;
    
    readData().then(() => {
        primaryGame.addEventListener("click", () => {
            if (game) {
                game = false;
            }
            else {
                startGame();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === ' ' || event.key === 'Spacebar') {
                event.preventDefault();
                if (game == true) {
                    game = false;
                }
                else {
                    startGame();
                }
            }
        });   
        startGame();    
        createDifficultyButtons();    
    });
    
    function createDifficultyButtons() {
        let buttons = {
            1: 1,
            2: 1.2,
            3: 1.6,
            4: 2.0,
            5: 2.4
        };
        let buttonsContainer = document.getElementById("difficulty-buttons");

        for (const [displayCont, internalNum] of Object.entries(buttons)) {
            let button = createDifficultyButton(displayCont, internalNum);
            button.addEventListener("click", () => changeDifficulty(button));
            buttonsContainer.append(button);
        }
        changeDifficulty(buttonsContainer.children[Math.floor(buttonsContainer.children.length / 2)]);
    }
    function createDifficultyButton(displayCont, internalNum) {
        let button = document.createElement("button");
        button.classList.add("diff-button");
        button.value = internalNum;

        let full = document.createElement("span");
        full.classList.add("full");
        full.textContent = "Level " + displayCont;

        let mid = document.createElement("span");
        mid.classList.add("mid");
        mid.textContent = "Lvl " + displayCont;

        let small = document.createElement("span");
        small.classList.add("small");
        small.textContent = displayCont;

        button.append(full, mid, small);

        return button;
    }
    function changeDifficulty(button) {
        if (!game) return;
        if (prevButton) {
            prevButton.classList.remove("selected");
        }
        button.classList.add("selected");
        prevButton = button;
        currentDifficulty = button.value;
        start = 0;
    }

    async function readData() {
        bananasData = await getJSONData("./assets/data-files/bananas.json");
        punsData = await getJSONData("./assets/data-files/puns.json");
    }

    async function addBananaInfo() {
        if (slottedIndex == null) slottedIndex = randomInRange(0, bananasData.length-1);
        
        let bananaData = bananasData[slottedIndex];
        bananaName.textContent = bananaData["title"] + ":";
        let imgURL = publicURL + bananaData["link"];
        for (const img of bananaImg) {
            img.src = imgURL;
            img.alt = bananaData["desc"];
        }
        bananaDescription.textContent = bananaData["desc"];

        let nextInd = randomInRange(0, bananasData.length-1);
        while (nextInd == slottedIndex){
            nextInd = randomInRange(0, bananasData.length-1);
        }
        createImage(publicURL + bananasData[nextInd]["link"]);
        slottedIndex = nextInd;

    }

    async function addPun() {
        let randomIndex = Math.floor(Math.random() * punsData.length);
        let pun = punsData[randomIndex];
        punContainer.textContent = "\"" + pun + "\"";
    }

    function moveGameComponent(timestamp) {
        if (!game) {
            gameEnd(leftDistance);
            return;
        }

        if (start == 0){
            start= timestamp;
        }
        let elapsed = timestamp - start;
        let time = (elapsed * .1);

        leftDistance = getWaveValue(time);
        gamePiece.style.left = leftDistance + "%";

        requestAnimationFrame(moveGameComponent);
    }
    function gameEnd(leftDistance) {
        if (leftDistance < 50) {
            bananaScore.textContent = (leftDistance * 2).toFixed(2) + "%";
        } else {
            bananaScore.textContent = (100 - ((leftDistance * 2) % 100)).toFixed(2) + "%";
        }

        gameStateStyle(false);

        firstHalf.style.clipPath = `inset(0 ${100 - (leftDistance) % 100}% 0 0)`;
        secondHalf.style.clipPath = `inset(0 0 0 ${(leftDistance) % 100}%)`;
    }
    function startGame() {
        game = true;
        leftDistance = 0;
        start = 0;
        gameStateStyle(true);
        addBananaInfo();
        addPun();
        requestAnimationFrame(moveGameComponent);
    }
    function getWaveValue(x) {
        return -50 * Math.cos(x * currentDifficulty * (Math.PI / 100)) + 50;
    }
    function gameStateStyle(gameRestart) {
        if (gameRestart) {
            primaryBanana.classList.remove("invis");
            firstHalf.classList.add("invis");
            secondHalf.classList.add("invis");
            bananaScore.textContent = "00.00%";
        }
        else {
            primaryBanana.classList.add("invis");
            firstHalf.classList.remove("invis");
            secondHalf.classList.remove("invis");
        }

    }
});