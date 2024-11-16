import { createTask } from "./task.js";
export { AddTaskDialog }


class AddTaskDialog {

    constructor(docObj, projectList, navPanel, contentPanel) {
        this.docObj = docObj;
        this.projectList = projectList;
        this.navPanel = navPanel;
        this.contentPanel = contentPanel;
        this.projectListEl = docObj.querySelector("#add-task-modal #project-list");
        this.addTaskDialog = docObj.querySelector("#add-task-modal");
        const addBtn = docObj.querySelector("#add-task-modal .button-panel>.add");
        addBtn.addEventListener("click", this.addTask.bind(this));

    }

    show() {
        // TODO may need to reset the various fields before showing in case it was used earlier in the session?
        this.projectListEl.innerHTML = ""; //clear out the html list
        const projects = this.projectList.getProjects();
        const currentProject = this.contentPanel.getCurrentProjectId();
        for (const id in projects) {
            const projEl = this.navPanel.createNameEl(projects[id], "option", currentProject === id);
            this.projectListEl.appendChild(projEl);
        }
        // ask the contentPanel which project is selected and make it the default one shown
        this.addTaskDialog.showModal();
    }

    addTask(e) {
        console.log(e);
        const nameEl = this.docObj.querySelector("#task-name");
        const color = this.docObj.querySelector("#task-color").value;
        const priority = this.docObj.querySelector("#task-priority").value;
        const desc = this.docObj.querySelector("#task-desc").value;
        const dueDate = this.docObj.querySelector("#task-due").value;
        const project = this.docObj.querySelector("#project-list").value;
        const validityState = nameEl.validity;
        if (validityState.valid) {
            // if user selected a project, tell that project about this task otherwise tell the
            //   default project id 0 about this task
            // the project object should inform the storage to update itself
            // and the project object should inform the nav to update itself
            const newTask = createTask(nameEl.value, color, desc, dueDate, priority);
            const currentProjectId = this.contentPanel.getCurrentProjectId();
            const selectedProject = this.projectList.getProj(project);
            console.log(selectedProject);
            const selectedProjectId = selectedProject.id;

            if (currentProjectId === selectedProjectId) {
                const currentProject = this.projectList.getProj(currentProjectId);
                currentProject.addTask(newTask);
                this.contentPanel.displayProject(currentProjectId);
            } else {
                selectedProject.addTask(newTask);
                this.contentPanel.displayProject(selectedProjectId);
            }
            this.projectList.updateStorage();
        }
    }
}