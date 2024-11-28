const ZoneType = Object.freeze({
	EMPTY: Symbol("empty"),
	PLAYER: Symbol("player"),
	POINT: Symbol("point"),
	OBSTACLE: Symbol("obstacle"),
	OTHER: Symbol("other"),
});

const FxType = Object.freeze({
	MOVE: String("move"),
	TELEPORT: String("teleport"),
});

let mainRandom;

class Coordinate {
	x;
	y;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class SoundFx {
	#moveSound;
	#teleportSound;

	constructor() {
		this.#moveSound = new Audio("assets/audio/move.wav");
		this.#moveSound.load();

		this.#teleportSound = new Audio("assets/audio/teleport.wav");
		this.#teleportSound.load();
	}

	play(fx) {
		let a;
		switch (fx) {
			case FxType.MOVE:
				a = this.#moveSound.cloneNode(true);
				a.volume = 0.2;
				a.play();
				break;

			case FxType.TELEPORT:
				a = this.#teleportSound.cloneNode(true);
				a.volume = 0.2;
				a.play();
				break;
		}
	}

	static click() {
		let a = new Audio("assets/audio/click.wav");
		a.volume = 0.2;
		a.play();
	}
}

let sound = new SoundFx();

class Stats {
	static setStepsDisplay(steps) {
		document.getElementById("steps").innerHTML = "Lépések: " + steps;
	}

	static setPointsDisplay(points) {
		document.getElementById("points").innerHTML = "Pontok: " + points + (localStorage.getItem("top") ? "/" + localStorage.getItem("top") : "");
	}

	static setSeedDisplay(seed) {
		document.getElementById("seed").value = seed;
	}
}

class Abilities {
	#randomTeleport;
	player;

	constructor(player) {
		this.player = player;
		this.#randomTeleport = false;
	}

	useRandomTeleport() {
		if (this.player.chosenStartCoordinate && this.player.steps > 0) {
			sound.play(FxType.TELEPORT);
			this.player.movePlayerTo(Math.floor(mainRandom.quick() * 10), Math.floor(mainRandom.quick() * 10));
		}
	}
}

class Guide {
	static showArrows() {
		document.getElementById("guide-image").style.visibility = "visible";
		document.getElementById("guide-text").innerText = "Használd a nyilakat / WASD-t a mozgáshoz.";
	}

	static showGameOver() {
		document.getElementById("guide-image").style.visibility = "hidden";
		document.getElementById("guide-text").innerText = "Elfogytak a lépéseid.";
	}
}

class Zone extends Coordinate {
	#zone;

	constructor(x, y) {
		super();

		this.x = x;
		this.y = y;

		this.#zone = document.getElementById(x + "-" + y);
	}

	setContent(content) {
		this.#zone.innerHTML = content;
		return this;
	}

	getContent() {
		return this.#zone.innerHTML;
	}

	getType() {
		if (this.#zone.style.backgroundImage == "url('./assets/images/player.png')") {
			return ZoneType.PLAYER;
		}

		if (this.#zone.style.backgroundColor == "rgba(17, 17, 17, 0.45)") {
			return ZoneType.POINT;
		}
	}

	setType(type) {
		switch (type) {
			case ZoneType.PLAYER:
				this.#zone.style.backgroundColor = "transparent";
				this.#zone.style.backgroundImage = "url('./assets/images/player.png')";
				this.#zone.style.animation = "jump 0.2s";
				this.setContent("");
				break;
			case ZoneType.POINT:
				this.#zone.style.backgroundImage = "none";
				this.#zone.style.backgroundColor = "rgba(17, 17, 17, 0.45)";
				break;
			case ZoneType.EMPTY:
				this.#zone.style.backgroundColor = "transparent";
				this.#zone.style.backgroundImage = "none";
				this.#zone.style.animation = "";
				this.setContent("");
				break;
		}

		return this;
	}
}

class GameArea extends Coordinate {
	area;
	seed;

	constructor(id) {
		super();
		this.area = document.getElementById(id);
	}

	setSize(x, y) {
		this.x = x;
		this.y = y;
	}

	setSeed(seed) {
		this.seed = seed;
	}

	generateGrid(player) {
		this.area.innerHTML = "";

		for (let i = 0; i < this.y; i++) {
			let row = document.createElement("tr");

			for (let j = 0; j < this.x; j++) {
				let col = document.createElement("td");
				col.id = j + "-" + i;
				col.classList.add("zone");

				col.addEventListener("click", (e) => {
					if (!player.chosenStartCoordinate) {
						Guide.showArrows();

						player.movePlayerTo(parseInt(e.target.id.split("-")[0]), parseInt(e.target.id.split("-")[1]));
						player.chosenStartCoordinate = !player.chosenStartCoordinate;
					}
				});

				row.append(col);
			}

			this.area.append(row);
		}
	}

	generateMap() {
		mainRandom = new Math.seedrandom(this.seed);

		for (let i = 0; i < this.x; i++) {
			for (let j = 0; j < this.y; j++) {
				new Zone(i, j).setType(ZoneType.POINT).setContent(Math.floor(mainRandom.quick() * 7) + 2);
			}
		}
	}
}

class Player extends Coordinate {
	points;
	gameArea;
	chosenStartCoordinate;
	steps;

	constructor(gameArea) {
		super();

		this.x = 0;
		this.y = 0;
		this.points = 0;
		this.gameArea = gameArea;
		this.chosenStartCoordinate = false;
		this.steps = 11;
	}

	movePlayerTo(x, y) {
		if (new Zone(x, y).getType() != ZoneType.OBSTACLE && this.steps > 0) {
			if (this.chosenStartCoordinate) {
				new Zone(this.x, this.y).setType(ZoneType.EMPTY);
			}

			if (new Zone(x, y).getType() == ZoneType.POINT) {
				this.points += parseInt(new Zone(x, y).getContent());
			}

			new Zone(x, y).setType(ZoneType.PLAYER);

			this.x = x;
			this.y = y;

			this.steps--;

			if (this.steps == 0) {
				Guide.showGameOver();
			}
		}

		if (this.steps == 0 && (this.points > parseInt(localStorage.getItem("top")) || localStorage.getItem("top") == null)) {
			localStorage.setItem("top", this.points);
		}

		Stats.setPointsDisplay(this.points);
		Stats.setStepsDisplay(this.steps);
	}

	moveUp() {
		if (this.y > 0 && this.chosenStartCoordinate) {
			if (this.steps > 0 && this.chosenStartCoordinate) sound.play(FxType.MOVE);
			this.movePlayerTo(this.x, this.y - 1);
		}
	}

	moveDown() {
		if (this.y < this.gameArea.y - 1 && this.chosenStartCoordinate) {
			if (this.steps > 0 && this.chosenStartCoordinate) sound.play(FxType.MOVE);
			this.movePlayerTo(this.x, this.y + 1);
		}
	}

	moveLeft() {
		if (this.x > 0 && this.chosenStartCoordinate) {
			if (this.steps > 0 && this.chosenStartCoordinate) sound.play(FxType.MOVE);
			this.movePlayerTo(this.x - 1, this.y);
		}
	}

	moveRight() {
		if (this.x < this.gameArea.x - 1 && this.chosenStartCoordinate) {
			if (this.steps > 0 && this.chosenStartCoordinate) sound.play(FxType.MOVE);
			this.movePlayerTo(this.x + 1, this.y);
		}
	}
}
