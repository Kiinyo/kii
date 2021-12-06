Kii.Engine.Gamepad = function (index = 0) {
    this.LeftStick  = {x: 0, y: 0},
    this.RightStick = {x: 0, y: 0},
    this.LeftTrigger  = 0,
    this.RightTrigger = 0,
    this.Dpad = {left: false, right: false, up: false, down: false}
    this.Deadzone = 0.10
    this.index = index
    this.ButtonsPressed = [
        false,
        false,
        false,
        false,

        false,
        false,

        false,
        false,

        false,
        
        false,
        false
    ],
    this.ButtonCodes = [
        "A",
        "B",
        "X",
        "Y",

        "LB",
        "RB",

        "Select",
        "Start",

        null,

        "LS",
        "RS"
    ],
    this.inputEvent = null,
    this.updateSticks = function (gamepad) {
        let newPosition = {
            x: (Math.abs(gamepad.axes[0]) > this.Deadzone) ? gamepad.axes[0] : 0,
            y: (Math.abs(gamepad.axes[1]) > this.Deadzone) ? gamepad.axes[1] : 0
        }
        if (newPosition.x != this.LeftStick.x ||
            newPosition.y != this.LeftStick.y) {
            if (this.inputEvent) {
                this.inputEvent("Left Stick Moved", newPosition)
                this.LeftStick = newPosition
            }
        }
        newPosition = {
            x: (Math.abs(gamepad.axes[3]) > this.Deadzone) ? gamepad.axes[3] : 0,
            y: (Math.abs(gamepad.axes[4]) > this.Deadzone) ? gamepad.axes[4] : 0
        }
        if (newPosition.x != this.RightStick.x ||
            newPosition.y != this.RightStick.y) {
            if (this.inputEvent) {
                this.inputEvent("Right Stick Moved", newPosition)
                this.RightStick = newPosition
            }
        }
    }
    this.updateTriggers = function (gamepad) {
        let newPosition = (gamepad.axes[2] + 1) / 2
        if (newPosition != this.LeftTrigger) {
            this.inputEvent("Left Trigger Moved", newPosition)
            this.LeftTrigger = newPosition
        }
        newPosition = (gamepad.axes[5] + 1) / 2
        if (newPosition != this.RightTrigger) {
            this.inputEvent("Right Trigger Moved", newPosition)
            this.RightTrigger = newPosition
        }
    }
    this.updateButtons = function (gamepad) {
        for (var b = 0; b < 11; b++) {
            if (gamepad.buttons[b].pressed != this.ButtonsPressed[b]) {
                if (gamepad.buttons[b].pressed) {
                    // Then the button was pressed
                    this.inputEvent("Gamepad Button Pressed", this.ButtonCodes[b])
                    this.ButtonsPressed[b] = true
                } else {
                    // Then the button was pressed
                    this.inputEvent("Gamepad Button Released", this.ButtonCodes[b])
                    this.ButtonsPressed[b] = false
                }
            }
        }
    },
    this.updateDpad = function (gamepad) {
        if (gamepad.axes[6] == 0) {
            // Neutral
            if (this.Dpad.left) {
                this.inputEvent("Dpad Released", "Left")
                this.Dpad.left = false
            }
            if (this.Dpad.right) {
                this.inputEvent("Dpad Released", "Right")
                this.Dpad.right = false
            }            
        } else if (gamepad.axes[6] == -1) {
            // Left
            if (!this.Dpad.left) {
                this.inputEvent("Dpad Pressed", "Left")
                this.Dpad.left = true
            }
            if (this.Dpad.right) {
                this.inputEvent("Dpad Released", "Right")
                this.Dpad.right = false
            }
        } else if (gamepad.axes[6] == 1) {
            // Right
            if (this.Dpad.left) {
                this.inputEvent("Dpad Released", "Left")
                this.Dpad.left = false
            }
            if (!this.Dpad.right) {
                this.inputEvent("Dpad Pressed", "Right")
                this.Dpad.right = true
            }
        }

        if (gamepad.axes[7] == 0) {
            // Neutral
            if (this.Dpad.up) {
                this.inputEvent("Dpad Released", "Up")
                this.Dpad.up = false
            }
            if (this.Dpad.down) {
                this.inputEvent("Dpad Released", "Down")
                this.Dpad.down = false
            }
        } else if (gamepad.axes[7] == -1) {
            // Left
            if (!this.Dpad.up) {
                this.inputEvent("Dpad Pressed", "Up")
                this.Dpad.up = true
            }
            if (this.Dpad.down) {
                this.inputEvent("Dpad Released", "Down")
                this.Dpad.down = false
            }
        } else if (gamepad.axes[7] == 1) {
            // Right
            if (this.Dpad.up) {
                this.inputEvent("Dpad Released", "Up")
                this.Dpad.up = false
            }
            if (!this.Dpad.down) {
                this.inputEvent("Dpad Pressed", "Down")
                this.Dpad.down = true
            }
        }
    },
    
    // Initialize the gamepad and optionally give it a
    // a function to call if it detects any changes during
    // it's update function. The inputHandling function will
    // recieve the Event (Kii.Enums.GamepadEvents) and
    // corresponding code such as 0.50 when the player 
    // pulls the Left Trigger halfway, ie: 
    // inputHandling(GamepadEvents.LeftTriggerMove, 0.75)
    //
    // fn (inputHandling: function (Event, Code))
    this.initialize = function (inputHandling) {
        this.inputEvent = inputHandling || function (event, code) {}
    }
    // Gets an array of strings corresponding to
    // Kii.Enums.ButtonCode that denote which buttons
    // have been pressed
    //
    // fn () -> [ButtonCode]
    this.getButtonsPressed = function () {
        let buttons = []
        for (var b = 0; b < 11; b++) {
            if (this.ButtonsPressed[b]) {
                buttons.push(this.ButtonCodes[b])
            }
        }
        return buttons
    }
    // HMTL5 doesn't to my knowledge have gamepad
    // events so you'll have to run this every time
    // you want to see what the gamepad's doing.
    // I've added in update events though so you're
    // still free to use the regular paradigm of
    // listening to events. Just have to run the update
    // yourself.
    this.update = function () {
        let gamepad = navigator.getGamepads()[index]
        if (gamepad) {
            this.updateSticks(gamepad)
            this.updateTriggers(gamepad)
            this.updateButtons(gamepad)
            this.updateDpad(gamepad)
        }
    }
}