class Coordinate {
	x;
	y;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

function randomNumber(min, max) {
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}

const gameArea = document.getElementById("game-area");

const gameAreaSize = new Coordinate(10, 10);

let playerCoordinate = new Coordinate(randomNumber(0, 9), randomNumber(0, 9));

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

	selectZone(playerCoordinate.x, playerCoordinate.y);
});

function selectZone(x, y) {
	const zones = document.getElementsByClassName("zone");

	for (let i = 0; i < zones.length; i++) {
		zones[i].style.backgroundImage = "";
		zones[i].style.animation = "";
	}

	const zone = document.getElementById(x + "-" + y);
	zone.style.backgroundImage = "url('./assets/images/player.png')";
	zone.style.animation = "jump 0.2s";
}

window.addEventListener("keydown", (e) => {
	if (e.code == "ArrowUp" && playerCoordinate.y > 0) {
		playerCoordinate.y--;
	}

	if (e.code == "ArrowDown" && playerCoordinate.y < 9) {
		playerCoordinate.y++;
	}

	if (e.code == "ArrowRight" && playerCoordinate.x < 9) {
		playerCoordinate.x++;
	}

	if (e.code == "ArrowLeft" && playerCoordinate.x > 0) {
		playerCoordinate.x--;
	}

	selectZone(playerCoordinate.x, playerCoordinate.y);
});
