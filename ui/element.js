Kii.Element = function (template) {
    template = template || {};
    // Basic info
    this._name = template._name || "Default Element Name";
    this._desc = template._desc || "Default element description";
    this._type = template._type || "Default";

    // Assigned by the Container
    this._id = null;
    this._parentID = null;
    this._counter = 0;
    // Spacial information, always relative to the Container it belongs to
    this._relative = template._relative || false // Is the element relative to the Container?
    // Horizontal stuff
    this._width    = template._width    || 500 // This value is always a percentage unless !_relative
    this._xOffset  = template._xOffset  || 0 // This value is always a percentage unless !_relative
    this._xAlign   = template._xAlign   || Kii.Enums.AlignX.Center
    // Vertical stuff
    this._height   = template._height   || 500 // This value is always a percentage unless !_relative
    this._yOffset  = template._yOffset  || 0 // This value is always a percentage unless !_relative
    this._yAlign   = template._yAlign   || Kii.Enums.AlignY.Center

    // Visual information 
    this._shape    = template._shape    || Kii.Enums.Shapes.Box
    this._bgColor  = template._bgColor  || "Blue"
    this._fgColor  = template._fgColor  || "Black"
    this._alpha    = template._alpha    || 255
    // Shaders
    this._shader = template._Shader || null
    this._shTime = template._shTime || 0

    this.initialize = function (id, pid) {
        // Assign id
        this._id = id || 0;
        this._parentID = pid || 0;
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
                this[key] = template[key] || mixin[key]
            }
        }
    }
}

Kii.ElementMixins = {
    Image: {
        _name: "Image",

        initialize: function (template) {
            this._owner  = template._owner
            // Image formatting
            this._img = new Image();

            this._img.src = template._imgsrc || "image/default.png"
                    
            this._imageCropX      = template._imageCropX      || 0
            this._imageCropY      = template._imageCropY      || 0
            this._imageCropWidth  = template._imageCropWidth  || 512
            this._imageCropHeight = template._imageCropHeight || 512
        }
    },
    Text: {
        _name: "Text",

        initialize: function (template) {

            // Whether or not the element has any text to display
            this._text        = template._text || ""
            this._textSize    = template._textSize    || 28
            this._currentText = template._currentText || text
            // Text formatting information
            this._textAlignX  = template._textAlignX  || Kii.Enums.AlignX.Center
            this._textOffsetX = template._textOffsetX || 0
            this._textMarginX = template._textMarginX || 0.05
            this._textAlignY  = template._textAlignY  || Kii.Enums.AlignY.Center
            this._textOffsetY = template._textOffsetY || 0
            this._textMarginY = template._textMarginY || 0.05
        },

        changeText: function (text, current) {
            text = text || ""
            this._text        = text
            this._currentText = current || text
        }
    },
    Clickable: {
        _name: "Clickable",

        initialize: function (template) {
            // Placeholder
        },

        click: function (button) {
            this._text = "I've been clicked by " + button
        }
    }
}