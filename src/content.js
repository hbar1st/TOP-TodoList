export { ContentPanel }

class ContentPanel {

    constructor(projectList, docObj) {
        this.projectList = projectList;
        this.contentEl = docObj.querySelector("#content-panel");
        this.currProjEl = docObj.querySelector("#content-panel>header span");
        this.currProjNameEl = docObj.querySelector("#content-panel>h1");
        this.taskListEl = docObj.querySelector("#content-panel>ul");
        this.docObj = docObj;
        this.contentEl.addEventListener("click", this.taskClicked);
        this.currentProject = 0; // zero is the default project id.
    }

    refreshDisplay = () => {

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
            taskEl.setAttribute("id", task.id);
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
            const taskId = imgParentEl.parentElement.id;
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

    displayProject = (id) => {
        const proj = this.projectList.getProj(id);
        if (proj) {
            this.currProjEl.innerText = proj.name;
            this.currProjNameEl.innerText = proj.name;
        }
        this.displayTasks(proj);
        this.currentProject = id;
    }

    getCurrentProjectId() {
        return this.currentProject;
    }

}