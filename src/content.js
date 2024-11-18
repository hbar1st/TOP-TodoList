import deleteProjectImage from "./assets/remove-project.svg";
import editProjectImage from "./assets/edit-pen.svg";
import delTaskImage from "./assets/remove-task.svg";

import { EditProjectDialog } from "./project-dialogs.js";
import { EditTaskDialog } from "./task-dialogs.js"
import { TodayView } from "./task-dialogs.js";
import { priorityStrings } from "./task.js";
import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";


export { ContentPanel }

class ContentPanel {

    constructor(projectList, docObj, navPanel) {
        this.projectList = projectList;
        this.navPanel = navPanel;
        this.contentEl = docObj.querySelector("#content-panel");
        this.currProjHeader = docObj.querySelector("#content-panel>header");
        this.currProjEl = docObj.querySelector("#content-panel>header span");
        this.currProjNameEl = docObj.querySelector("#content-panel>h1");
        this.taskListEl = docObj.querySelector("#content-panel>div");

        this.deleteProjImg = docObj.createElement("img");
        this.deleteProjImg.setAttribute("src", `${deleteProjectImage}`);
        this.deleteProjImg.setAttribute("alt", "delete-project");
        this.deleteProjImg.setAttribute("id", "delete-project");
        this.deleteProjImg.addEventListener("click", this.deleteProject);

        this.projectDialog = null;
        this.editProjImg = docObj.querySelector("#edit-project");
        this.editProjImg.addEventListener("click", () => {
            if (!this.projectDialog) {
                this.projectDialog = new EditProjectDialog(this.docObj, this.projectList, this, this.navPanel);
            }
            this.projectDialog.show();
        });

        this.taskListEl.addEventListener("click", this.taskClicked);
        this.taskListEl.addEventListener("input", this.taskClicked);
        this.docObj = docObj;
        this.currentProjectId = 0;

        this.editProjectImgEl = this.docObj.createElement("img");
        this.editProjectImgEl.setAttribute("src", `${editProjectImage}`);
        this.editProjectImgEl.setAttribute("alt", "edit project");
        this.editProjectImgEl.setAttribute("id", "#edit-project");
        this.editProjectImgEl.addEventListener("click", () => {
            if (!this.projectDialog) {
                this.projectDialog = new EditProjectDialog(this.docObj, this.projectList, this, this.navPanel);
            }
            this.projectDialog.show();
        });

        this.editTaskDialog = new EditTaskDialog(this.docObj, this.projectList, this.navPanel, this);
    }


    refreshDisplay = () => {
        this.currentProjectId = 0; // zero is the default project id.
        this.displayProject(0);
    }

    displayTodaysTasks = (e) => {
        console.log("attempt to get today's tasks for display");
        this.currentProjectId = null; // it has to be null when we're in a view.
        (new TodayView(this.docObj, this.projectList, this, this.contentEl, this.taskListEl)).display();
    }

    displayTasks = (projObj) => {
        const tasks = projObj.getTasks();
        this.taskListEl.innerHTML = "";

        for (const id in tasks) {
            const task = tasks[id];

            this.displayTasksHelper(task, this.getCurrentProjectId());
        }
    }

