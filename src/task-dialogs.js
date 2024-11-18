import delTaskImage from "./assets/remove-task.svg";

import { UTCDate } from "@date-fns/utc";

import { createTask, priorityStrings } from "./task.js";
import { createProject } from "./project.js";

import { format } from "date-fns";


export { AddTaskDialog, TodayView }

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
        const allTasks = Object.values(todaysTasksByProj).reduce((acc, el) => {
            return { ...acc, ...el.tasks };
        }, {});
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
                //const task = tasks[id];
                console.log(id, task);
                const divEl = this.docObj.createElement("div");
                divEl.setAttribute("data-id", task.id);
                divEl.setAttribute("data-proj", projId);

                const circleImg = task.getTaskCircleImg();
                const circleEl = this.docObj.createElement("img");
                circleEl.setAttribute("alt", task.getTaskAltText());
                circleEl.setAttribute("src", circleImg);

                circleEl.setAttribute("data-id", task.id);
                circleEl.setAttribute("data-proj", projId);

                const taskEl = this.docObj.createElement("div");
                taskEl.classList.add("tooltip");
                const taskImg = this.docObj.createElement("img");
                taskImg.setAttribute("src", `${delTaskImage}`);
                taskImg.setAttribute("alt", "menu icon");
                taskImg.setAttribute("id", "task-menu");
                taskImg.setAttribute("data-id", task.id);
                taskImg.setAttribute("data-proj", projId);

                const delOptionEl = this.docObj.createElement("div");
                delOptionEl.textContent = "delete task";
                delOptionEl.classList.add("tooltiptext");
                delOptionEl.setAttribute("data-id", task.id);
                delOptionEl.setAttribute("data-proj", projId);

                taskEl.appendChild(taskImg);
                taskEl.appendChild(delOptionEl);

                const subDivEl = this.docObj.createElement("div");
                subDivEl.classList.add(`${task.completed}`);

                const nameSpanEl = this.docObj.createElement("span");
                nameSpanEl.innerText = `${task.name}`;
                subDivEl.appendChild(nameSpanEl);
                if (task.hasDueDate()) {
                    const dueDateEl = this.docObj.createElement("input");
                    dueDateEl.setAttribute("type", "date");
                    dueDateEl.value = `${task.getDueDateStr()}`;
                    dueDateEl.style.borderColor = `${task.color}`;

                    const today = format(new Date(), "yyyy-MM-dd");
                    dueDateEl.setAttribute("min", today);
                    dueDateEl.setAttribute("data-id", task.id);
                    dueDateEl.setAttribute("data-proj", projId);
                    subDivEl.appendChild(dueDateEl);
                }
                const priorityEl = this.docObj.createElement("select");
                priorityEl.setAttribute("data-id", task.id);
                const priorityOption1 = this.docObj.createElement("option");
                priorityOption1.setAttribute("value", "0");
                priorityOption1.innerText = priorityStrings["0"];
                const priorityOption2 = this.docObj.createElement("option");
                priorityOption2.setAttribute("value", "1");
                priorityOption2.innerText = priorityStrings["1"];
                const priorityOption3 = this.docObj.createElement("option");
                priorityOption3.setAttribute("value", "2");
                priorityOption3.innerText = priorityStrings["2"];
                const priority = priorityStrings[task.getPriorityStr()];
                if (priority === priorityStrings["0"]) {
                    priorityOption1.selected = true;
                } else if (priority === priorityStrings["1"]) {
                    priorityOption2.selected = true;
                } else {
                    priorityOption3.selected = true;
                }
                priorityEl.appendChild(priorityOption1);
                priorityEl.appendChild(priorityOption2);
                priorityEl.appendChild(priorityOption3);
                priorityEl.setAttribute("data-id", task.id);
                priorityEl.setAttribute("data-proj", projId);
                const labelEl = this.docObj.createElement("label");
                labelEl.innerText = "Priority:";

                labelEl.appendChild(priorityEl);
                subDivEl.appendChild(labelEl);

                // this divEl is managed by flex layout
                divEl.appendChild(circleEl);
                divEl.appendChild(subDivEl);
                divEl.appendChild(taskEl);
                this.taskListEl.appendChild(divEl);
            }
        }
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