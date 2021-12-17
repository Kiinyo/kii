Kii.Engine.Graphics = function (display) {
    
    this.Display = display;
    this.Context = display.getContext('2d');

    // Clears the screen
    //
    // fn ()
    this.clearScreen = function () {
        this.Context.clearRect(0,0, this.Display.width, this.Display.height);
    }
    // No Anti-Aliasing
    //
    // fn (bool: boolean)
    this.pixelMode = function (bool) {
        this.Context.imageSmoothingEnabled = !bool
    }
    // Loads an image that can be later drawn with
    // the drawImg function
    // fn (src: string, name: string)
    this.loadImg = function (src, name) {
        console.log(`Loading Image "${name}" from "${src}"...`)
        let img = new Image()
        img.src = src
        this.Images[name] = img
        console.log(`"${name}" from "${src}" loaded successfully!`)
    }
    // Draws an image to the screen
    this.drawImg = function (image, x, y, w, h, sx, sy, sw, sh) {
        if (!this.Images[image]) {
            console.log(`ERROR: ${image} isn't a valid image name!`)
            console.log(`For more information, use Kii.Graphics.listImages()`)
            return
        }
        let img = this.Images[`${image}`]
        this.Context.drawImage(img, sx, sy, sw, sh, x, y, w, h)
    }
    // Lists all the loaded images currently
    // fn ()
    this.listImages = function () {
        for (const img in this.Images) {
            console.log(`Image: ${img}`)
        }
    }
    // Loads a font at a given location relative to
    // the index.html file and assigns it a name to
    // be referenced later in the drawText function
    // for instance.
    //
    // fn (fontName: string, fontLocation: string)
    this.loadFont = function (fontName, fontLocation) {
        let font = new FontFace(fontName, `url(${fontLocation})`)
        font.load.then(
            function (loadedFont) {
                document.fonts.add(loadedFont)
            }
        ).catch (
            function (error) {
                console.log(`Couldn't load ${fontName} at '${fontLocation}'`)
                console.log(`Error: ${error}`)
            }
        )
    }
    // This function does a lot, but allows you to draw text
    // to the screen however you'd like.
    //
    // fn (
    //    text: string, 
    //    x: float,
    //    y: float,
    //    size: float, 
    //    font: string, 
    //    color: any valid CanvasRenderingContext2D.fillStyle format,
    //    alignX: AlignX,
    //    alignY: AlignY
    //  )
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
    // Draws text in a defined area, wrapping if needed.
    // Returns any text that could not be displayed.
    //
    // fn (
    //    text: string, 
    //    x: float,
    //    y: float,
    //    width: float,
    //    height: float,
    //    size: float, 
    //    font: string, 
    //    color: any valid CanvasRenderingContext2D.fillStyle format,
    //    alignX: AlignX,
    //    alignY: AlignY
    //  ) -> string
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
            return ""
        }
    }
    // Running this function is a simple way to observe all the current
    // inputs in real time, helpful for debugging
    //
    // fn ()
    this.displayInputInfo = function () {        
        this.drawText("Mouse X: " + Kii.Mouse.x + " Mouse Y: " + Kii.Mouse.y, 10, 16);
        this.drawText("Keys Pressed: " + JSON.stringify(Kii.Keyboard.getPressedKeys()), 10, 32);
        this.drawText("Mouse Buttons Pressed: " + JSON.stringify(Kii.Mouse.getPressedButtons()), 10, 48);
        this.drawText(`Gamepad LS: [${Math.round(Kii.Gamepad.LeftStick.x * 100) / 100}, ${Math.round(Kii.Gamepad.LeftStick.y * 100) / 100} | RS: [${Math.round(Kii.Gamepad.RightStick.x * 100) / 100}, ${Math.round(Kii.Gamepad.RightStick.y * 100) / 100}] | LT: ${Math.round(Kii.Gamepad.LeftTrigger * 100) / 100} | RT: ${Math.round(Kii.Gamepad.RightTrigger * 100) / 100}`, 10, 64);
        this.drawText(`Gamepad Buttons Pressed: ${Kii.Gamepad.getButtonsPressed()}`, 10, 80);
        this.drawText(`Dpad L: ${Kii.Gamepad.Dpad.left} R: ${Kii.Gamepad.Dpad.right} U: ${Kii.Gamepad.Dpad.up} D: ${Kii.Gamepad.Dpad.down}`, 10, 96)
    }
    this.debugVectorOverlay = function () {
        let distance = Math.round(Kii.Math.Vector.getMagnitude({ x: Kii.Mouse.x - 300, y: Kii.Mouse.y - 300 }))
        let spinner = Kii.Math.Vector.getRotation({x: 100, y:0}, distance)
        this.drawLine({ x: 300, y: 300 }, Kii.Mouse, "blue")
        this.drawLine(Kii.Mouse, {x: spinner.x + Kii.Mouse.x, y: spinner.y + Kii.Mouse.y})
        this.drawText(`Angle: ${Math.round(Kii.Math.Vector.getAngle({ x: Kii.Mouse.x - 300, y: Kii.Mouse.y - 300 }))}`, Kii.Mouse.x, Kii.Mouse.y)
        this.drawText(`Distance: ${distance}`, Kii.Mouse.x, Kii.Mouse.y + 16)
    }
    // Vector Graphics!
    this.drawLine = function (p1, p2, color = "Red", width = 1) {
        this.Context.beginPath()
        this.Context.lineWidth = width
        this.Context.strokeStyle = color

        this.Context.moveTo(p1.x, p1.y)
        this.Context.lineTo(p2.x, p2.y)

        this.Context.stroke()
    }
    this.drawVertices = function (vertices, fillColor = "Blue", borderColor = false, borderWidth = 1, closed = true) {
        this.Context.beginPath()
        this.Context.moveTo(vertices[0].x, vertices[0].y)
        for (var v = 1; v < vertices.length; v++) {
            this.Context.lineTo(vertices[v].x, vertices[v].y)
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