    taskClicked = (e) => {
        console.log("you just clicked on : ", e.target, e.type);

        const taskId = e.target.getAttribute("data-id") ?? e.target.parentElement.getAttribute("data-id");
        const taskCurrentProjectId = this.getCurrentProjectId();

        const proj = this.projectList.getProj(taskCurrentProjectId ?? e.target.getAttribute("data-proj"));

        if (e.target.classList.contains("tooltiptext")) {
            const imgParentEl = e.target.parentElement.parentElement;
            const taskParentEl = imgParentEl.parentElement;
            proj.delTask(taskId);
            taskParentEl.removeChild(imgParentEl);
            this.projectList.updateStorage();
        } else if (e.target instanceof HTMLImageElement) {
            if (e.target.id !== "task-menu") {
                const imgParentEl = e.target.parentElement;
                const task = proj.getTasks()[taskId];
                task.toggleDone();
                const completedTaskEl = this.docObj.createElement("img");
                imgParentEl.classList.toggle("false");
                completedTaskEl.setAttribute("src", task.getTaskCircleImg());
                completedTaskEl.setAttribute("alt", task.getTaskAltText());
                completedTaskEl.setAttribute("data-id", taskId);
                completedTaskEl.setAttribute("data-proj", proj.id);
                imgParentEl.replaceChild(completedTaskEl, e.target);

            }
        } else if (e.target instanceof HTMLDivElement || e.target instanceof HTMLSpanElement) {
            const taskId = e.target.getAttribute("data-id") ?? e.target.parentElement.getAttribute("data=id");
            const projId = e.target.getAttribute("data-proj") ?? e.target.parentElement.getAttribute("data-proj");
            console.log("create a dialog to show this task, project:", taskId, projId)
            this.editTaskDialog.show(this.projectList.getProj(projId).getTask(taskId), this.projectList.getProj(projId));
            this.projectList.updateStorage();
        } else if (e.type === "input" && e.target instanceof HTMLInputElement) {
            console.log("is it the due date span that you clicked? ", e.target.value);
            const d = new UTCDate(e.target.value);
            proj.getTask(taskId).dueDate = d;
        } else if (e.target instanceof HTMLSelectElement) {
            proj.getTask(taskId).priority = e.target.value;
        }
        //update the storage
        this.projectList.updateStorage();
    }

    displayTasksHelper(task, projId) {
        console.log(projId);
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
        subDivEl.setAttribute("data-id", task.id);
        subDivEl.setAttribute("data-proj", projId);
        const nameSpanEl = this.docObj.createElement("span");
        nameSpanEl.innerText = `${task.name}`;
        nameSpanEl.setAttribute("data-id", task.id);

        nameSpanEl.setAttribute("data-proj", projId);

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

    deleteProject = () => {
        //set the new current project to the default project
        let currentProjectId = this.getCurrentProjectId();
        if (this.getCurrentProjectId != 0) {
            this.projectList.deleteProject(currentProjectId);
        }
        this.navPanel.displayProjects();
        this.refreshDisplay();
        this.currProjNameEl = this.docObj.querySelector("#content-panel>h1");
        this.currProjEl = this.docObj.querySelector("#content-panel>header span");
    }

    displayProject = (id) => {
        const proj = this.projectList.getProj(id);
        if (proj) {

            this.currProjNameEl = this.docObj.querySelector("#content-panel>h1");

            this.currProjEl = this.docObj.querySelector("#content-panel>header span");
            this.currProjEl.innerText = proj.name;
            this.currProjEl.style.borderBottom = `3px solid ${proj.color}`;
            this.contentEl.style.background = `linear-gradient(45deg, transparent 0%, transparent 94%, ${proj.color} 94%, ${proj.color} 94.5%, transparent 94.5%, transparent 94.5%, gray 95%, ${proj.color} 95%, ${proj.color} 100%`;
            this.currProjNameEl.innerText = proj.name;
        }

        const editProjectImageEl = this.docObj.querySelector("#edit-project");
        if (!editProjectImageEl) {
            this.currProjHeader.appendChild(this.editProjectImgEl);
        }

        if (id != 0) { // this is not the default project so display delete image
            this.contentEl.insertBefore(this.deleteProjImg, this.currProjNameEl);
        } else {
            const deleteProjImageEl = this.docObj.querySelector("#delete-project");
            if (deleteProjImageEl) {
                deleteProjImageEl.parentElement.removeChild(this.deleteProjImg);
            }
        }

        this.displayTasks(proj);
        this.currentProjectId = id;
    }


    getCurrentProjectId() {
        return this.currentProjectId;
    }

}