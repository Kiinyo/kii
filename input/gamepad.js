Kii.Gamepad = function (index = 0) {
    this.LeftStick  = {_x: 0, _y: 0},
    this.RightStick = {_x: 0, _y: 0},
    this.LeftTrigger  = 0,
    this.RightTrigger = 0,
    this.Dpad = {_left: false, _right: false, _up: false, _down: false}

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

    this.initialize = function (inputHandling) {
        this.inputEvent = inputHandling || function (event, code) {}
    }

    this.updateSticks = function (gamepad) {
        let newPosition = {
            _x: (Math.abs(gamepad.axes[0]) > this.Deadzone) ? gamepad.axes[0] : 0,
            _y: (Math.abs(gamepad.axes[1]) > this.Deadzone) ? gamepad.axes[1] : 0
        }
        if (newPosition._x != this.LeftStick._x ||
            newPosition._y != this.LeftStick._y) {
            if (this.inputEvent) {
                this.inputEvent("Left Stick Moved", newPosition)
                this.LeftStick = newPosition
            }
        }
        newPosition = {
            _x: (Math.abs(gamepad.axes[3]) > this.Deadzone) ? gamepad.axes[3] : 0,
            _y: (Math.abs(gamepad.axes[4]) > this.Deadzone) ? gamepad.axes[4] : 0
        }
        if (newPosition._x != this.RightStick._x ||
            newPosition._y != this.RightStick._y) {
            if (this.inputEvent) {
                this.inputEvent("Right Stick Moved", newPosition)
                this.RightStick = newPosition
            }
        }
    }
    // I've decided to move from -1 to 1 to 0 to 1 for triggers
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
            if (this.Dpad._left) {
                this.inputEvent("Dpad Released", "Left")
                this.Dpad._left = false
            }
            if (this.Dpad._right) {
                this.inputEvent("Dpad Released", "Right")
                this.Dpad._right = false
            }            
        } else if (gamepad.axes[6] == -1) {
            // Left
            if (!this.Dpad._left) {
                this.inputEvent("Dpad Pressed", "Left")
                this.Dpad._left = true
            }
            if (this.Dpad._right) {
                this.inputEvent("Dpad Released", "Right")
                this.Dpad._right = false
            }
        } else if (gamepad.axes[6] == 1) {
            // Right
            if (this.Dpad._left) {
                this.inputEvent("Dpad Released", "Left")
                this.Dpad._left = false
            }
            if (!this.Dpad._right) {
                this.inputEvent("Dpad Pressed", "Right")
                this.Dpad._right = true
            }
        }

        if (gamepad.axes[7] == 0) {
            // Neutral
            if (this.Dpad._up) {
                this.inputEvent("Dpad Released", "Up")
                this.Dpad._up = false
            }
            if (this.Dpad._down) {
                this.inputEvent("Dpad Released", "Down")
                this.Dpad._down = false
            }
        } else if (gamepad.axes[7] == -1) {
            // Left
            if (!this.Dpad._up) {
                this.inputEvent("Dpad Pressed", "Up")
                this.Dpad._up = true
            }
            if (this.Dpad._down) {
                this.inputEvent("Dpad Released", "Down")
                this.Dpad._down = false
            }
        } else if (gamepad.axes[7] == 1) {
            // Right
            if (this.Dpad._up) {
                this.inputEvent("Dpad Released", "Up")
                this.Dpad._up = false
            }
            if (!this.Dpad._down) {
                this.inputEvent("Dpad Pressed", "Down")
                this.Dpad._down = true
            }
        }
    },
    this.getButtonsPressed = function () {
        let buttons = []
        for (var b = 0; b < 11; b++) {
            if (this.ButtonsPressed[b]) {
                buttons.push(this.ButtonCodes[b])
            }
        }
        return buttons
    }
    this.update = function () {
        let gamepad = navigator.getGamepads()[index]
        this.updateSticks(gamepad)
        this.updateTriggers(gamepad)
        this.updateButtons(gamepad)
        this.updateDpad(gamepad)
    }
}