
import deleteProjectImage from "./assets/remove-project.svg";
import delTaskImage from "./assets/remove-task.svg";
import { EditProjectDialog } from "./project-dialogs.js";
import { priorityStrings } from "./task";

export { ContentPanel }

class ContentPanel {

    constructor(projectList, docObj, navPanel) {
        this.projectList = projectList;
        this.navPanel = navPanel;
        this.contentEl = docObj.querySelector("#content-panel");
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
                this.projectDialog = new EditProjectDialog(this.docObj, this.projectList, this, false, this.navPanel);
            }
            this.projectDialog.show();

        });

        this.taskListEl.addEventListener("click", this.taskClicked);
        this.docObj = docObj;
        this.currentProject = 0;
    }


    refreshDisplay = () => {
        this.currentProject = 0; // zero is the default project id.
        this.displayProject(0);
    }

    displayTodaysTasks = (e) => {
        console.log(e.target);
    }

    displayTasks = (projObj) => {
        // should accept some kind of date like whatever today is and get the tasks that are due on that date!??!!
        // <div data-id=""><div><img src="./assets/task.svg" alt=""><span>First Task<span><span>Due: 11/11/2024</span></div></div>
        console.log({ projObj });
        const tasks = projObj.getTasks();
        this.taskListEl.innerHTML = "";

        for (const id in tasks) {
            const task = tasks[id];

            const divEl = this.docObj.createElement("div");
            divEl.setAttribute("data-id", task.id);

            const circleImg = task.getTaskCircleImg();
            const circleEl = this.docObj.createElement("img");
            circleEl.setAttribute("alt", task.getTaskAltText());
            circleEl.setAttribute("src", circleImg);

            const taskEl = this.docObj.createElement("div");
            taskEl.classList.add("tooltip");
            const taskImg = this.docObj.createElement("img");
            taskImg.setAttribute("src", `${delTaskImage}`);
            taskImg.setAttribute("alt", "menu icon");
            taskImg.setAttribute("id", "task-menu");

            const delOptionEl = this.docObj.createElement("div");
            delOptionEl.textContent = "delete task";
            delOptionEl.classList.add("tooltiptext");
            taskEl.appendChild(taskImg);
            taskEl.appendChild(delOptionEl);

            const subDivEl = this.docObj.createElement("div");
            subDivEl.classList.add(`${tasks[id].completed}`);

            const nameSpanEl = this.docObj.createElement("span");
            nameSpanEl.innerText = `${tasks[id].name}`;
            subDivEl.appendChild(nameSpanEl);
            if (tasks[id].hasDueDate()) {
                const dueDateEl = this.docObj.createElement("input");
                dueDateEl.setAttribute("type", "date");
                dueDateEl.value = `${tasks[id].getDueDateStr()}`;
                dueDateEl.style.borderColor = `${tasks[id].color}`;
                subDivEl.appendChild(dueDateEl);
            }
            const priorityEl = this.docObj.createElement("select");
            const priorityOption1 = this.docObj.createElement("option");
            priorityOption1.setAttribute("value", "0");
            priorityOption1.innerText = priorityStrings["0"];
            const priorityOption2 = this.docObj.createElement("option");
            priorityOption2.setAttribute("value", "1");
            priorityOption2.innerText = priorityStrings["1"];
            const priorityOption3 = this.docObj.createElement("option");
            priorityOption3.setAttribute("value", "2");
            priorityOption3.innerText = priorityStrings["2"];
            const priority = priorityStrings[tasks[id].getPriorityStr()];
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

    taskClicked = (e) => {
        console.log("what was clicked?");
        console.log(e.target);
        if (e.target.classList.contains("tooltiptext")) {

            const imgParentEl = e.target.parentElement.parentElement;
            const taskParentEl = imgParentEl.parentElement;
            const taskId = imgParentEl.getAttribute("data-id");
            const proj = this.projectList.getProj(this.getCurrentProjectId());
            //this.projectList.deleteTaskFrom(this.getCurrentProjectId());
            proj.delTask(taskId);
            taskParentEl.removeChild(imgParentEl);
            this.projectList.updateStorage();
        } else if (e.target instanceof HTMLImageElement) {
            if (e.target.id !== "task-menu") {
                const imgParentEl = e.target.parentElement;
                const taskId = imgParentEl.getAttribute("data-id");
                const proj = this.projectList.getProj(this.getCurrentProjectId());
                //proj.toggleDone(taskId);
                const task = proj.getTasks()[taskId];
                task.toggleDone();
                const completedTaskEl = this.docObj.createElement("img");
                imgParentEl.classList.toggle("false");
                completedTaskEl.setAttribute("src", task.getTaskCircleImg());
                completedTaskEl.setAttribute("alt", task.getTaskAltText());
                imgParentEl.replaceChild(completedTaskEl, e.target);

                //update the storage
                this.projectList.updateStorage();
            }
        } else if (e.target instanceof HTMLDivElement) {
            const taskId = e.target.id;
            console.log("create a dialog to show this task:", taskId)
            this.projectList.updateStorage();
        } else if (e.target instanceof HTMLSpanElement) {
            console.log("is it the due date span that you clicked? ", e.target.parentElement);
        }
    }

    deleteProject = () => {
        //set the new current project to the default project
        let currentProjectId = this.getCurrentProjectId();
        console.log("delete the current project: ", this.getCurrentProjectId())
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
            this.currProjNameEl.innerText = proj.name;
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
        this.currentProject = id;
    }


    getCurrentProjectId() {
        return this.currentProject;
    }

}