Kii.Keyboard = function () {
    this.Held = [false],
    this.KeyCodes = [
        "null","null","null","null","null","null","null","null",
        "BackSpace","Tab",
        "null","null","null",
        "Enter",
        "null","null",
        "Shift","Ctrl","Alt","Pause","CapsLock",
        "null","null","null","null","null","null",
        "Escape",
        "null","null","null","null",
        "SpaceBar","PageUp","PageDown","End","Home",
        "Left", "Up", "Right", "Down",
        "null","null","null",
        "PrintScreen","Insert","Delete",
        "null",
        "0","1","2","3","4","5","6","7","8","9",
        "null","null","null","null","null","null","null",
        "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
        "SuperLeft","SuperRight","ContextMenu",
        "null","null",
        "Num0","Num1","Num2","Num3","Num4","Num5","Num6","Num7","Num8","Num9",
        "NumMul","NumAdd","null","NumSub","NumDec","NumDiv",
        "null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null",
        ";","=",",","-",".","/","\`",
        "null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null",
        "[","\\","]","'",
        "null","null","null","null","null",
        ")","!","@","#","$","%","^","&","*","(",
        "null","null","null","null","null","null","null",
        "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
        "null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null",
        ":","+","<","_",">","?","~",
        "null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null",
        "{","|","}","\""
    ],
    // Setting up the keycode array
    this.initialize = function (handleInput) {
        handleInput = handleInput || function () {}
        // Generating the Array because I'm not doing it by hand
        for (var x = 0; x < 405; x++) {
            this.Held.push(false);
        }
        // Passing this to a variable because idk how to do it otherwise
        let self = this
        // Binding HTML5 events to a targetFunction
        var keyInputs = function (keyInput) {
            window.addEventListener(keyInput, function(key) {
                let keyInfo = "null"
                switch (keyInput) {
                    case "keydown":
                        keyInfo = self.press(key.keyCode);
                        handleInput(keyInfo);
                        break
                    case "keyup":
                        keyInfo = self.release(key.keyCode);
                        handleInput(keyInfo);
                        break
                }
            })
        }
        // Mapping inputs
        keyInputs("keydown")
        keyInputs("keyup")
    }
    // Returns the appropriate keyCode based on if shift is pressed
    this.shiftCheck = function (keyCode) {
        // Before anything else, check if Shift is even being held
        if (this.Held[16]) {
            // If so, only return the modified result if it's a key that can be affected by Shift!
            if ((keyCode > 47 && keyCode < 91) || (keyCode > 185 && keyCode < 223)) {
                return keyCode + 180;
            }
        }
        return keyCode;
    }
    // Returns the name of the key that's been pressed.
    this.press = function (keyCode) {
        keyCode = this.shiftCheck(keyCode);
        this.Held[keyCode] = true;
        return ["KeyDown", this.KeyCodes[keyCode]];
    }
    // Returns the name of the key that's been released
    this.release = function (keyCode) {
        this.Held[keyCode] = false;
        if (this.Held[keyCode + 180]) {
            this.Held[keyCode + 180] = false;

            return [["KeyUp"], this.KeyCodes[keyCode + 180]];
        }
        return [["KeyUp"], this.KeyCodes[keyCode]];
    }
    // Returns a boolean depending on if the key is pressed.
    this.checkKey = function (key) {
        let index = this.KeyCodes.indexOf(key);
        if (index > -1) {
            return this.Held[keyCode]
        } else {
            console.log ("Check the Keys Enum, the Key name you used doesn't exist!")
            return false;
        }
    }
    // Return an array of all pressed key names
    this.returnPressedKeys = function () {
        let list = [];
        for (var x = 0; x < this.Held.length; x++) {
            if (this.Held[x]) {
                list.push(this.KeyCodes[x])
            }
        }
        return list;
    }
}