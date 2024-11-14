export { ContentPanel }

class ContentPanel {

    constructor(projects, docObj) {
        this.projects = projects;
        this.contentEl = docObj.querySelector("#content-panel");
        this.currProjEl = docObj.querySelector("#content-panel>header span");
        this.currProjNameEl = docObj.querySelector("#content-panel>h1");
        this.taskListEl = docObj.querySelector("#content-panel>ul");
        this.docObj = docObj;
    }

    refreshDisplay() {

    }

    displayTasks = () => {
        // should accept some kind of date like whatever today is and get the tasks that are due on that date!??!!
        // <li><span class="unchecked"><img src="./assets/task.svg" alt=""></span>First Task</li>
    }

    displayProject = (id) => {
        const proj = this.projects.find((el) => (el.id === id));
        if (proj) {
            this.currProjEl.innerText = proj.name;
            this.currProjNameEl.innerText = proj.name;
        }
    }

    displayAddTaskDialog = () => {
        console.log("yay, we're gonna add a task! Let's do it!")
    }

}