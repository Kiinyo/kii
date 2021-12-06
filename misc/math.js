Kii.Math = {
    // Returns a number corresponding to how far along
    // something should be given the type of ease, and
    // the ratio (r) of how far it is. 
    //
    // (r = 0.75 means where it should be 3 seconds 
    // into a 4 second ease)
    //
    // fn (type: Kii.Enums.Ease, r: float) -> float
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
    // Rounds down if positive, up if negative
    //
    // fn (n: float) -> float
    floor: function (n) {
        if (n > 0) {
            Math.floor(n)
        } else {
            Math.ceil(n)
        }
        return n
    },
    // Rounds up if positive, down if negative
    //
    // fn (n: float) -> float
    ceil: function (n) {
        if (n > 0) {
            Math.ceil(n)
        } else {
            Math.floors(n)
        }
        return n
    },
    isInsideArea: function (x, y, objectX, objectY, objectWidth, objectHeight) {
        return ((x >= objectX && x <= objectX + objectWidth) &&
                (y >= objectY && y <= objectY + objectHeight))
    },
    // This submodule covers common vector manipulations
    Vector: {
        // fn (x: float, y: float) -> Vector
        Vector: function (x = 0, y = 0) {
            this.x = x
            this.y = y
        },
        // Takes in a angle (in degrees) and a magnitude and constructs
        // a vector from it.
        // fn (degree: float, magnitude: float) -> Vector
        constructVector: function (degree = 0, magnitude = 0) {
            let x = Math.cos(degree * Math.PI / 180) * magnitude
            let y = Math.sin(degree * Math.PI / 180) * magnitude
            return new Kii.Math.Vector.Vector(x, y)
        },
        // Returns the angle of the vector in degrees (0 to <360)
        // fn ( vector: Vector ) -> float
        getAngle: function (vector = {x: 0, y: 0}) {
            let rawAngle = Math.atan2(Math.abs(vector.y), Math.abs(vector.x)) * 180 / Math.PI

            if (vector.x >= 0) {
                // x is positive
                if (vector.y >= 0) {
                    // y is positive
                    return rawAngle
                } else {
                    // y is negative
                    return 360 - rawAngle
                }
            } else {
                // x is negative
                if (vector.y >= 0) {
                    // y is positive
                    return 180 - rawAngle
                } else {
                    return 180 + rawAngle
                }
            }
        },
        // Returns the magnitude of a vector
        // fn ( vector: Vector ) -> float 
        getMagnitude: function (vector = {x: 0, y: 0}) {
            return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
        },
        // Returns a new vector after applying a rotation
        // fn ( vector: Vector, degree: float) -> Vector
        getRotation: function (vector = { x: 0, y: 0 }, degree = 0) {
            degree += Kii.Math.Vector.getAngle(vector)
            if (degree < 0) {
                // I dunno how % plays with negative numbers
                // not even going to bother with Javascript
                degree = 360 - (degree * -1 % 360)
            }
            let magnitude = Kii.Math.Vector.getMagnitude(vector)

            console.log(degree)

            return Kii.Math.Vector.constructVector(degree, magnitude)
        },
        // Returns a vector that is the sum of all vectors in a given array
        // fn ( vectors: [Vector] ) -> Vector
        sumVectors: function (vectors = [{x: 0, y: 0}]) {
            let x, y = 0

            for (const vector of vectors) {
                x += vector.x
                y += vector.y
            }

            return new Kii.Math.Vector.Vector(x, y)
        }
    },
    // This submodule covers Shapes formed by Vectors
    Shape: {
        // A collection of vectors that define a shape centered around [0,0]
        // fn (vertices: [Vector]) -> Shape
        Shape: function (vertices = [{ x: -5, y: 5 }, { x: 5, y: 0 }, { x: -5, y: -5 }]) {
            this.Vertices = vertices
            this.position = new Kii.Math.Vector.Vector(0, 0)
            this.angle = 0

            // Establishing the smallest circle one can draw around
            // the shape
            this.radius = Kii.Math.Shape.getRadius(this)
            // Establish a bounding box
            this.boundingBox = Kii.Math.Shape.getBoundingBox(this)
        },
        // Returns the top left and bottom right of any shape.
        // fn (shape: Shape) -> [Vector; 2]
        getDiagonal: function (shape) {
            let diagonal = [
                new Kii.Math.Vector.Vector(
                    shape.Vertices[0].x,
                    shape.Vertices[0].y
                    ),
                new Kii.Math.Vector.Vector(
                    shape.Vertices[0].x,
                    shape.Vertices[0].y
                    )
            ]
            for (const vertex of shape.Vertices) {
                // Get the top left bound
                diagonal[0].x = Math.min(diagonal[0].x, vertex.x)
                diagonal[0].y = Math.min(diagonal[0].y, vertex.y)
                // Get the bottom right bound
                diagonal[1].x = Math.max(diagonal[1].x, vertex.x)
                diagonal[1].y = Math.max(diagonal[1].y, vertex.y)
            }

            return diagonal
        },
        // Gets the vertices an axis-aligned bounding box for a given Shape
        // fn (shape: Shape) -> [Vector; 4]
        getBoundingBox: function (shape) {
            let diagonal = Kii.Math.Shape.getDiagonal(shape)
            // For readability
            let x1 = diagonal[0].x
            let y1 = diagonal[0].y
            let x2 = diagonal[1].x
            let y2 = diagonal[1].y

            return [
                new Kii.Math.Vector.Vector(x1, y1),
                new Kii.Math.Vector.Vector(x2, y1),
                new Kii.Math.Vector.Vector(x2, y2),
                new Kii.Math.Vector.Vector(x1, y2)
            ]
        },
        // fn (shape: Shape) -> [width: float, height: float]
        getDimensions: function (shape) {
            return [
                shape.boundingBox[1].x - shape.boundingBox[0].x,
                shape.boundingBox[1].y - shape.boundingBox[0].y
            ]
        }
    }
}