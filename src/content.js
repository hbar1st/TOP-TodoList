export class ContentPanel {

    constructor(projects, docObj) {
        this.projects = projects;
        this.contentEl = docObj.querySelector("#content-panel");
        this.docObj = docObj;
    }

    refreshDisplay() {

    }

    displayTasks() {
        // should accept some kind of date like whatever today is and get the tasks that are due on that date!??!!
    }

    displayProject(id) {
        const proj = this.projects.find((el) => (el.id === id));
        if (proj) {
            /* const name = this.docObj.createElement("");
             proj.name;
             const 
             this.contentEl.appendChild();*/
        }
    }

    displayAddTaskDialog() {
        console.log("yay, we're gonna add a task! Let's do it!")
    }

}