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
    },
    Vertex: {
        // Primarily a helper function, returns the [[x,y],[x1,y1]] of a line through the diagonal
        // of a bounding box around the form from top left to bottom right assuming + is right and down 
        getDiagonal: function (vertices) {
            let diagonal = [
                [vertices[0][0], vertices[0][1]],
                [vertices[0][0], vertices[0][1]]
            ]

            for (var v = 0; v < vertices.length; v++) {
                diagonal[0] = [
                    Math.min(diagonal[0][0], vertices[v][0]),
                    Math.min(diagonal[0][1], vertices[v][1])
                ]
                diagonal[1] = [
                    Math.max(diagonal[1][0], vertices[v][0]),
                    Math.max(diagonal[1][1], vertices[v][1])
                ]
            }
            return diagonal
        },
        // Returns an array of vertices [x, y] that make a box that enclose the form
        getBoundingBox: function (vertices) {
            let diagonal = Kii.Math.Vertex.getDiagonal(vertices)
            // 0-----1
            // |     |
            // 3-----2
            return [
                [diagonal[0][0],diagonal[0][1]],
                [diagonal[1][0],diagonal[0][1]],
                [diagonal[1][0],diagonal[1][1]],
                [diagonal[0][0],diagonal[1][1]]
            ]
        },
        // Returns [width, height] of an array of vertices
        getDimensions: function (vertices) {
            let diagonal = Kii.Math.Vertex.getDiagonal(vertices)
            return [
                diagonal[1][0] - diagonal[0][0],
                diagonal[1][1] - diagonal[0][1]
            ]

        },
        // Returns the [x, y] of the center of a BB around a group of verts
        getCenter: function (vertices) {
            let diagonal = Kii.Math.Vertex.getDiagonal(vertices)

            return [
                diagonal[0][0] + Math.floor((diagonal[1][0] - diagonal[0][0]) / 2),
                diagonal[0][1] + Math.floor((diagonal[1][1] - diagonal[0][1]) / 2),
            ]
        },
        // Returns the length between two points
        calculateDistance: function (x1, y1, x2, y2) {
            return (Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2)))
        },
        // Returns the angle between two points
        calculateAngle: function (x1, y1, x2, y2) {
            let mod = 0
            if (x2 < x1) {
                mod = 180
            } else if (x1 == x2) {
                // let's not divide by zero
                if (y1 == y2) {
                    return 0
                } else if (y1 < y2) {
                    return 90
                } else {
                    return -90
                }
            }
            return Math.round(Math.atan((y2 - y1)/(x2 - x1)) * 180 / Math.PI) + mod
        },
        // Returns [x, y] after it's been moved by an magnitude at a defined angle
        translate: function (x, y, angle, magnitude) {
            let sign = 1
            if (Math.abs(angle % 360) > 90 && Math.abs(angle % 360) < 270) {
                sign = -1
            }
            let o = magnitude * Math.sin(angle * Math.PI / 180)
            let a = Math.sqrt(Math.pow(magnitude, 2) - Math.pow(o, 2))
            return [x + (a * sign), y + o]
        },
        // Returns an array of vertices with the corresponding rotation applied
        rotate: function (vertices, degree, center) {
            degree = degree || 5
            center = center || Kii.Math.Vertex.getCenter(vertices)
            let newVert = []
            for (var v = 0; v < vertices.length; v++) {
                newVert.push([])
                // Figure out how far it is from the center
                let distance = Kii.Math.Vertex.calculateDistance(center[0], center[1], vertices[v][0], vertices[v][1])
                // Figure out it's angle from the center
                let angle = Kii.Math.Vertex.calculateAngle(center[0], center[1], vertices[v][0], vertices[v][1]) + degree
                // Move it based on the angle
                newVert[v] = Kii.Math.Vertex.translate(center[0], center[1], angle, distance)
            }
            return newVert
        }
    }
}