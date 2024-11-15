import { ProjectList } from "./project-list.js";
import { createProject } from "./project.js";
export { AddProjectDialog }

class AddProjectDialog {

    constructor(docObj, projects, navPanel) {
        this.docObj = docObj;
        this.projects = projects;
        this.navPanel = navPanel;
        this.addProjectDialog = docObj.querySelector("#add-project-modal");
        const addBtn = docObj.querySelector(".button-panel>.add");
        addBtn.addEventListener("click", this.addProject.bind(this));
    }

    show() {
        this.addProjectDialog.showModal();
    }

    addProject(e) {
        console.log(e);
        console.log(this.docObj);
        const nameEl = this.docObj.querySelector("#proj-name");
        const color = this.docObj.querySelector("#proj-color").value;
        const validityState = nameEl.validity;
        if (validityState.valid) {
            // take the data and tell the project-list object that a new project got added
            // the project object should inform the storage to update itself
            // and the project object should inform the nav to update itself
            const newProject = createProject(nameEl.value, color);
            this.projects.add(newProject);
            this.navPanel.addProject(newProject);
        }
    }
}