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

const gameArea = document.getElementById("game-area");

const gameAreaSize = new Coordinate(10, 10);

let player = new Player();

window.addEventListener("load", function () {
	for (let i = 0; i < gameAreaSize.x; i++) {
		let row = this.document.createElement("tr");

		for (let j = 0; j < gameAreaSize.y; j++) {
			let col = this.document.createElement("td");
			col.id = j + "-" + i;
			col.classList.add("zone");

			row.append(col);
		}

		gameArea.append(row);
	}

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
