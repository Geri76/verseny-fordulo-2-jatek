const ZoneType = Object.freeze({
	EMPTY: Symbol("empty"),
	PLAYER: Symbol("player"),
	POINT: Symbol("point"),
	OBSTACLE: Symbol("obstacle"),
	OTHER: Symbol("other"),
});

class Coordinate {
	x;
	y;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Stats {
	static setStepsDisplay(steps) {
		document.getElementById("steps").innerHTML = "Lépések: " + steps;
	}

	static setPointsDisplay(points) {
		document.getElementById("points").innerHTML = "Pontok: " + points;
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

		if (this.#zone.style.backgroundColor == "rgba(17, 17, 17, 0.667)") {
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
				this.#zone.style.backgroundColor = "#111111aa";
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
	#seed;

	constructor(id) {
		super();
		this.area = document.getElementById(id);
	}

	setSize(x, y) {
		this.x = x;
		this.y = y;
	}

	setSeed(seed) {
		this.#seed = seed;
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
		var myrng = new Math.seedrandom(this.#seed);

		for (let i = 0; i < this.x; i++) {
			for (let j = 0; j < this.y; j++) {
				new Zone(i, j).setType(ZoneType.POINT).setContent(Math.floor(myrng.quick() * 7) + 2);
			}
		}
	}
}

class Player extends Coordinate {
	points;
	#gameArea;
	chosenStartCoordinate;
	#steps;

	constructor(gameArea) {
		super();

		this.x = 0;
		this.y = 0;
		this.points = 0;
		this.#gameArea = gameArea;
		this.chosenStartCoordinate = false;
		this.#steps = 10;
	}

	movePlayerTo(x, y) {
		if (new Zone(x, y).getType() != ZoneType.OBSTACLE && this.#steps > 0) {
			if (this.chosenStartCoordinate) {
				new Zone(this.x, this.y).setType(ZoneType.EMPTY);
			}

			if (new Zone(x, y).getType() == ZoneType.POINT) {
				this.points += parseInt(new Zone(x, y).getContent());
			}

			new Zone(x, y).setType(ZoneType.PLAYER);

			this.x = x;
			this.y = y;

			this.#steps--;
		}

		Stats.setPointsDisplay(this.points);
		Stats.setStepsDisplay(this.#steps);
	}

	moveUp() {
		if (this.y > 0 && this.chosenStartCoordinate) this.movePlayerTo(this.x, this.y - 1);
	}

	moveDown() {
		if (this.y < this.#gameArea.y - 1 && this.chosenStartCoordinate) this.movePlayerTo(this.x, this.y + 1);
	}

	moveLeft() {
		if (this.x > 0 && this.chosenStartCoordinate) this.movePlayerTo(this.x - 1, this.y);
	}

	moveRight() {
		if (this.x < this.#gameArea.x - 1 && this.chosenStartCoordinate) this.movePlayerTo(this.x + 1, this.y);
	}
}
