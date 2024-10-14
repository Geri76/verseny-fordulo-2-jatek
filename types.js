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

class Zone extends Coordinate {
	#zone;

	constructor(x, y) {
		super();

		this.x = x;
		this.y = y;

		this.#zone = document.getElementById(x + "-" + y);
	}

	getType() {
		switch (this.#zone.style.backgroundImage) {
			case "url('./assets/images/player.png')":
				return ZoneType.PLAYER;
			case "url('./assets/images/coin.png')":
				return ZoneType.POINT;
		}
	}

	setType(type) {
		switch (type) {
			case ZoneType.PLAYER:
				this.#zone.style.backgroundImage = "url('./assets/images/player.png')";
				this.#zone.style.animation = "jump 0.2s";
				break;
			case ZoneType.POINT:
				this.#zone.style.backgroundImage = "url('./assets/images/coin.png')";
				break;
			case ZoneType.EMPTY:
				this.#zone.style.backgroundImage = "none";
				this.#zone.style.animation = "";
				break;
		}
	}
}

class GameArea extends Coordinate {
	area;

	constructor(id) {
		super();
		this.area = document.getElementById(id);
	}

	setSize(x, y) {
		this.x = x;
		this.y = y;
	}

	generateGrid() {
		this.area.innerHTML = "";

		for (let i = 0; i < this.y; i++) {
			let row = document.createElement("tr");

			for (let j = 0; j < this.x; j++) {
				let col = document.createElement("td");
				col.id = j + "-" + i;
				col.classList.add("zone");

				row.append(col);
			}

			this.area.append(row);
		}
	}

	generateMap(seed) {
		var myrng = new Math.seedrandom(seed);

		for (let i = 0; i < 5; i++) {
			let min = 2;
			let max = 8;

			new Zone(randomNumber(1, 5), randomNumber(1, 5)).setType(ZoneType.POINT);

			let pointAmount = Math.floor(myrng.quick() * (max + 1 - min)) + min;
		}
	}
}

class Player extends Coordinate {
	#points;
	#gameArea;

	constructor(gameArea) {
		super();

		this.x = 0;
		this.y = 0;
		this.#points = 0;
		this.#gameArea = gameArea;
	}

	movePlayerTo(x, y) {
		if (new Zone(x, y).getType() != ZoneType.OBSTACLE) {
			new Zone(this.x, this.y).setType(ZoneType.EMPTY);

			new Zone(x, y).setType(ZoneType.PLAYER);

			this.x = x;
			this.y = y;
		}
	}

	moveUp() {
		if (this.y > 0) this.movePlayerTo(this.x, this.y - 1);
	}

	moveDown() {
		if (this.y < this.#gameArea.y - 1) this.movePlayerTo(this.x, this.y + 1);
	}

	moveLeft() {
		if (this.x > 0) this.movePlayerTo(this.x - 1, this.y);
	}

	moveRight() {
		if (this.x < this.#gameArea.x - 1) this.movePlayerTo(this.x + 1, this.y);
	}
}
