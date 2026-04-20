class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.Start);
    }
}
let inventory = [];
let visitedHub = false;

class Location extends Scene {
    create(key){
        let locationData = this.engine.storyData.Locations[key];

        this.engine.output.innerHTML = ""; // clear stuff

        if (key === "hub") {
            if (!visitedHub) {
                this.engine.show(locationData.Body); 
                visitedHub = true;
            } else {
                this.engine.show("You’re back at the Command Hub. The device is still unstable.");
            }
        } else {
            this.engine.show(locationData.Body);
        }

        if(locationData.Item){
            this.engine.show("You obtained: " + locationData.Item);
            inventory.push(locationData.Item);
            locationData.Item = null;

        }
        // if inventory have enough fragment push all_fragment to check later
        if(inventory.includes("fragment_roman") 
            && inventory.includes("fragment_medieval") 
            && inventory.includes("fragment_ww2") ){
                if(!inventory.includes("all_fragments")){
                    inventory.push("all_fragments");
                    this.engine.show("You assembled the time device!");
                }

            }

        

        if(locationData.Choices){
            for (let choice of locationData.Choices){
                //hide complete one
                if (choice.Target === "roman_battle" && inventory.includes("fragment_roman")) continue;
                if (choice.Target === "medieval_battle" && inventory.includes("fragment_medieval")) continue;
                if (choice.Target === "ww2_battle" && inventory.includes("fragment_ww2")) continue;
                
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice){
        if (!choice) return;

        this.engine.show("> " + choice.Text);

if (choice.Action === "console") {
    this.engine.show("You walk over to the console. It’s flickering.");
    this.engine.show("A log flashes: \"Loop detected... subject repeats...\"");
    this.engine.show("So… this wasn’t random.");

    this.engine.addChoice("Back", { back: true });
    return;
}

if (choice.Action === "check_device") {
    this.engine.show("You try to piece the device together...");

    if (!inventory.includes("all_fragments")) {
        this.engine.show("Something’s missing. It doesn’t respond.");
        this.engine.addChoice("Back", { back: true });
        return;
    }

    this.engine.show("The device reacts. Reality starts to distort...");
    this.engine.gotoScene(FinalBattle);
    return;
}

        if (choice.back) {
        this.engine.gotoScene(Location, "hub");
        return;
    }

        this.engine.gotoScene(Location, choice.Target);
    }
}
class FinalBattle extends Scene {
    create() {
        this.engine.output.innerHTML = "";

        this.engine.show("You face someone in the hub.");
        this.engine.show("It’s you. Older.");
        this.engine.show("\"I made all of this happen,\" he says.");
        this.engine.show("\"Now you decide.\"");

        this.engine.addChoice("Take control of the timeline", { end: "bad" });
        this.engine.addChoice("Let everything go back to normal", { end: "good" });
    }

    handleChoice(choice){
        this.engine.output.innerHTML = "";
        if (choice.endGame) {
            this.engine.show("Thanks for playing.");
            this.engine.show("You reached the end of Time Fracture.");
            this.engine.addChoice("Restart", { restart: true });
            return;
        }
        if (choice.restart) {
            inventory = [];
            visitedHub = false;
            this.engine.gotoScene(Start);
            return;
        }

        if (choice.end === "good") {
            this.engine.show("You stop everything. The timeline returns to normal.");
        } else {
            this.engine.show("You take control. Everything is now under your command.");
        }

        this.engine.addChoice("The End", { endGame: true });
    }
    
}

Engine.load(Start, "myStory.json");