Kii.Container = function (template) {
    template = template || {};
    // Basic info
    this._name = template._name || "Default Container Name";
    this._desc = template._desc || "Default container description";
    this._type = template._type || "Default";

    // Spacial information
    this._x = template._x || 140
    this._y = template._y || 470
    this._width = template._width || 1000
    this._height = template._height || 200

    // A list of all the elements that make up the container
    this.Elements = template.Elements || [];

    this.addElement = function (element) {
        // Create the element
        element = new Kii.Element(element)
        // Initialize it
        element.initialize();
        // Add it
        this.Elements.push(element)
    }
    this.removeElement = function (name) {
        let index = this.findElement(name);
        if (index > -1) {
            return this.Elements.splice(index, 1)
        } else {
            console.log("The element name '" + name + "' couldn't be removed because it doesn't exist!")
        }
    }
    this.findElement = function (name) {
        for (var e = 0; e < this.Elements.length; e++) {
            if (this.Elements[e]._name == name) {
                return this.Elements[e]
            }
        }
        console.log("The element name: '" + name + "' you're looking for isn't in the Elements!");
        return -1
    }

    // All animations a container can perform
    // [current timestep, duration,
    //  original value, target value
    //  easing type]
    this._durlate = [0,0,[this._x, this._y],[this._x, this._y], null]
    this._durform = [0,0,[this._width, this._height],[this._width, this._height], null]
    // Moves a container in a direction along the screen
    this.translate = function (targetX, targetY, duration, ease) {
        ease = ease || "Linear"
        targetX = targetX || 0 //this._durlate[3][0];
        targetY = targetY || 0 //this._durlate[3][1];
        duration = duration || 1;
        this._durlate = [0, duration, [this._x, this._y], [targetX, targetY], ease]
    }
    this.transform = function (tWidth, tHeight, duration, ease) {
        ease = ease || "Linear"
        tWidth  = tWidth  || this._durform[3][0];
        tHeight = tHeight || this._durform[3][1];
        this._durform = [0,duration,[this._width, this._height],[tWidth, tHeight], ease]
    }
    this.initialize = function () {
        let temp = this.Elements
        this.Elements = []

        for (var e = 0; e < temp.length; e++) {
            this.addElement(temp[e])
        }
    }
    this.update = function (timestep, audioEngine, graphicsEngine) {
        timestep = timestep || 1;
        // Check if we need to do any translations
        if (this._durlate[4]) {
            // Check to see if the animation is finished
            if (this._durlate[0] === this._durlate[1]) {
                this._x = this._durlate[3][0]
                this._y = this._durlate[3][1]
                this._durlate = [0,0,[this._x, this._y],[this._x, this._y], null]
            } else {
                let ratio = Kii.Math.ease(this._durlate[4], (this._durlate[0] / this._durlate[1]))
                this._x = ((this._durlate[3][0] - this._durlate[2][0]) * ratio) + this._durlate[2][0]
                this._y = ((this._durlate[3][1] - this._durlate[2][1]) * ratio) + this._durlate[2][1]

                this._durlate[0] += timestep;
            }
        }
        if (this._durform[4]) {
            // Check to see if the animation is finished
            if (this._durform[0] === this._durform[1]) {
                this._width = this._durform[3][0]
                this._height = this._durform[3][1]
                this._durform = [0,0,[this._width, this._height],[this._width, this._height], null]
            } else {
                let ratio = Kii.Math.ease(this._durform[4], (this._durform[0] / this._durform[1]))
                this._width = ((this._durform[3][0] - this._durform[2][0]) * ratio) + this._durform[2][0]
                this._height = ((this._durform[3][1] - this._durform[2][1]) * ratio) + this._durform[2][1]

                this._durform[0] += timestep;
            }
        }
        // Update any elements that require it!
        for (const element of this.Elements) {
            if (element.update) {
                element.update(1)
            }
        }
    }

    this.Mixins = {}

    let Mixins = template.Mixins || []

    for (const mixin of Mixins) {
        this.Mixins[mixin['_name']] = true
        if (mixin.initialize) {
            mixin.initialize.call(this, template)
        }
        for (let key in mixin) {
            if (key !== 'initialize' && key !== '_name') {
                this[key] = mixin[key]
            }
        }
    }
}

