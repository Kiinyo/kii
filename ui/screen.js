Kii.Screen = function (template) {
    template = template || {};
    this._name = template._name || "Default Screen Name";
    this._desc = template._desc || "Default screen description";

    // Audio
    this.AudioQueue = template.AudioQueue || []

    this.playSFX = function (file) {
        this.AudioQueue.push(`SFX/${file}`)
    }
    this.processAudio = function (audioEngine) {        
        if (this.AudioQueue.length != 0) {
            for (var a = 0; a < this.AudioQueue.length; a++) {
                audioEngine.play(this.AudioQueue[a]);
            }
            this.AudioQueue = [];
        }
    }

    // Visual
    this.render = function (graphicsEngine) {
        graphicsEngine.clearScreen()
        graphicsEngine.renderScreen(this)
    }

    // This is where all the visual elements that
    // make up a Screen are stored, see Kii.Container
    // for more information
    this.Containers = template.Containers || [];
    // Simple solution to assign unique IDs to each container
    this._containerIDs = 0;
    // Something I should separate from the main code
    // Returns the unique ID of the container for later use
    this.addContainer = function (container) {
        // Create the container
        container = new Kii.Container(container);
        // Initialize the container with the current available ID
        container.initialize(this._containerIDs);
        // Increment the ID for the next container
        this._containerIDs += 1;
        // Add the container
        this.Containers.push(container)
        // Return the id
        return (container._id);
    }
    // Loads the containers from template
    this.initializeContainers = function () {
        let temp = this.Containers
        this.Containers = []
        for (var i = 0; i < temp.length; i++) {
            this.addContainer(temp[i]);
        }
    }
    // Returns the index of a container in Containers
    this.findContainer = function (id) {
        for (var x = 0; x < this.Containers.length; x++) {
            if (this.Containers[x]._id == id) {
                return x
            }
        }
        console.log ("The container id: '"+id+"' you're looking for isn't in the Containers!")
        return -1
    }
    this.findContainerByName = function (name) {
        let names = []
        for (var x = 0; x < this.Containers.length; x++) {

            if (this.Containers[x]._name == name) {
                return this.Containers[x]
            }
            names.push(this.Containers[x]._name)
        }
        console.log ("The container name: '"+name+"' you're looking for isn't in the Containers!")
        console.log ("Available containers: " + names)
        return -1
    }
    // Remove a container using its id and returning it in its entirety
    this.removeContainer = function (id) {
        let index = this.findContainer(id);
        if (index > -1) {
            return this.Containers.splice(index, 1);
        } else {
            console.log ("The container id '" + id + "' couldn't be removed because it doesn't exist!!")
        }
    }
    this.updateContainers = function (timestep, graphicsEngine, audioEngine) {
        timestep = timestep || 1;
        for (var c = 0; c < this.Containers.length; c++) {
            this.Containers[c].update(timestep, graphicsEngine, audioEngine)
        }
    }
    this.findElementByName = function (name) {
        for (var c = 0; c < this.Containers.length; c++) {
            let element = this.Containers[c].findElement(name)
            if (element != -1) {
                return element
            }
        }
        console.log(`We couldn't find an element by the name "${name}"!`)
    }
    // Search for an element at x and y, can filter for a specific value
    // using element[filter] = value
    // ie: element[name] == "Default"
    this.elementAt = function (x, y, filter, value) {
        // Cycle backwards through containers
        for (var c = this.Containers.length -1; c >= 0; c--) {
            // Cycle backwards through elements
            for (var e = this.Containers[c].Elements.length - 1 ; e >= 0; e--) {
                if (filter) {
                    console.log(this.Containers[c].Elements[e][filter])
                    if (this.Containers[c].Elements[e][filter] == value) {
                        let [ex, ey, width, height] = Kii.Math.getElementDimensions(
                            this.Containers[c], this.Containers[c].Elements[e]
                        )
                        if (Kii.Math.isInsideArea(x, y, ex, ey, width, height)) {
                            return this.Containers[c].Elements[e]
                        }
                    }
                } else {
                    let [ex, ey, width, height] = Kii.Math.getElementDimensions(
                        this.Containers[c], this.Containers[c].Elements[e]
                    )
                    if (Kii.Math.isInsideArea(x, y, ex, ey, width, height)) {
                        return this.Containers[c].Elements[e]
                    }
                }
            }
        }
        console.log("Nothing to find!")
    }

    // Scripting!
    /*
    this.changeExpression = function (sprite, expression) {
        let index = this.findContainerByName(sprite, "Sprite")
        this.Containers[index].changeExpression(expression)
    }
    this.moveSprite = function (sprite, x, y, duration, ease) {
        let index = this.findContainerByName(sprite, "Sprite")

        duration = duration || 0
        ease     = ease     || "Linear"
        
        this.Containers[index].translate(x, y, duration, ease)
    }
    // Changing Bodies
    this.changeTextboxBody = function (name, text, crawl) {
        let index = this.findContainerByName(name, "Textbox")

        this.Containers[index].changeBody(text, crawl)
    }
    // Changing Headers
    this.changeTextboxHeader = function (name, text, crawl) {
        let index = this.findContainerByName(name, "Textbox")

        this.Containers[index].changeHeader(text, crawl)
    }
    */
   
    // This is what happens when one enters a screen
    this.enter = template.enter || function () {
        console.log("Entering " + this._name);
    }
    // This is what happens when one exits a screen
    this.exit = template.exit || function () {
        console.log("Exiting " + this._name);
    }
    this.handleInput = template.handleInput || function (input) {
        console.log(`Event: ${input[0]}, Code: ${input[1]}`)
    }
    this.update = template.update || function (timestep, input, audioEngine, graphicsEngine) {
        // Placeholder text
        console.log("Updated the frame but there's nothing here!")
    }

}