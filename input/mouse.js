Kii.Engine.Mouse = function () {
    // Where the mouse is on the canvas
    this.x = 0;
    this.y = 0;
    // This stores information on which buttons are currently pressed
    this.Held = [
        false, false, false
    ]
    this.MouseCodes = [
        "LMB",
        "MMB",
        "RMB"
    ],
    // The location a button was originally pressed at
    this.mouseDownLocation = [
        [0,0],[0,0],[0,0]
    ],
    // Returns an array [x, y] of where the mouse moved to
    this.track = function (mouse) {
        this.x = mouse.offsetX;
        this.y = mouse.offsetY;

        return ["Mouse Move", [this.x, this.y]];
    };
    // Returns the name of the button that's been pressed
    this.press = function (mouse) {
        this.Held[mouse] = true;
        this.mouseDownLocation[mouse] = [this.x, this.y];
        return ["Mouse Press", [this.MouseCodes[mouse], this.x, this.y]];
    }
    // Returns the name of the button that's been released, as well as if it was a click or not
    this.release = function (mouse) {
        this.Held[mouse] = false;
        // Save the mouse coords before wiping them
        let coords = this.mouseDownLocation[mouse]
        // Wipe the previous coords of the mouse down event
        this.mouseDownLocation[mouse] = [0,0]

        if (this.x == coords[0] && this.y == coords[1]) {
            return ["Mouse Click", [this.MouseCodes[mouse], this.x, this.y]];
        } else {
            return ["Mouse Up", [this.MouseCodes[mouse], this.x, this.y]];
        }
    }

    // Returns the corresponding boolean depending on 
    // whether or not the button pressed.
    //
    // fn (buttonName: Kii.Enums.MouseCode) -> boolean
    this.checkButton = function (buttonName) {
        let index = null;
        for (var i = 0; i < this.MouseCodes.length; i++) {
            if (this.MouseCodes[i] == buttonName) {
                index = buttonName;
                break;
            }
        }
        if (index) {
            return this.Held[index];
        }
        console.log("Check the MouseCode Enum, the Button name you used doesn't exist!");
    }
    // Returns a Kii.Math.Vector.Vector of the mouse location
    //
    // fn () -> Vector
    this.getCursorLocation = function () {
        return new Kii.Math.Vector.Vector(this.x, this.y)
    }
    // Return an array of all pressed buttons
    // corresponding to Kii.Enums.MouseCode
    // 
    // fn () -> [MouseCode]
    this.getPressedButtons = function () {
        let list = [];
        for (var x = 0; x < 3; x++) {
            if (this.Held[x]) {
                list.push(this.MouseCodes[x])
            }
        }
        return list;
    }
    // Setting up the mouse
    this.initialize = function (display, handleInput) {
        handleInput = handleInput || function () { }
        // Transfering this because idk how to do it otherwise
        let self = this
        // Binding HTML5 events to the Kii engine
        var mouseInputs = function (mouseInput) {
            display.addEventListener(mouseInput, function(mouse) {
                let mouseInfo = null;
                switch (mouseInput) {
                    case "mousemove": 
                        mouseInfo = self.track(mouse)
                        handleInput(mouseInfo)
                        break
                    case "mousedown": 
                        mouseInfo = self.press(mouse.button);
                        handleInput(mouseInfo)
                        break
                    case "mouseup": 
                        mouseInfo = self.release(mouse.button);
                        handleInput(mouseInfo)
                        break
                    case "contextmenu":
                        mouse.preventDefault()
                        break
                }
            })
        };
        // Assigning event handlers
        mouseInputs("mousemove");
        mouseInputs("mousedown");
        mouseInputs("mouseup");
        mouseInputs("contextmenu");
    }        
}