'use strict';

// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 232, height: 208 });
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    let currentSelection = figma.currentPage.selection;
    if (msg.type === 'create-shapes') {
        console.log(msg);
        let degrees = [0, 90, -180, -90];
        // Create a Container
        const containerFrame = figma.createFrame();
        containerFrame.name = "Container";
        containerFrame.x = currentSelection[0].x + currentSelection[0].width + 50;
        containerFrame.y = currentSelection[0].y + currentSelection[0].width + 50;
        containerFrame.resize(msg.count * msg.spacing, msg.count * msg.spacing);
        containerFrame.paddingLeft = msg.spacing;
        for (let j = 0; j < msg.count; j++) {
            for (let i = 0; i < msg.count; i++) {
                // Select Random Selection
                let randomSelection = Array.from(Array(currentSelection.length).keys());
                let randomContainer = Math.floor(Math.random() * randomSelection.length);
                // Create Rectangle
                const newRectangle = figma.currentPage.selection[randomContainer].clone();
                // Mutate msg.spacing
                let distanceY = (j * msg.spacing);
                let distanceX = (i * msg.spacing);
                newRectangle.x = distanceX;
                newRectangle.y = distanceY;
                {
                    // Rotate – random 
                    const random = Math.floor(Math.random() * degrees.length);
                    // Rotate – Relative Transform
                    let angle = degrees[random];
                    let theta = angle * (Math.PI / 180);
                    // Radians
                    let cx = newRectangle.x + newRectangle.width / 2;
                    let cy = newRectangle.y + newRectangle.height / 2;
                    let newx = Math.cos(theta) * newRectangle.x + newRectangle.y * Math.sin(theta) - cy * Math.sin(theta) - cx * Math.cos(theta) + cx;
                    let newy = -Math.sin(theta) * newRectangle.x + cx * Math.sin(theta) + newRectangle.y * Math.cos(theta) - cy * Math.cos(theta) + cy;
                    newRectangle.relativeTransform = [[Math.cos(theta), Math.sin(theta), newx],
                        [-Math.sin(theta), Math.cos(theta), newy]];
                    // Add Rectangle to Frame
                    containerFrame.appendChild(newRectangle);
                }
            }
        }
        /* 		for (let i = 0; i < msg.count; i++) {
        
                    figma.currentPage.appendChild(shape);
                    nodes.push(shape);
                } */
        //		figma.currentPage.selection = containerFrame;
        //		figma.viewport.scrollAndZoomIntoView(containerFrame);
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
};
