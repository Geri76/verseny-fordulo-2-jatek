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
	type;

	constructor(x, y, type) {
		super();

		this.x = x;
		this.y = y;
		this.type = type;
	}
}

class Player extends Coordinate {
	#points;

	constructor() {
		super();

		this.x = 0;
		this.y = 0;
		this.point = 0;
	}

	movePlayerTo(x, y) {
		let zone = getZone(x, y);

		if (zone.type != ZoneType.OBSTACLE) {
			const zones = document.getElementsByClassName("zone");

			for (let i = 0; i < zones.length; i++) {
				zones[i].style.backgroundImage = "";
				zones[i].style.animation = "";
			}

			const zone = document.getElementById(x + "-" + y);
			zone.style.backgroundImage = "url('./assets/images/player.png')";
			zone.style.animation = "jump 0.2s";

			this.x = x;
			this.y = y;
		}
	}

	moveUp() {
		if (this.y > 0) this.y--;
		this.movePlayerTo(this.x, this.y);
	}

	moveDown() {
		if (this.y < 9) this.y++;
		this.movePlayerTo(this.x, this.y);
	}

	moveLeft() {
		if (this.x > 0) this.x--;
		this.movePlayerTo(this.x, this.y);
	}

	moveRight() {
		if (this.x < 9) this.x++;
		this.movePlayerTo(this.x, this.y);
	}
}
