'use strict';

// This shows the HTML page in "ui.html".
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
let currentSelection = figma.currentPage.selection[0];
figma.on("run", () => {
    generateArtboard();
});
function generateArtboard() {
    if (currentSelection === undefined) {
        figma.notify("Please select at least one Frame first");
        figma.closePlugin();
    }
    else {
        figma.showUI(__html__, { width: 232, height: 400 });
        figma.ui.postMessage({
            value: {
                currentSelectionWidth: currentSelection.width,
                currentSelectionHeight: currentSelection.height,
            }
        });
        figma.ui.onmessage = msg => {
            // One way of distinguishing between different types of messages sent from
            // your HTML page is to use an object with a "type" property like this.
            let noFill = [];
            // Set degrees
            let degrees = [0, 90, -180, -90];
            // Reposition Artboards according to Selection
            function repositionArtboard(container) {
                container.x = currentSelection.x;
                figma.currentPage.selection.forEach(child => {
                    if (child.height + child.y + 50 > container.y) {
                        container.y = child.height + child.y + 50;
                    }
                });
            }
            // Rotate – random 
            function randomDegrees(container) {
                const random = Math.floor(Math.random() * degrees.length);
                // Rotate – Relative Transform
                let angle = degrees[random];
                let theta = angle * (Math.PI / 180);
                // Radians
                let cx = container.x + container.width / 2;
                let cy = container.y + container.height / 2;
                let newx = Math.cos(theta) * container.x + container.y * Math.sin(theta) - cy * Math.sin(theta) - cx * Math.cos(theta) + cx;
                let newy = -Math.sin(theta) * container.x + cx * Math.sin(theta) + container.y * Math.cos(theta) - cy * Math.cos(theta) + cy;
                container.relativeTransform = [[Math.cos(theta), Math.sin(theta), newx],
                    [-Math.sin(theta), Math.cos(theta), newy]];
            }
            if (msg.type === 'create-shapes') {
                if (msg.selectedItem.value === "item2") {
                    // Create auto-layout container 
                    let containerAutoLayout = figma.createFrame();
                    containerAutoLayout.name = "CombinedArtboards";
                    containerAutoLayout.layoutMode = "HORIZONTAL";
                    containerAutoLayout.counterAxisSizingMode = "AUTO";
                    repositionArtboard(containerAutoLayout);
                    for (let j = 0; j < msg.count; j++) {
                        // Create a Container
                        let containerFrame = figma.createFrame();
                        containerFrame.name = "Container";
                        // Select random Artboard
                        function selectArtboard(random) {
                            return Math.floor(Math.random() * random.children.length);
                        }
                        figma.currentPage.selection.forEach((element, index) => {
                            const newArtboard = selectArtboard(element);
                            // Create Rectangle
                            const newRectangle = figma.currentPage.selection[index].children[newArtboard].clone();
                            newRectangle.fills = noFill;
                            containerFrame.appendChild(newRectangle);
                        });
                        containerFrame.children.forEach(element => {
                            element.x = 0;
                            element.y = 0;
                        });
                        containerFrame.resize(containerFrame.children[0].width, containerFrame.children[0].height);
                        containerAutoLayout.appendChild(containerFrame);
                    }
                }
                else {
                    // Create a Container
                    let containerFrame = figma.createFrame();
                    containerFrame.name = "RandomArtboards";
                    repositionArtboard(containerFrame);
                    for (let j = 0; j < msg.count; j++) {
                        for (let i = 0; i < msg.count; i++) {
                            // Select Random Selection
                            let randomSelection = Array.from(Array(figma.currentPage.selection.length).keys());
                            let randomContainer = Math.floor(Math.random() * randomSelection.length);
                            // Create Rectangle
                            const newRectangle = figma.currentPage.selection[randomContainer].clone();
                            // Mutate msg.spacing
                            let distanceY = (j * msg.spacing);
                            let distanceX = (i * msg.spacing);
                            newRectangle.x = distanceX;
                            newRectangle.y = distanceY;
                            if (msg.randomDegrees === true) {
                                randomDegrees(newRectangle);
                                // Add Rectangle to Frame
                                containerFrame.appendChild(newRectangle);
                            }
                            else {
                                // Add Rectangle to Frame
                                containerFrame.appendChild(newRectangle);
                            }
                        }
                    }
                    // recalculate Container Width + Height
                    let containerWidth = 0;
                    containerFrame.children.forEach(child => {
                        containerWidth = containerWidth + child.width / msg.count;
                        console.log(containerWidth);
                    });
                    containerFrame.resize(containerWidth, containerWidth);
                    // Select the new container + Scroll into View 
                    const newSelection = [];
                    newSelection.push(containerFrame);
                    figma.currentPage.selection = newSelection;
                    figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
                }
                // Close Plugin
                figma.closePlugin();
            }
        };
    }
}
//# sourceMappingURL=code.js.map
