var Kii = {
    _author: "Kathrine Lemet",
    _version: 'alpha_1.3.0',
    _description: "Lightweight 2D engine for JS/HTML5",

    Enums: {
        Direction: {
            Down: "Down",
            Up: "Up",
            Left: "Left",
            Right: "Right",
        },
        AlignX: {
            Before: "Before",
            Left: "Left",
            Center: "Center",
            Right: "Right",
            After: "After"
        },
        AlignY: {
            Above: "Above",
            Up: "Up",
            Center: "Center",
            Down: "Down",
            Below: "Below"
        },
        Shapes: {
            Box: "Box",
            Circle: "Circle"
        },
        Ease: {
            Linear: "Linear",
            Exponential: "Exponential",
            Elastic: "Elastic"
        },
        KeyboardEvents: {
            KeyDown: "KeyDown",
            KeyUp: "KeyUp"
        },
        // There are quite a few duplicates for ease of use
        // ie. "." is both Decimal and Period
        KeyCode: {
            // Lowercase
            a: "a",
            b: "b",
            c: "c",
            d: "d",
            e: "e",
            f: "f",
            g: "g",
            h: "h",
            i: "i",
            j: "j",
            k: "k",
            l: "l",
            m: "m",
            n: "n",
            o: "o",
            p: "p",
            q: "q",
            r: "r",
            s: "s",
            t: "t",
            u: "u",
            v: "v",
            w: "w",
            x: "x",
            y: "y",
            z: "z",
            // Uppercase
            A: "A",
            B: "B",
            C: "C",
            D: "D",
            E: "E",
            F: "F",
            G: "G",
            H: "H",
            I: "I",
            J: "J",
            K: "K",
            L: "L",
            M: "M",
            N: "N",
            O: "O",
            P: "P",
            Q: "Q",
            R: "R",
            S: "S",
            T: "T",
            U: "U",
            V: "V",
            W: "W",
            X: "X",
            Y: "Y",
            Z: "Z",
            // Numbers
            Zero:  "0",
            One:   "1",
            Two:   "2",
            Three: "3",
            Four:  "4",
            Five:  "5",
            Six:   "6",
            Seven: "7",
            Eight: "8",
            Nine:  "9",
            // NumPad Numbers
            Num0: "Num0", // 0
            Num1: "Num1", // 1
            Num2: "Num2", // 2
            Num3: "Num3", // 3
            Num4: "Num4", // 4
            Num5: "Num5", // 5
            Num6: "Num6", // 6
            Num7: "Num7", // 7
            Num8: "Num8", // 8
            Num9: "Num9", // 9
            // NumPad Symbols
            NumMul: "NumMul", // *
            NumDiv: "NumDiv", // /
            NumAdd: "NumAdd", // +
            NumSub: "NumSub", // -
            NumDec: "NumDec", // . Decimal

            // Mod keys
            Shift: "Shift",
            Ctrl:  "Ctrl",
            Alt:   "Alt",

            SuperLeft:  "SuperLeft",
            SuperRight: "SuperRight",

            // Nav keys
            ContextMenu: "ContextMenu",

            PageUp:      "PageUp",
            PageDown:    "PageDown",

            Home:        "Home",
            End:         "End",

            Enter:       "Enter",
            Escape:      "Escape",

            Tab:         "Tab",

            Pause:       "Pause",

            // Two different invocations for Arrow Keys
            ArrowUp:    "Up",
            ArrowDown:  "Down",
            ArrowLeft:  "Left",
            ArrowRight: "Right",

            Up:    "Up",
            Down:  "Down",
            Left:  "Left",
            Right: "Right",

            // Text Formatting
            Backspace: "BackSpace",
            CapsLock:  "CapsLock",
            SpaceBar:  "SpaceBar",

            Insert: "Insert",
            Delete: "Delete",

            // Math Symbols
            Plus:     "+",
            Minus:    "-",
            Multiply: "*",
            Divide:   "/",
            Equals:   "=",

            GreaterThan: ">",
            LessThan:    "<",

            Pound:    "#",
            Currency: "$",

            Exponent: "^",

            Decimal:  ".",
            Percent:  "%",
            // Punctuation
            Comma:     ",",        
            Period:    ".",
            Colon:     ":",
            SemiColon: ";",

            HashTag:    "#",
            DollarSign: "$",

            Asterisk:   "*",
            Hyphen:     "-",
            UnderScore: "_",
            Caret:      "^",
            Tilde:      "~",

            ExclamationMark: "!",
            QuestionMark:    "?",

            AndSymbol: "&",
            Ampersand: "&",

            Ampersat: "@",
            AtSymbol: "@",

            // Closures
            ForwardSlash: "/",
            BackSlash:    "\\",

            OpenBracket:  "[", 
            CloseBracket: "]",

            OpenParenthesis:  "(",
            CloseParenthesis: ")",

            OpenBrace:  "{",
            CloseBrace: "}",

            OpenAngleBracket:  "<",
            CloseAngleBracket: ">",

            // Quotations
            Apostrophe: "'",
            QuotationMark: '"',        
            GraveAccent: "`",




        },
        Mouse: {
            Up:   "Mouse Up",
            Down: "Mouse Down",

            Click: "Mouse Click",

            Move: "Mouse Move",

        },
        MouseCode: {
            LMB: "LMB",
            RMB: "RMB",
            MMB: "MMB"
        },
        GamepadEvents: {
            ButtonPress: "Gamepad Button Pressed",
            ButtonRelease: "Gamepad Button Released",

            LeftStickMove: "Left Stick Moved",
            RightStickMove: "Right Stick Moved",

            LeftTriggerMove: "Left Trigger Moved",
            RightTriggerMove: "Right Trigger Moved",

            DpadPress: "Dpad Pressed",
            DpadRelease: "Dpad Released"
        },
        ButtonCode: {
            // For Xbox Controllers
            A: "A",
            B: "B",
            X: "X",
            Y: "Y",
            
            LB: "LB",
            RB: "RB",

            Select: "Select",
            Start:  "Start",

            LS: "LS",
            RS: "RS",
            // For Playstation Controllers
            Cross:    "A",
            Circle:   "B",
            Square:   "X",
            Triangle: "Y",

            L1: "LS",
            R1: "RS",
            
            L3: "LS",
            R3: "RS",

            // Default Values
            _0: "A",
            _1: "B",
            _2: "X",
            _3: "Y",
            _4: "LB",
            _5: "RB",
            _6: "Select",
            _7: "Start",
            _9: "LS",
            _10: "RS"
        }
    },

    initialize: function (fps, updateFunction) {
        Object.freeze(this.Enums)
        // Event Loop
        setInterval(() => {
            updateFunction(1)
        }, 1000 / fps)        
    }

}