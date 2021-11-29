Kii.Graphics = function (display, width, height) {

    display.width  = width
    display.height = height
    
    this.Display = display;
    this.Context = display.getContext('2d');

    this.clearScreen = function () {
        this.Context.clearRect(0,0, this.Display.width, this.Display.height);
    }
    // Adds fonts to be used
    this.loadFonts = function (fonts) {
        for (var f = 0; f < fonts.length; f++) {
            let font = new FontFace(fonts[f][0], "url(visual/font/"+fonts[f][1])
            font.load().then(
                function (loadedFont) {
                    document.fonts.add(loadedFont)
                }
            ).catch (
                function (error) {
                    console.log("Couldn't load font file"+ fonts[f][0])
                    console.log("Error: " + error)
                }
            )
        }
    }
    this.drawText = function (text, x, y, size, font, color, alignX, alignY) {
        x = x || 10
        y = y || 10

        font  = font  || "PatrickHand"
        size  = size  || 16
        color = color || "black"

        alignX = alignX || Kii.Enums.AlignX.Left
        alignY = alignY || Kii.Enums.AlignY.Up
        // Set up the font and color
        this.Context.font = `${size}px ${font}`;
        this.Context.fillStyle = color;
        // Set up the X
        switch (alignX) {
            case Kii.Enums.AlignX.Left:
                break
            case Kii.Enums.AlignX.Center:
                x -= Math.floor(this.Context.measureText(text).width / 2 );
                break
            case Kii.Enums.AlignX.Right:
                x -= this.Context.measureText(text).width;
                break;
            default:
                console.log(`Invalid alignX: ${alignX}, defaulting to "${Kii.Enums.AlignX.Left}"`)
                break;
        }
        // Set up the Y
        switch (alignY) {
            case Kii.Enums.AlignY.Up:
                break
            case Kii.Enums.AlignY.Center:
                y -= Math.floor(size / 2 );
                break
            case Kii.Enums.AlignY.Down:
                y -= size;
                break;
            default:
                console.log(`Invalid alignX: ${alignY}, defaulting to "${Kii.Enums.AlignY.Up}"`)
                break;
        }
        // Draw it!
        this.Context.fillText(text, x, y)
    }
    // Draws text in a defined bounding box
    this.drawTextBox = function (text, x, y, width, height, font, size, color, alignX, alignY) {
        x = x || 10
        y = y || 10

        font  = font  || "PatrickHand"
        size  = size  || 16
        color = color || "black"

        alignX = alignX || Kii.Enums.AlignX.Center
        alignY = alignY || Kii.Enums.AlignY.Center

        if (width) {
            // We're wrapping text!
            let maxlines = Math.floor( height / size );
            // Let's see if we can even write lines!
            if (maxlines > 0) {
                // If we can, let's go ahead and create an array
                // to hold all the lines we can write
                let separatedLines = [];

                let index = 0
                for (var i = 0; i < text.length; i++) {
                    // Scan through the string until you find a linebreak
                    if (i + 1 == text.length) {
                        separatedLines.push(text.slice(0, i+1))
                        text = text.slice(i, text.length)
                        break
                    } else if (text[i] == " ") {
                        // Check to see if it's still within the width of the textbox
                        if (this.Context.measureText(text.substr(0, i-1)).width <= width) {
                            // If it is, update the index and keep going
                            index = i;
                        } else {
                                // Let's make sure that this isn't just an enormous word
                                if (index > 0) {
                                    // If it isn't we just crop it properly
                                    separatedLines.push(text.slice(0, index))
                                    // Trim off the space
                                    text = text.slice(index, text.length)
                                } else {
                                    // If it is we'll step back until it's croppable
                                    for (var k = 1; k < i; k++) {
                                        // Check to see if it's finally accessable
                                        if (this.Context.measureText(text.substr(0, i-1-k)).width <= width) {
                                            // if it is, we'll add a hyphen, and continue on
                                            separatedLines.push(text.slice(0, Math.max(i-2-k, 1))+"-")
                                            text = text.slice(i-2-k, text.length)
                                            // Break the loop
                                            k = i
                                        }
                                    }
                                }
                                // Reset the index
                                index = 0
                                // Figure out if we're done here
                                if (separatedLines.length >= maxlines) {
                                    break
                                } else {
                                    i = -1
                                }
                        }                                
                    } else if (text[i] == "|") {
                        separatedLines.push(text.slice(0, i-1))
                        text = text.slice(i, text.length)
                        if (separatedLines.length >= maxlines) {
                            break
                        } else {
                            i = -1
                        }
                    }
                }
                // Now let's draw all the lines!
                let xmod = 0
                let ymod = 0
                let twid = 0
                let thig = 0
                
                for (var j = 0; j < separatedLines.length; j++) {
                    twid = this.Context.measureText(separatedLines[j]).width
                    thig = size * separatedLines.length
                    switch (alignX) {
                        case Kii.Enums.AlignX.Left:
                            xmod = x
                            break;
                        case Kii.Enums.AlignX.Center:
                            xmod = x + Math.floor (width / 2) - Math.floor (twid / 2)
                            break;
                        case Kii.Enums.AlignX.Right:
                            xmod = x + width - twid
                            break;                            
                        default:
                            break;
                    }
                    switch (alignY) {
                        case Kii.Enums.AlignY.Up:
                            ymod = y + (size * (j + 1))
                            break;
                        case Kii.Enums.AlignY.Center:
                            ymod = y + Math.floor (height / 2) - Math.floor (thig / 2) + (size * (j + 1))
                            break;
                        case Kii.Enums.AlignY.Down:
                            ymod = y + height - thig + (size * (j + 1))
                            break;                            
                        default:
                            break;
                    }
                    this.drawText(separatedLines[j], xmod, ymod, size, font, color, "Left", "Up")
                }
                // Finally return any leftovers
                return text
            } else {
                // Well at least we tried!!
                return text
            }
        } else {
            // No wrapping required!
            this.drawText(text, x, y, size, font, color, alignX, alignY)
            return null
        }
    }
    // This shouldn't ever really needed to be used in the forward facing API
    // it's mainly a helper function to power renderContainers
    this.renderElement = function (container, element) {
        // First thing's first, let's establish the physical coordinates
        // of the element on the screen!!

        let [x, y, width, height] = Kii.Math.getElementDimensions(container, element)

        let color = element._bgColor

        // Apply any shaders
        if (element._shader) {
            switch (element._shader) {
                case Kii.Enums.ElementShaders[0]:
                    color = "White"
                    break;        
                default:
                    break;
            }
        }

        this.Context.fillStyle = color

        // Rendering any associated image
        if (element.Mixins["Image"]) {
            // If it does, we'll need to draw it to the screen!
            this.Context.drawImage(element._img, element._imageCropX, element._imageCropY,
                                    element._imageCropWidth, element._imageCropHeight,
                                    x, y, width, height)
                                    

            //if (element._name == "Default's Base") {
            //    console.log( `${element._imageCropX}, ${element._imageCropY}, ${element._imageCropWidth}, ${element._imageCropHeight}, ${x}, ${y}, ${width}, ${height}`)
            //}

            // To-Do: Add crop shapes
        } else {
            // If it doesn't, we'll need to draw its corresponding shape
            // and fill it with correct color

            switch (element._shape) {
                case Kii.Enums.Shapes.Box: 
                    this.Context.fillRect(
                        x, y, width, height
                    )
                    break
                
            }
        }
        // Rendering any associated text
        if (element.Mixins["Text"]) {
            let text = element._currentText

            this.drawTextBox(text, 
                x + Math.floor(width * element._textMarginX),
                y + Math.floor(height * element._textMarginY),
                width - Math.floor(width * (element._textMarginX * 2)),
                height - Math.floor(height * (element._textMarginY * 2)),
                element._textFont, element._textSize, element._fgColor,
                element._textAlignX, element._textAlignY)
        }

    }
    // Throw a Screen's containers into here and it'll do the rest
    this.renderContainers = function (containers) {
        // First we cycle through all the containers
        for (var i = 0; i < containers.length; i++) {
            // Then we assign a container we're currently working with
            let container = containers[i]
            for (var j = 0; j < container.Elements.length; j++) {
                // The element we're currently on
                let element = container.Elements[j];
                // And then render it!
                this.renderElement(container, element);
            }

        }
    }
    this.renderScreen = function (screen) {
        this.renderContainers(screen.Containers);
    }
    this.displayInputInfo = function (inputs) {        
        this.drawText("Mouse X: " + inputs.Mouse._x + " Mouse Y: " + inputs.Mouse._y, 10, 16);
        this.drawText("Keys Pressed: " + JSON.stringify(inputs.Keyboard.returnPressedKeys()), 10, 32);
        this.drawText("Mouse Buttons Pressed: " + JSON.stringify(inputs.Mouse.returnPressedButtons()), 10, 48);
    }    // Vector Graphics!
    this.drawLine = function (x1, y1, x2, y2, color = "Red", width = 1) {
        this.Context.beginPath()
        this.Context.lineWidth = width
        this.Context.strokeStyle = color

        this.Context.moveTo(x1, y1)
        this.Context.lineTo(x2, y2)

        this.Context.stroke()
    }
    this.drawVertices = function (vertices, fillColor = "Blue", borderColor = false, borderWidth = 1, closed = true) {
        this.Context.beginPath()
        this.Context.moveTo(vertices[0][0], vertices[0][1])
        for (var v = 1; v < vertices.length; v++) {
            let [x, y] = vertices[v]
            this.Context.lineTo(x, y)
        }
        if (closed) {
            this.Context.closePath()
        }
        // Fill in the shape
        if (fillColor) {
            this.Context.fillStyle = fillColor
            this.Context.fill()
        }
        // Draw the border over it
        if (borderColor) {
            this.Context.strokeStyle = borderColor
            this.Context.lineWidth = borderWidth
            this.Context.stroke()
        }
    }
}