Kii.ContainerMixins = {
    Background: {
        _name: "Background",

        initialize: function (template) {

            this._name = template._name || "Default"

            this._type = "Background"

            this._x = template._x || 0
            this._y = template._y || 0

            this._width  = template._width  || 1280
            this._height = template._height || 720

            this.Elements = template.Elements || [
                // The image
                {
                    _name: `${this._name} Background`,
                    _desc: `${this._desc}`,
                    _type: `Background`,

                    _width:  this._width,
                    _height: this._height,

                    _imgsrc: `${this._name}`,

                    Mixins: [Kii.ElementMixins.Image]
                }
            ]
        }

    },
    Sprite: {
        _name: "Sprite",

        initialize: function (template) {

            this._expression = template._expression || "Default"

            this._type = "Sprite"

            this._x = template._x || 120,
            this._y = template._y || 20

            this._width  = template._width  || 475
            this._height = template._height || 700

            this.Elements = template.Elements || [
                // Base
                {
                    _owner: `${this._name}`,

                    _name: `${this._name}'s Base`,
                    _desc: `Current base for ${this._name}`,
                    _type: "Sprite Base",

                    _relative: true,
                    _width: 1,
                    _height: 1,

                    _imageCropHeight: this._height,
                    _imageCropWidth: this._width,

                    Mixins: [Kii.ElementMixins.Image]
                },
                // Expression
                {
                    _owner: `${this._name}`,
                    _expression: this._expression,

                    _name: `${this._name}'s ${this._expression}`,
                    _desc: `Current expression for ${this._expression}`,
                    _type: "Sprite Expression",

                    _relative: true,
                    _width: 1,
                    _height: 1,

                    _imageCropHeight: this._height,
                    _imageCropWidth: this._width,

                    Mixins: [Kii.ElementMixins.Image]
                }
            ]
        },

        changeExpression: function (name) {
            // Remove the existing expression
            this.removeElement(`${this._name}'s ${this._expression}`)
            // Save the new expression
            this._expression = name
            // Add the new one
            this.addElement( 
                {
                    _owner: `${this._name}`,
                    _expression: this._expression,

                    _name: `${this._name}'s ${this._expression}`,
                    _desc: `Current expression for ${this._expression}`,
                    _type: "Sprite Expression",

                    _relative: true,
                    _width: 1,
                    _height: 1,

                    _imageCropHeight: this._height,
                    _imageCropWidth: this._width,

                    Mixins: [Kii.ElementMixins.Image]
                }
            )
        }
    },
    Textbox: {
        _name: "Textbox",

        initialize: function (template) {

            this._name = template._name || "Default"

            this._width  = template._width  || 1000
            this._height = template._height || 150

            this._type = "Textbox"

            this._x = 140
            this._y = 500

            // Add the voice

            this._voice = template._voice || "Default"
            this._crawl = template._crawl || false
            this._step  = template._step  || 0

            // Visual information
            this._colPri = template._colPri || "White" // Primary color
            this._colSec = template._colSec || "Blue"  // Secondary color
            this._colAcc = template._colAcc || "Red"   // Accent color
            this._colDet = template._colDet || "Black" // Detail color

            this.Elements = template.Elements || [
                // Body
                {
                    _name: `${this._name}'s Body`,
                    _desc: `Current body for ${this._name}`,
                    _type: "Body",

                    _relative: true,
                    _width:  1,
                    _height: 1,

                    _bgColor: this._colPri,
                    _fgColor: this._colDet,

                    _text: this._desc,
                    _voice: "Default Voice",

                    Mixins: [Kii.ElementMixins.Text]
                },
                // Header
                {
                    _name: `${this._name}'s Header`,
                    _desc: `Current header for ${this._name}`,
                    _type: "Header",

                    _relative: true,
                    _width:  0.35,
                    _height: 0.35,

                    _xOffset: 0.08,
                    _xAlign: "Left",

                    _yOffset: 0.175,
                    _yAlign: "Above",

                    _bgColor: this._colSec,
                    _fgColor: this._colDet,

                    _text: this._name,
                    _textAlignX: "Left",

                    Mixins: [Kii.ElementMixins.Clickable, Kii.ElementMixins.Text]
                }
            ]
        },

        changeHeader: function (text, crawl) {
            let index = this.findElement(`${this._name}'s Header`)

            console.log(this.Elements)

            let current = (crawl) ? "" : text
            this.Elements[index].changeText(text, current)
        },

        changeBody: function (text, crawl) {
            let index = this.findElement(`${this._name}'s Body`)

            this._crawl = crawl

            if (crawl) {
                this._step = 0
            }

            console.log(this.Elements[index])

            let current = (crawl) ? "" : text
            this.Elements[index].changeText(text, current)
        },

        changeVoice: function (voice) {
            this._voice = voice
        },

        playVoice: function (audioEngine) {
            audioEngine.play(`Voices/${this._voice}.wav`)
        },

        resetCrawl: function () {
            let index = this.findElement(`${this._name}'s Body`)
            let box = this.Elements[index]
        
            this._crawl = true
            this._step  = 0
            box._currentText = ""
        },

        endCrawl: function () {
            let index = this.findElement(`${this._name}'s Body`)
            let box = this.Elements[index]
        
            this._crawl = false
            this._step  = 0
            box._currentText = box._text
        },

        update: function (timestep, graphicsEngine, audioEngine) {
            timestep = timestep || 1;
            // Check if we need to crawl Text
            if (this._crawl) {
                let index = this.findElement(`${this._name}'s Body`)
                let box = this.Elements[index]
                let length = box._text.length

                if (length > this._step) {
                    box._currentText = box._text.substr(0, this._step)
                    this.playVoice(audioEngine)
                    this._step += 1
                } else {
                    this.endCrawl()
                }
            }
            // Check if we need to do any translations
            if (this._durlate[4]) {
                // Check to see if the animation is finished
                if (this._durlate[0] === this._durlate[1]) {
                    this._x = this._durlate[3][0]
                    this._y = this._durlate[3][1]
                    this._durlate = [0,0,[this._x, this._y],[this._x, this._y], null]
                } else {
                    let ratio = Kii.Math.ease(this._durlate[4], (this._durlate[0] / this._durlate[1]))
                    this._x = ((this._durlate[3][0] - this._durlate[2][0]) * ratio) + this._durlate[2][0]
                    this._y = ((this._durlate[3][1] - this._durlate[2][1]) * ratio) + this._durlate[2][1]

                    this._durlate[0] += timestep;
                }
            }
            if (this._durform[4]) {
                // Check to see if the animation is finished
                if (this._durform[0] === this._durform[1]) {
                    this._width = this._durform[3][0]
                    this._height = this._durform[3][1]
                    this._durform = [0,0,[this._width, this._height],[this._width, this._height], null]
                } else {
                    let ratio = Kii.Math.ease(this._durform[4], (this._durform[0] / this._durform[1]))
                    this._width = ((this._durform[3][0] - this._durform[2][0]) * ratio) + this._durform[2][0]
                    this._height = ((this._durform[3][1] - this._durform[2][1]) * ratio) + this._durform[2][1]

                    this._durform[0] += timestep;
                }
            }
        }
    }
}