
import { createProject } from "./project.js";
export { ProjectDialog }


class ProjectDialog {

    constructor(docObj, projectList, containerPanel, addingMode, navPanel) {
        this.docObj = docObj;
        this.navPanel = navPanel;
        this.projectList = projectList;
        this.containerPanel = containerPanel;
        this.projectDialog = docObj.querySelector("#add-project-modal");
        const headerEl = docObj.querySelector("#add-project-modal>h1");
        const addOrEditBtn = docObj.querySelector("#add-project-modal .button-panel>.add");


        if (addingMode) {
            headerEl.textContent = "Add Project";
            addOrEditBtn.textContent = "Add";

            addOrEditBtn.addEventListener("click", this.addProject.bind(this));
        } else {
            // if not adding, then we must be in edit mode
            // get the current project in this case
            this.currentProject = this.projectList.getProj(this.containerPanel.getCurrentProjectId());

            const nameEl = this.docObj.querySelector("#proj-name");
            const color = this.docObj.querySelector("#proj-color");
            nameEl.value = this.currentProject.name;
            color.value = this.currentProject.color;
            headerEl.textContent = "Edit Project";
            addOrEditBtn.textContent = "Save";
            addOrEditBtn.addEventListener("click", this.editProject.bind(this));
        }
    }

    show() {
        // TODO may need to reset the color field if user clicks more than once to add a project
        this.projectDialog.showModal();
    }

    editProject(e) {
        console.log("Trying to edit a project: ", e);
        const nameEl = this.docObj.querySelector("#proj-name");
        const color = this.docObj.querySelector("#proj-color");
        const validityState = nameEl.validity;
        if (validityState.valid) {
            // take the data and tell the project-list object that a new project got added
            // the project object should inform the storage to update itself
            // and the project object should inform the nav to update itself
            this.currentProject.name = nameEl.value;
            this.currentProject.color = color.value;
            this.navPanel.displayProjects();
            this.containerPanel.displayProject(this.currentProject.id);
            this.projectList.updateStorage();
        }
    }

    addProject(e) {
        console.log("Trying to add a project: ", e);
        const nameEl = this.docObj.querySelector("#proj-name");
        const color = this.docObj.querySelector("#proj-color").value;
        const validityState = nameEl.validity;
        if (validityState.valid) {
            // take the data and tell the project-list object that a new project got added
            // the project object should inform the storage to update itself
            // and the project object should inform the nav to update itself

            const newProject = createProject(nameEl.value, color);
            this.projectList.add(newProject);
            this.containerPanel.addProject(newProject);
        }
    }
}