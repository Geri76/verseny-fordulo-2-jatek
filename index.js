function getZone(x, y) {
	const zone = document.getElementById(x + "-" + y);

	if (zone.style.backgroundImage == "url('./assets/images/player.png')") {
		return new Zone(x, y, ZoneType.PLAYER);
	} else {
		return new Zone(x, y, ZoneType.OTHER);
	}
}

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
