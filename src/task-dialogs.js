import { UTCDate } from "@date-fns/utc";
import { createTask } from "./task.js";
import { createProject } from "./project.js";

import { format } from "date-fns";

export { AddTaskDialog, TodayView }

class TodayView {
    constructor(docObj, projectList, contentPanel, contentEl) {
        this.docObj = docObj;
        this.projectList = projectList;
        this.contentPanel = contentPanel;
        this.contentEl = contentEl;
    }

    display() {
        const today = new UTCDate();
        const todaysTasks = this.projectList.getAllTasksByDate(today);
        this.displayView(today, todaysTasks);
    }

    displayView = (date, tasks) => {
        const proj = createProject("Today", "#ffffff", date, tasks);
        if (proj) {
            this.currProjNameEl = this.docObj.querySelector("#content-panel>h1");
            this.currProjEl = this.docObj.querySelector("#content-panel>header span");
            this.currProjEl.innerText = proj.name;
            this.currProjNameEl.innerText = proj.name;
            this.currProjEl.style.borderBottom = "none";
            this.contentEl.style.background = "transparent";
        }
        const editProjectImageEl = this.docObj.querySelector("#edit-project");
        if (editProjectImageEl) {
            editProjectImageEl.parentElement.removeChild(editProjectImageEl);
        }
        const deleteProjImageEl = this.docObj.querySelector("#delete-project");
        if (deleteProjImageEl) {
            deleteProjImageEl.parentElement.removeChild(deleteProjImageEl);
        }

        this.displayTasks();
    }

    displayTasks = () => {
        console.log('each task belongs to a different project! and needs a different id!!!');
    }
}

class AddTaskDialog {

    constructor(docObj, projectList, navPanel, contentPanel) {
        this.docObj = docObj;
        this.projectList = projectList;
        this.navPanel = navPanel;
        this.contentPanel = contentPanel;
        this.projectListEl = docObj.querySelector("#add-task-modal #project-list");
        this.addTaskDialog = docObj.querySelector("#add-task-modal");
        const addBtn = docObj.querySelector("#add-task-modal .button-panel>.add");
        this.dueDateEl = this.docObj.querySelector("#task-due")
        const today = format(new Date(), "yyyy-MM-dd");
        this.dueDateEl.setAttribute("min", today);
        console.log(addBtn);
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
        const dueDate = this.dueDateEl.value;
        const project = this.docObj.querySelector("#project-list").value;
        const validityState = nameEl.validity;
        if (validityState.valid) {
            // if user selected a project, tell that project about this task otherwise tell the
            //   default project id 0 about this task
            // the project object should inform the storage to update itself
            // and the project object should inform the nav to update itself

            const newTask = (priority === "") ? createTask(nameEl.value, color, desc, dueDate)
                : createTask(nameEl.value, color, desc, dueDate, priority);
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