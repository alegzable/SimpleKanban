const columns = document.querySelectorAll(".column");
const cards = document.querySelectorAll(".card");
const indicator = document.querySelector(".indicator");
const overlay = document.querySelector(".overlay");
let draggedEl = null;

// Card Listeners and setup
for (const card of cards) {
	card.addEventListener("dragstart", dragStartCard);
	card.addEventListener("dragend", dragEndCard);
	card.addEventListener("dragover", dragOverCard);

	card.classList.add("card-" + card.dataset.id);
}

// Indicator Listeners
indicator.addEventListener("drop", dragDropCard);
indicator.addEventListener("dragover", dragOver);

function dragOver(e) {
	e.preventDefault();
}
// Column Listeners
for (const column of columns) {
	column.addEventListener("dragover", dragOver);
	column.addEventListener("dragenter", dragEnterColumn);
	column.addEventListener("dragleave", dragLeaveColumn);
	column.addEventListener("drop", dragDropColumn);
}

// Drag Functions
function dragEnterColumn() {
	if (this === draggedEl.parentNode) {
		return;
	}

	setTimeout(() => {
		this.appendChild(overlay);
		indicator.classList.add("invisible");
		overlay.classList.remove("invisible");
	}, 0);
}

function dragLeaveColumn(e) {
	if (this === draggedEl.parentNode) {
		return;
	}

	overlay.classList.add("invisible");
}

function dragDropColumn() {
	if (this === draggedEl.parentNode) {
		return;
	}

	this.appendChild(draggedEl);
	overlay.classList.add("invisible");
	clearDraggedCard();
}

function dragStartCard() {
	this.classList.add("hold");
	setTimeout(() => {
		this.classList.add("invisible");
	}, 0);
	draggedEl = this;
}

function dragEndCard() {
	clearDraggedCard();
}

function clearDraggedCard() {
	draggedEl.classList.remove("invisible");
	draggedEl.classList.remove("hold");
	indicator.classList.add("invisible");
}

function dragOverCard(e) {
	const isDifferentColumn = getParentId(draggedEl) !== getParentId(this);

	if (draggedEl === null || draggedEl === this || isDifferentColumn) {
		return;
	}

	const yPosition = e.layerY;
	const targetHeight = e.currentTarget.clientHeight;
	const shouldInsertAfter = yPosition > targetHeight / 2;

	if (shouldInsertAfter === true) {
		insertAfter(indicator, this);
	} else {
		this.parentNode.insertBefore(indicator, this);
	}

	indicator.classList.remove("invisible");
}

function dragDropCard() {
	const parentNode = this.parentNode;
	parentNode.replaceChild(draggedEl, indicator);

	clearDraggedCard();
}

function insertAfter(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextElementSibling);
}

function getParentId(card) {
	return card.parentNode.dataset.id;
}
