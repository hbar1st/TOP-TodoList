import delTaskImage from "./assets/remove-task.svg";

import { UTCDate } from "@date-fns/utc";

import { createTask } from "./task.js";
import { createProject } from "./project.js";

import { format } from "date-fns";


export { AddTaskDialog, EditTaskDialog, TodayView }

class TodayView {
    constructor(docObj, projectList, contentPanel, contentEl, taskListEl) {
        this.docObj = docObj;
        this.projectList = projectList;
        this.contentPanel = contentPanel;
        this.contentEl = contentEl;
        this.taskListEl = taskListEl;
    }

    display() {
        const today = new UTCDate();
        const todaysTasksByProj = this.projectList.getAllTasksByDate(today);
        /*const allTasks = Object.values(todaysTasksByProj).reduce((acc, el) => {
            return { ...acc, ...el.tasks };
        }, {});*/
        this.displayView();
        this.displayTasks(todaysTasksByProj);
    }

    displayView = () => {
        const proj = createProject("Today", "#ffffff");
        if (proj) {
            this.currProjNameEl = this.docObj.querySelector("#content-panel>h1");
            this.currProjEl = this.docObj.querySelector("#content-panel>header span");
            this.currProjEl.innerText = proj.name;
            this.currProjNameEl.innerText = proj.name;
            this.currProjEl.style.borderBottom = "none";
            this.contentEl.style.background = "transparent";
        }
        // views cannot be edited, remove edit icon
        const editProjectImageEl = this.docObj.querySelector("#edit-project");
        if (editProjectImageEl) {
            editProjectImageEl.parentElement.removeChild(editProjectImageEl);
        }
        // views cannot be deleted, remove delete icon
        const deleteProjImageEl = this.docObj.querySelector("#delete-project");
        if (deleteProjImageEl) {
            deleteProjImageEl.parentElement.removeChild(deleteProjImageEl);
        }

    }

    displayTasks = (tasksByProj) => {
        //TODO what happens if you delete a task from the Today view???
        console.log('each task belongs to a different project! and needs a different id!!!');
        this.taskListEl.innerHTML = "";

        for (const projId in tasksByProj) {
            for (const id in tasksByProj[projId]) {
                const task = tasksByProj[projId][id];

                this.contentPanel.displayTasksHelper(task, projId, true)
            }
        }
    }
}


class TaskDialog {

    constructor(docObj, projectList, navPanel, contentPanel, parentSelector) {
        this.docObj = docObj;
        this.projectList = projectList;
        this.navPanel = navPanel;
        this.contentPanel = contentPanel;
        this.parentSelector = parentSelector;

        this.taskDialog = docObj.querySelector(`${parentSelector}`);
        this.taskDialogDiv = docObj.querySelector(`${parentSelector}>form>div:first-child`)
        this.projectListEl = docObj.querySelector(`${parentSelector} #project-list`);
        this.dueDateEl = this.docObj.querySelector(`${parentSelector} #task-due`)
        const today = format(new Date(), "yyyy-MM-dd");
        this.dueDateEl.setAttribute("min", today);
    }

    showDialog() {
        // TODO may need to reset the various fields before showing in case it was used earlier in the session?
        this.projectListEl.innerHTML = ""; //clear out the html list
        const projects = this.projectList.getProjects();
        const currentProject = this.contentPanel.getCurrentProjectId();
        for (const id in projects) {
            const projEl = this.navPanel.createNameEl(projects[id], "option", currentProject === id);
            this.projectListEl.appendChild(projEl);
        }
        // ask the contentPanel which project is selected and make it the default one shown
        this.taskDialog.showModal();
    }


    getNameEl() {
        return this.docObj.querySelector(`${this.parentSelector} #task-name`);
    }

    getColorEl() {
        return this.docObj.querySelector(`${this.parentSelector} #task-color`);
    }

    getDescEl() {
        return this.docObj.querySelector(`${this.parentSelector} #task-desc`);
    }
    getPriorityEl() {
        return this.docObj.querySelector(`${this.parentSelector} #task-priority`);
    }
    getDueDateEl() {
        return this.docObj.querySelector(`${this.parentSelector} #task-due`);
    }

