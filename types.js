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
		if (this.#zone.style.backgroundImage == "url('./assets/images/player.png')") return ZoneType.PLAYER;
	}

	setType(type) {
		switch (type) {
			case ZoneType.PLAYER:
				this.#zone.style.backgroundImage = "url('./assets/images/player.png')";
				this.#zone.style.animation = "jump 0.2s";
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
			const zones = document.getElementsByClassName("zone");

			for (let i = 0; i < zones.length; i++) {
				zones[i].style.backgroundImage = "";
				zones[i].style.animation = "";
			}

			new Zone(x, y).setType(ZoneType.PLAYER);

			this.x = x;
			this.y = y;
		}
	}

	moveUp() {
		if (this.y > 0) this.y--;
		this.movePlayerTo(this.x, this.y);
	}

	moveDown() {
		if (this.y < this.#gameArea.y - 1) this.y++;
		this.movePlayerTo(this.x, this.y);
	}

	moveLeft() {
		if (this.x > 0) this.x--;
		this.movePlayerTo(this.x, this.y);
	}

	moveRight() {
		if (this.x < this.#gameArea.x - 1) this.x++;
		this.movePlayerTo(this.x, this.y);
	}
}
