
import { createProject } from "./project.js";
export { AddProjectDialog, EditProjectDialog }


class AddProjectDialog {

    constructor(docObj, projectList, containerPanel, addingMode, navPanel) {
        this.docObj = docObj;
        this.navPanel = navPanel;
        this.projectList = projectList;
        this.containerPanel = containerPanel;
        this.projectDialog = this.docObj.querySelector("#add-project-modal");
        //const headerEl = this.docObj.querySelector("#add-project-modal>h1");

        this.addEventHandler = this.addProject.bind(this);
        this.editEventHandler = this.editProject.bind(this);
        const addOrEditBtnParentEl = this.docObj.querySelector("#add-project-modal .button-panel");
        //<button class="add" type="submit">Add</button>
        const addBtn = this.docObj.createElement("button");

        // headerEl.textContent = "Add Project";

        addBtn.setAttribute("type", "submit");
        addBtn.classList.add("add");
        addBtn.textContent = "Add";

        addBtn.addEventListener("click", this.addEventHandler);
        addOrEditBtnParentEl.appendChild(addBtn);

    }

    show() {
        // TODO may need to reset the color field if user clicks more than once to add a project
        this.projectDialog.showModal();
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


class EditProjectDialog {

    constructor(docObj, projectList, containerPanel, addingMode, navPanel) {
        this.docObj = docObj;
        this.navPanel = navPanel;
        this.projectList = projectList;
        this.containerPanel = containerPanel;
        this.projectDialog = this.docObj.querySelector("#edit-project-modal");
        //const headerEl = this.docObj.querySelector("#edit-project-modal>h1");

        this.editEventHandler = this.editProject.bind(this);
        const addOrEditBtnParentEl = this.docObj.querySelector("#edit-project-modal .button-panel");
        //<button class="add" type="submit">Add</button>
        const editBtn = this.docObj.createElement("button");


        // if not adding, then we must be in edit mode
        // get the current project in this case
        this.currentProject = this.projectList.getProj(this.containerPanel.getCurrentProjectId());

        const nameEl = this.docObj.querySelector("#proj-name");
        const color = this.docObj.querySelector("#proj-color");
        nameEl.value = this.currentProject.name;
        color.value = this.currentProject.color;
        //headerEl.textContent = "Edit Project";

        editBtn.setAttribute("type", "submit");
        editBtn.classList.add("save");
        editBtn.textContent = "Save";
        editBtn.addEventListener("click", this.editEventHandler);
        addOrEditBtnParentEl.appendChild(editBtn);

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
}