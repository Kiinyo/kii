Kii.Math = {
    ease: function (type, r) {
        switch (type) {
            // Linear
            case Kii.Enums.Ease[0]:
                return r
            // Exponential
            case Kii.Enums.Ease[1]:
                return r === 1 ? r : 1 - Math.pow(2, -10 * x)
            // Elastic
            case Kii.Enums.Ease[2]:
                return r === 0 ? 0 : r === 1 ? 1 : Math.pow(2, -10 * r) * Math.sin((r * 10 - 0.74) * (2 * Math.PI / 3)) + 1;
            default:
                console.log(`Invalid easing type '${type}'! Check Kii.Enums.Ease!`)
                return 1
        }
    },
    getElementDimensions: function (container, element) {
        let width = 0
        let x = 0
        let height = 0
        let y = 0

        // A bit of finagling to set the right values
        if (element._relative)  {
            // Get the width
            width = Math.floor(container._width * element._width)
            // and the height
            height = Math.floor(container._height * element._height)
            // Then the x
            switch (element._xAlign) {
                // Before
                case Kii.Enums.AlignX.Before:
                    x = container._x - width + 
                        Math.floor(element._xOffset * container._width)
                    break;
                // Left
                case Kii.Enums.AlignX.Left:   
                    x = container._x + 
                        Math.floor(element._xOffset * container._width)
                    break;
                // Center
                case Kii.Enums.AlignX.Center:  
                    x = container._x + Math.floor(container._width / 2) - Math.floor (width / 2) +
                        Math.floor(element._xOffset * container._width)              
                    break;
                // Right
                case Kii.Enums.AlignX.Right:    
                    x = container._x + container._width - width +
                        Math.floor(element._xOffset * container._width)             
                    break;
                // After
                case Kii.Enums.AlignX.After:
                    x = container._x + container._width +
                        Math.floor(element._xOffset * container._width)              
                    break;
            
                default:
                    console.log("Invalid Alignment, check the Enums!")
                    break;
            }
            // Finally the y
            switch (element._yAlign) {
                // Above
                case Kii.Enums.AlignY.Above:
                    y = container._y - height + 
                        Math.floor(element._yOffset * container._height)
                    break;
                // Up
                case Kii.Enums.AlignY.Up:   
                    y = container._y + 
                        Math.floor(element._yOffset * container._height)
                    break;
                // Center
                case Kii.Enums.AlignY.Center:
                    y = container._y + Math.floor(container._height / 2) - Math.floor(height / 2) +
                        Math.floor(element._yOffset * container._height)
                    break;
                // Down
                case Kii.Enums.AlignY.Down:    
                    y = container._y + container._height - height +
                        Math.floor(element._yOffset * container._height)             
                    break;
                // Below
                case Kii.Enums.AlignY.Below:
                    y = container._y + container._height +
                        Math.floor(element._yOffset * container._height)              
                    break;
            
                default:
                    console.log("Invalid Alignment, check the Enums!")
                    break;
            }
        } else {
            width = element._width
            height = element._height
            x = element._xOffset
            y = element._yOffset
        }

        return [x, y, width, height]
    },
    isInsideArea: function (x, y, objectX, objectY, objectWidth, objectHeight) {
        return ((x >= objectX && x <= objectX + objectWidth) &&
                (y >= objectY && y <= objectY + objectHeight))
    }
}