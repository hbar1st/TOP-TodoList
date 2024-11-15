import taskImage from "./assets/task.svg";
import completedTaskImage from "./assets/task-completed.svg";

export { ContentPanel }

class ContentPanel {

    constructor(projects, docObj) {
        this.projects = projects;
        this.contentEl = docObj.querySelector("#content-panel");
        this.currProjEl = docObj.querySelector("#content-panel>header span");
        this.currProjNameEl = docObj.querySelector("#content-panel>h1");
        this.taskListEl = docObj.querySelector("#content-panel>ul");
        this.docObj = docObj;
        this.contentEl.addEventListener("click", this.taskClicked);
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
            taskEl.setAttribute("id", tasks[id].id);
            const circleImg = taskImage;
            const circleEl = this.docObj.createElement("img");

            if (tasks[id].completed) {
                circleImg = completedTaskImage;
            }
            circleEl.setAttribute("src", circleImg);
            circleEl.setAttribute("alt", "task selector button");
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
        } else if (e.target instanceof HTMLLIElement) {
            console.log('clicked on an li element, get the id and open up the task view')
        } else {
            console.log("not the image and not the li? ", e.target.parentElement);
        }

    }

    displayProject = (id) => {
        const proj = this.projects.getProj(id);
        console.log(proj);
        if (proj) {
            this.currProjEl.innerText = proj.name;
            this.currProjNameEl.innerText = proj.name;
        }
        this.displayTasks(proj);
    }

    displayAddTaskDialog = () => {
        console.log("yay, we're gonna add a task! Let's do it!")
    }

}