import { ProjectList } from "./project-list.js";
import { createProject } from "./project.js";
export { AddProjectDialog }


class AddProjectDialog {

    constructor(docObj, projectList, navPanel) {
        this.docObj = docObj;
        this.projectList = projectList;
        this.navPanel = navPanel;
        this.addProjectDialog = docObj.querySelector("#add-project-modal");
        const addBtn = docObj.querySelector("#add-project-modal .button-panel>.add");
        addBtn.addEventListener("click", this.addProject.bind(this));

    }

    show() {
        // TODO may need to reset the color field if user clicks more than once to add a project
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
            this.projectList.add(newProject);
            this.navPanel.addProject(newProject);
        }
    }
}