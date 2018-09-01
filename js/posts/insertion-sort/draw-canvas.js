var DrawCanvas = (function() {
	var drawCanvas = function () {
		var canvas = document.getElementById('exp-canvas');
		var ctx = canvas.getContext('2d');
		var paddingTop = 20;
		var paddingLeft = 50;

		/**
		 * init value.
		 */
		this.init = function() {
			var sortValue = [5, 2, 4, 6, 1, 3];

			if (sortValue && sortValue.length > 0) {
				sort(sortValue);
			}
		};

		/**
		 * Sort array.
		 * @param {array} arr
		 */
		function sort(arr) {
			let track = [];
			for (let j = 1; j < arr.length; j++) {
					let val = arr[j];
					let i = j - 1;
					let t = {
						value: [...arr]
					};

					while (i >= 0 && arr[i] > val) {
							arr[i + 1] = arr[i];
							i--;
					}

					arr[i + 1] = val;

					t.newPos = i + 1;
					track.push(t);
			}
			// push value sorted.
			track.push({
				value: arr
			});
			draw(track);
		}

		/**
		 * Draw sort step.
		 * @param {array} track
		 */
		function draw(track) {
			for (let tIndex = 0; tIndex < track.length; tIndex++) {
				let arr = track[tIndex].value;
				let newIndex = track[tIndex].newPos;
				let cellWidth = (canvas.width - 2*paddingLeft) / arr.length;
				let cellHeight = (canvas.height - 2*paddingTop) / track.length;

				ctx.save();
				ctx.translate(paddingLeft, paddingTop);
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';

				for (let i = 0; i < arr.length; i++) {
					let posX = i * cellWidth + cellWidth / 2;
					let posY = tIndex * cellHeight + cellHeight / 2;

					if (tIndex === track.length - 1) {
						drawFinalValue(arr[i], posX, posY);
					} else if (i === tIndex + 1) {
						let newPosX = posX - ((tIndex + 1 - newIndex) * cellWidth) - 35;
						drawTransposeValue(arr[i], posX, posY, newPosX)
					} else {
						drawNormalValue(arr[i], posX, posY);
					}
				}
				ctx.restore();
			}
		}

		/**
		 * Draw normal value.
		 * @param {number} value
		 * @param {number} posX
		 * @param {number} posY
		 */
		function drawNormalValue(value, posX, posY) {
			ctx.font = '27px arial';
			ctx.fillStyle = '#404040';
			ctx.fillText(value, posX, posY);
		}

		/**
		 * Draw transpose value.
		 * @param {number} value
		 * @param {number} posX
		 * @param {number} posY
		 * @param {number} newPosX
		 */
		function drawTransposeValue(value, posX, posY, newPosX) {
			let r = 22;
			let color = '#2bc67f';

			ctx.font = 'bold 27px arial';
			ctx.fillStyle = color;

			ctx.beginPath();
			ctx.strokeStyle = color;
			ctx.arc(posX, posY, r, 0, 2*Math.PI);
			ctx.lineWidth = 3;
			ctx.stroke();

			ctx.moveTo(posX, posY + r);
			ctx.lineTo(posX, posY + r + 10);
			ctx.lineTo(newPosX, posY + r + 10);
			ctx.lineTo(newPosX, posY);
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.lineTo(newPosX - 5, posY + 12);
			ctx.lineTo(newPosX, posY - 5);
			ctx.lineTo(newPosX + 5, posY + 12);
			ctx.fill();

			ctx.fillText(value, posX, posY);
		}

		/**
		 * Draw final sorted.
		 * @param {number} value
		 * @param {number} posX
		 * @param {number} posY
		 */
		function drawFinalValue(value, posX, posY) {
			ctx.font = 'bold 27px arial';
			ctx.fillStyle = '#2bc67f';
			ctx.fillText(value, posX, posY);
		}
	};

	return drawCanvas;
})();

// draw canvas
document.addEventListener('DOMContentLoaded', new DrawCanvas().init);
