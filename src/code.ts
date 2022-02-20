// This shows the HTML page in "ui.html".

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

let currentSelection = figma.currentPage.selection[0]

figma.on("run", () => {
	generateArtboard(currentSelection)
})

function generateArtboard() {
	if (currentSelection === undefined) {
		figma.notify("Please select at least one Frame first")
		figma.closePlugin();
	} else {
		figma.showUI(__html__, { width: 232, height: 400 });

		figma.ui.postMessage({
			value: {
				currentSelectionWidth: currentSelection.width,
				currentSelectionHeight: currentSelection.height,
			}
		})

		figma.ui.onmessage = msg => {
			// One way of distinguishing between different types of messages sent from
			// your HTML page is to use an object with a "type" property like this.

			let noFill = []

			// Set degrees
			let degrees = [0, 90, -180, -90]

			if (msg.type === 'create-shapes') {

				if (msg.selectedItem.value === "item2") {
					let containerFrame2 = figma.createFrame()
					containerFrame2.name = "Container2"
					containerFrame2.x = currentSelection.x + currentSelection.width + 50;
					containerFrame2.y = currentSelection.y + currentSelection.height + 50;
					containerFrame2.layoutMode = "HORIZONTAL"
					containerFrame2.counterAxisSizingMode = "AUTO"
					for (let j = 0; j < msg.count; j++) {

						// Create a Container
						let containerFrame = figma.createFrame()
						containerFrame.name = "Container"
						containerFrame.x = currentSelection.x + currentSelection.width + 50;
						containerFrame.y = currentSelection.y + currentSelection.height + 50;

						// Select random Artboard
						function selectArtboard(random) {
							return Math.floor(Math.random() * random.children.length)
						}
						figma.currentPage.selection.forEach((element, index) => {
							const newArtboard = selectArtboard(element)

							// Create Rectangle
							const newRectangle = figma.currentPage.selection[index].children[newArtboard].clone()
							newRectangle.fills = noFill

							containerFrame.appendChild(newRectangle)
						});

						containerFrame.children.forEach(element => {
							element.x = 0
							element.y = 0
						});
						containerFrame.resize(containerFrame.children[0].width, containerFrame.children[0].height);
						containerFrame2.appendChild(containerFrame)

					}

				} else {


					// Create a Container
					let containerFrame = figma.createFrame()
					containerFrame.name = "Container"
					containerFrame.x = currentSelection.x + currentSelection.width + 50;
					containerFrame.y = currentSelection.y + currentSelection.height + 50;

					for (let j = 0; j < msg.count; j++) {

						for (let i = 0; i < msg.count; i++) {

							// Select Random Selection
							let randomSelection = Array.from(Array(figma.currentPage.selection.length).keys())
							let randomContainer = Math.floor(Math.random() * randomSelection.length)

							// Create Rectangle
							const newRectangle = figma.currentPage.selection[randomContainer].clone()

							// Mutate msg.spacing
							let distanceY = (j * msg.spacing)
							let distanceX = (i * msg.spacing)
							newRectangle.x = distanceX
							newRectangle.y = distanceY

							if (msg.randomDegrees === true) {
								// Rotate – random 
								const random = Math.floor(Math.random() * degrees.length)

								// Rotate – Relative Transform
								let angle = degrees[random]
								let theta = angle * (Math.PI / 180)

								// Radians
								let cx = newRectangle.x + newRectangle.width / 2
								let cy = newRectangle.y + newRectangle.height / 2
								let newx = Math.cos(theta) * newRectangle.x + newRectangle.y * Math.sin(theta) - cy * Math.sin(theta) - cx * Math.cos(theta) + cx
								let newy = - Math.sin(theta) * newRectangle.x + cx * Math.sin(theta) + newRectangle.y * Math.cos(theta) - cy * Math.cos(theta) + cy
								newRectangle.relativeTransform = [[Math.cos(theta), Math.sin(theta), newx],
								[-Math.sin(theta), Math.cos(theta), newy]]

								// Add Rectangle to Frame
								containerFrame.appendChild(newRectangle)
							} else {

								// Add Rectangle to Frame
								containerFrame.appendChild(newRectangle)
							}
						}
					}

					// recalculate Container Width + Height
					let containerWidth = 0
					containerFrame.children.forEach(child => {
						console.log(child)
						let newContainerWidth = child.x + child.width
						if (newContainerWidth > containerWidth) {
							containerWidth = newContainerWidth
						}
					})
					containerFrame.resize(containerWidth, containerWidth);

					// Select the new container + Scroll into View 
					const newSelection = []
					newSelection.push(containerFrame)
					figma.currentPage.selection = newSelection
					figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
				}

				// Close Plugin

				figma.closePlugin();
			};
		}
	}
}