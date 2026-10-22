import {
    getJSONData,
    modLoop,
    getParagraphDiv,
    createImage,
    genElem,
    genLink
} from './generic-functions.js';

document.addEventListener("DOMContentLoaded", () => {
    let bananaImg = document.getElementsByClassName("banana-img");
    let bananaName = document.getElementById("banana-name");
    let bananaDescription = document.getElementById("banana-description");
    let punContainer = document.getElementById("pun-container");
    let bananaScore = document.getElementById("banana-score");
    // let resetButton = document.getElementById("reset-button");
    let primaryBanana = document.getElementById("primary-banana");
    let firstHalf = document.getElementById("first-half");
    let secondHalf = document.getElementById("second-half");
    let gamePiece = document.getElementById("game-piece");

    let game;
    let start;
    let leftDistance;
    let bananasData;
    let punsData;
    let slottedIndex = null;

    primaryBanana.addEventListener("click", () => {
        game = false;
    });
    primaryBanana.addEventListener("click", () => {
        game = false;
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'Spacebar') {
            event.preventDefault();
            if (game ==  true){
                game = false;
            }
            else{
                startGame();
            }
        }
    });
    firstHalf.addEventListener("click", startGame);
    secondHalf.addEventListener("click", startGame);

    readData().then(() => {
        startGame();
    });

    async function readData(){
        bananasData = await getJSONData("./assets/data-files/bananas.json");
        punsData = await getJSONData("./assets/data-files/puns.json");
    }

    async function addBananaInfo() {
        if (slottedIndex == null) slottedIndex = Math.floor(Math.random() * bananasData.length);
        let bananaData = bananasData[slottedIndex];

        slottedIndex = Math.floor(Math.random() * bananasData.length);

        // let ind = Math.floor(Math.random() * bananasData.length);
        // while (ind == slottedIndex) {
        //     ind = Math.floor(Math.random() * bananasData.length);
        // }
        // slottedIndex = ind;
        
        bananaName.textContent = bananaData["title"] + ":";
        createImage(bananaData["link"]);

        for (const img of bananaImg) {
            img.src = bananaData["link"];
            img.alt = bananaData["desc"];
        }

        bananaDescription.textContent = bananaData["desc"];
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

        if (start === undefined) {
            start = timestamp;
        }

        let elapsed = timestamp - start;
        let time = (elapsed * .1) % 200;

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
    function startGame(){
        start = undefined;
        gameStateStyle(true);

        game = true;
        leftDistance = 0;
        addBananaInfo();
        addPun();
        moveGameComponent();
    }
    function getWaveValue(x) {
        return -50 * Math.cos(x * (Math.PI / 100)) + 50;
    }
    function gameStateStyle(gameRestart){
        if (gameRestart){
            primaryBanana.classList.remove("invis");
            // resetButton.classList.add("invis");
            firstHalf.classList.add("invis");
            secondHalf.classList.add("invis");  
            bananaScore.textContent = "00.00%";      
        }
        else{
            primaryBanana.classList.add("invis");
            // resetButton.classList.remove("invis");
            firstHalf.classList.remove("invis");
            secondHalf.classList.remove("invis");            
        }

    }
});