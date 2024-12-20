import { createProject } from "./project.js";
export { AddProjectDialog, EditProjectDialog }

class ProjectDialog {
    constructor(docObj, projectList, containerPanel, navPanel) {
        this.docObj = docObj;
        this.navPanel = navPanel;
        this.projectList = projectList;
        this.containerPanel = containerPanel;
    }

    showDialog(projectDialog) {
        projectDialog.showModal();
    }

    getNameEl(parentSelector) {
        return this.docObj.querySelector(`${parentSelector} #proj-name`);
    }

    getColorEl(parentSelector) {
        return this.docObj.querySelector(`${parentSelector} #proj-color`);
    }

    reset(selector) {
        this.getNameEl(selector).value = "";
        this.getColorEl(selector).value = "#ffffff"; //white
    }
}
class AddProjectDialog extends ProjectDialog {

    constructor(docObj, projectList, containerPanel, navPanel) {

        super(docObj, projectList, containerPanel, navPanel);

        this.projectDialog = this.docObj.querySelector("#add-project-modal");
        const addOrEditBtnParentEl = this.docObj.querySelector("#add-project-modal .button-panel");

        this.mySelector = "#add-project-modal";
        const addBtn = this.docObj.createElement("button");
        addBtn.setAttribute("type", "submit");
        addBtn.classList.add("add");
        addBtn.textContent = "Add";

        addBtn.addEventListener("click", this.addProject.bind(this));
        addOrEditBtnParentEl.appendChild(addBtn);
    }

    show() {
        this.reset(this.mySelector);
        this.showDialog(this.projectDialog);
    }

    addProject(e) {
        const nameEl = this.getNameEl(this.mySelector);
        const colorEl = this.getColorEl(this.mySelector);

        const validityState = nameEl.validity;
        if (validityState.valid) {
            const newProject = createProject(nameEl.value, colorEl.value);
            this.projectList.add(newProject);
            this.containerPanel.addProject(newProject);
        }
    }
}


class EditProjectDialog extends ProjectDialog {

    constructor(docObj, projectList, containerPanel, navPanel) {
        super(docObj, projectList, containerPanel, navPanel);
        this.mySelector = "#edit-project-modal";
        this.projectDialog = this.docObj.querySelector(this.mySelector);
        const addOrEditBtnParentEl = this.docObj.querySelector(`${this.mySelector} .button-panel`);

        this.currentProject = projectList.getProj(containerPanel.getCurrentProjectId());
        const editBtn = this.docObj.createElement("button");

        const nameEl = this.getNameEl(this.mySelector);
        const color = this.getColorEl(this.mySelector);
        nameEl.value = this.currentProject.name;
        color.value = this.currentProject.color;

        editBtn.setAttribute("type", "submit");
        editBtn.classList.add("save");
        editBtn.textContent = "Save";
        editBtn.addEventListener("click", this.editProject.bind(this));
        addOrEditBtnParentEl.appendChild(editBtn);
    }

    show() {
        this.showDialog(this.projectDialog);
    }

    editProject(e) {
        const nameEl = this.docObj.querySelector("#edit-project-modal #proj-name");
        const color = this.docObj.querySelector("#edit-project-modal #proj-color");
        const validityState = nameEl.validity;

        if (validityState.valid) {
            this.currentProject.name = nameEl.value;
            this.currentProject.color = color.value;
            this.navPanel.displayProjects();
            this.containerPanel.displayProject(this.currentProject.id);
            this.projectList.updateStorage();
        }
    }
}