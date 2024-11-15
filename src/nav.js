import { ContentPanel } from "./content.js";
import userImage from "./assets/person-icon.svg";
import { AddProjectDialog } from "./project-dialogs.js";
import { AddTaskDialog } from "./task-dialogs.js";

export { NavPanel }

class NavPanel {

    /**
     * 
     * @param {*} user a user object
     * @param {*} projects an array of project objects
     * @param {*} docObj the document object
     */
    constructor(user, projects, docObj) {
        this.user = user;
        this.projects = projects;
        this.docObj = docObj;
        this.contentPanel = new ContentPanel(projects, docObj);
        this.userEl = this.docObj.querySelector(".user-name");
        this.addTaskBtn = this.docObj.querySelector("#add-task>button");
        this.todayTaskBtn = this.docObj.querySelector("#today-task>button");
        this.projectsListEl = this.docObj.querySelector(".projects>ul");
        this.addProjectBtn = this.docObj.querySelector("#add-project");
        this.addProjectDialog = null;
        this.addTaskDialog = null;
        this.addTaskBtn.addEventListener("click", () => {
            if (!this.addTaskDialog) {
                this.addTaskDialog = new AddTaskDialog(this.docObj, this.projects, this, this.contentPanel);
            }
            this.addTaskDialog.show();
        });
        this.addProjectBtn.addEventListener("click", () => {
            if (!this.addProjectDialog) {
                this.addProjectDialog = new AddProjectDialog(this.docObj, this.projects, this);
            }
            this.addProjectDialog.show();
        });
        this.todayTaskBtn.addEventListener("click", this.contentPanel.displayTodaysTasks);
        this.projectsListEl.addEventListener("click", this.dispatchDisplay);
    }

    initDisplay() {
        const nameEl = this.docObj.createElement("h2");
        nameEl.textContent = this.user.name;
        this.userEl.innerHTML = `<img src=${userImage} alt="account icon">`;
        this.userEl.appendChild(nameEl);

        this.projects.forEach((el) => {
            const projName = this.createNameEl(el);
            this.projectsListEl.appendChild(projName);
        });

        this.contentPanel.displayProject(0); // the default project is id 0;

        // one event handler for all cancel events (assumes all cancel buttons are laid out in div inside form inside dialog)
        const cancelButtons = this.docObj.querySelectorAll(".cancel");
        cancelButtons.forEach(el => {
            el.addEventListener("click", (e) => {
                e.target.parentElement.parentElement.parentElement.close();
            })
        });
    }

    createNameEl(projObj) {
        const projName = this.docObj.createElement("li");
        projName.setAttribute("id", projObj.id);
        projName.textContent = projObj.name;
        return projName;
    }

    addProject(projObj) {
        const projName = this.createNameEl(projObj);
        this.projectsListEl.appendChild(projName);
    }

    dispatchDisplay = (e) => {
        //figure out which project was clicked if any and dispatch to the contentPanel display function
        this.contentPanel.displayProject(e.target.getAttribute("id"));
    }
}