    reset() {
        this.getNameEl().value = "";
        this.getColorEl().value = "#ffffff"; //white
        this.getDescEl().value = "";
        this.getPriorityEl().value = "1";
        this.getDueDateEl().value = "";
    }

}

class EditTaskDialog extends TaskDialog {

    constructor(docObj, projectList, navPanel, contentPanel) {
        super(docObj, projectList, navPanel, contentPanel, "#edit-task-modal");

        const editBtn = docObj.querySelector(`${this.parentSelector} .button-panel>.save`);
        editBtn.addEventListener("click", this.editTask.bind(this));
    }

    show(taskObj, projObj) {
        this.loadFields(taskObj, projObj);
        this.showDialog();
    }

    loadFields(taskObj, projObj) { //loads the current task's values into the fields
        this.getNameEl().value = taskObj.name;
        this.getColorEl().value = taskObj.color;
        this.getDescEl().value = taskObj.desc ?? "";
        this.getPriorityEl().value = taskObj.priority;
        this.getDueDateEl().value = taskObj.dueDate;

        //create 2 hidden fields with the task id and the project id
        const idSpan = this.docObj.createElement("span");
        idSpan.setAttribute("hidden", "true");
        idSpan.setAttribute("id", "hidden-span");
        idSpan.setAttribute("data-id", taskObj.id);
        idSpan.setAttribute("data-proj", projObj.id);
        this.taskDialogDiv.appendChild(idSpan);
    }

    editTask(e) {
        const taskIdEl = this.docObj.querySelector(`${this.parentSelector} #hidden-span`).getAttribute("data-id");
        const taskProjIdEl = this.docObj.querySelector(`${this.parentSelector} #hidden-span`).getAttribute("data-proj");
        console.log("trying to edit a task (taskid, projid): ", taskIdEl, taskProjIdEl);
        const nameEl = this.docObj.querySelector(`${this.parentSelector} #task-name`);
        const color = this.docObj.querySelector(`${this.parentSelector} #task-color`).value;
        const priority = this.docObj.querySelector(`${this.parentSelector} #task-priority`).value;
        const desc = this.docObj.querySelector(`${this.parentSelector} #task-desc`).value;
        const dueDate = this.dueDateEl.value;
        const project = this.docObj.querySelector(`${this.parentSelector} #project-list`).value;
        const validityState = nameEl.validity;
        if (validityState.valid) {
            const taskObj = this.projectList.getProj(taskProjIdEl).getTask(taskIdEl);
            const newTask = (priority === "") ? createTask(nameEl.value, color, desc, dueDate, false, taskIdEl)
                : createTask(nameEl.value, color, desc, dueDate, priority, false, taskIdEl);

            const currentProjectId = this.contentPanel.getCurrentProjectId();

            const selectedProject = this.projectList.getProj(project);

            const oldProject = this.projectList.getProj(taskProjIdEl);
            oldProject.delTask(taskObj);
            selectedProject.addTask(newTask);
            this.contentPanel.displayProject(selectedProject.id);
            this.projectList.updateStorage();
        }
    }
}

class AddTaskDialog extends TaskDialog {

    constructor(docObj, projectList, navPanel, contentPanel) {
        super(docObj, projectList, navPanel, contentPanel, "#add-task-modal");

        const addBtn = docObj.querySelector(`${this.parentSelector} .button-panel>.add`);
        addBtn.addEventListener("click", this.addTask.bind(this));
    }

    show() {
        this.reset();
        this.showDialog();
    }

    addTask(e) {
        const nameEl = this.docObj.querySelector(`${this.parentSelector} #task-name`);
        const color = this.docObj.querySelector(`${this.parentSelector} #task-color`).value;
        const priority = this.docObj.querySelector(`${this.parentSelector} #task-priority`).value;
        const desc = this.docObj.querySelector(`${this.parentSelector} #task-desc`).value;
        const dueDate = this.dueDateEl.value;
        const project = this.docObj.querySelector(`${this.parentSelector} #project-list`).value;
        const validityState = nameEl.validity;
        if (validityState.valid) {
            const newTask = (priority === "") ? createTask(nameEl.value, color, desc, dueDate)
                : createTask(nameEl.value, color, desc, dueDate, priority);
            const currentProjectId = this.contentPanel.getCurrentProjectId();
            const selectedProject = this.projectList.getProj(project);

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