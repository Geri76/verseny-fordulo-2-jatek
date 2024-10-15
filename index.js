function randomNumber(min, max) {
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}

const gameArea = new GameArea("game-area");

let player = new Player(gameArea);

window.addEventListener("load", function () {
	let seed;

	if (this.localStorage.getItem("seed") != null) {
		seed = this.localStorage.getItem("seed");
	} else {
		seed = randomNumber(10210, 17520);
	}

	gameArea.setSize(10, 10);
	gameArea.generateGrid(player);

	Stats.setSeedDisplay(seed);
	this.localStorage.setItem("seed", seed);

	gameArea.setSeed(seed);
	gameArea.generateMap();
});

window.addEventListener("keydown", (e) => {
	switch (e.code) {
		case "ArrowUp":
			player.moveUp();
			break;
		case "ArrowDown":
			player.moveDown();
			break;
		case "ArrowLeft":
			player.moveLeft();
			break;
		case "ArrowRight":
			player.moveRight();
			break;
	}
});

document.getElementById("new-seed").addEventListener("click", () => {
	const seed = randomNumber(10210, 17520);
	this.localStorage.setItem("seed", seed);

	document.location.href = document.location.href;
});

document.getElementById("restart").addEventListener("click", () => {
	document.location.href = document.location.href;
});
