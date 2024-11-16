
import deleteProjectImage from "./assets/remove-project.svg";
export { ContentPanel }

class ContentPanel {

    constructor(projectList, docObj, navPanel) {
        this.projectList = projectList;
        this.navPanel = navPanel;
        this.contentEl = docObj.querySelector("#content-panel");
        this.currProjEl = docObj.querySelector("#content-panel>header span");
        this.currProjNameEl = docObj.querySelector("#content-panel>h1");
        this.taskListEl = docObj.querySelector("#content-panel>ul");

        this.deleteProjImg = docObj.createElement("img");
        this.deleteProjImg.setAttribute("src", `${deleteProjectImage}`);
        this.deleteProjImg.setAttribute("alt", "delete-project");
        this.deleteProjImg.setAttribute("id", "delete-project");
        this.deleteProjImg.addEventListener("click", this.deleteProject);

        this.docObj = docObj;
        this.taskListEl.addEventListener("click", this.taskClicked);
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
        // <li><span class="unchecked"><img src="./assets/task.svg" alt=""></span>First Task</li>
        console.log({ projObj });
        const tasks = projObj.getTasks();
        this.taskListEl.innerHTML = "";
        console.log({ tasks });
        for (const id in tasks) {
            const taskEl = this.docObj.createElement("li");
            const task = tasks[id];
            taskEl.setAttribute("data-id", task.id);
            const circleImg = task.getTaskCircleImg();
            const circleEl = this.docObj.createElement("img");
            circleEl.setAttribute("alt", task.getTaskAltText());
            circleEl.setAttribute("src", circleImg);
            const spanEl = this.docObj.createElement("span");
            spanEl.classList.add(`${tasks[id].completed}`);
            spanEl.appendChild(circleEl);

            taskEl.appendChild(spanEl);
            taskEl.appendChild(this.docObj.createTextNode(`${tasks[id].name}`));
            this.taskListEl.appendChild(taskEl);
        }
    }

    taskClicked = (e) => {
        console.log("what was clicked?");
        console.log(e.target);
        if (e.target instanceof HTMLImageElement) {
            console.log('clicked on an image should toggle completeness');
            const imgParentEl = e.target.parentElement;
            const taskId = imgParentEl.parentElement.getAttribute("data-id");
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
        } else if (e.target instanceof HTMLLIElement) {
            const taskId = e.target.id;
            console.log("create a dialog to show this task:", taskId)
            this.projectList.updateStorage();
        } else {
            console.log("not the image and not the li? ", e.target.parentElement);
        }

    }

    deleteProject = () => {
        //set the new current project to the default project
        let currentProjectId = this.getCurrentProjectId();
        console.log("delete the current project: ", this.getCurrentProjectId())
        if (this.getCurrentProjectId != 0) {
            this.projectList.deleteProject(currentProjectId);
        }
        this.navPanel.refreshProjectsDisplay();
        this.refreshDisplay();
    }

    displayProject = (id) => {
        const proj = this.projectList.getProj(id);
        if (proj) {
            this.currProjEl.innerText = proj.name;
            this.currProjNameEl.innerText = proj.name;
        }
        if (id != 0) { // this is not the default project so display delete image
            this.contentEl.insertBefore(this.deleteProjImg, this.currProjNameEl);
        }
        this.displayTasks(proj);
        this.currentProject = id;
    }

    getCurrentProjectId() {
        return this.currentProject;
    }

}