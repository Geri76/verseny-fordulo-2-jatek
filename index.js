function randomNumber(min, max) {
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}

const gameArea = new GameArea("game-area");

let player = new Player(gameArea);

window.addEventListener("load", function () {
	gameArea.setSize(10, 10);
	gameArea.generateGrid();

	player.movePlayerTo(randomNumber(0, 9), randomNumber(0, 9));
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
