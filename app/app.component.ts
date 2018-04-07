import { Component } from "@angular/core";

import * as utils from "utils/utils";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent { 

    doTheGargbageCollection: boolean = true;
    currentPage: string;


    changeGcStatus() {
        this.doTheGargbageCollection = !this.doTheGargbageCollection;

        console.log("change status var gc to " + this.doTheGargbageCollection);
    }

    startGarbageCollection() {
        setTimeout(() => {
            // clear the GC
            console.log("*** startGarbageCollection - doing the GC!");
            utils.GC();
        }, 2000);
    }
}
