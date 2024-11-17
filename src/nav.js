import { ContentPanel } from "./content.js";
import userImage from "./assets/person-icon.svg";
import { ProjectDialog } from "./project-dialogs.js";
import { AddTaskDialog } from "./task-dialogs.js";

export { NavPanel }

class NavPanel {

    /**
     * 
     * @param {*} user a user object
     * @param {*} projects an array of project objects
     * @param {*} docObj the document object
     */
    constructor(user, projectList, docObj) {
        this.user = user;
        this.projectList = projectList;
        this.docObj = docObj;
        this.contentPanel = new ContentPanel(projectList, docObj, this);
        this.userEl = this.docObj.querySelector(".user-name");
        this.addTaskBtn = this.docObj.querySelector("#add-task>button");
        this.todayTaskBtn = this.docObj.querySelector("#today-task>button");
        this.projectsListEl = this.docObj.querySelector(".projects>ul");
        this.addProjectBtn = this.docObj.querySelector("#add-project");
        this.projectDialog = null;
        this.addTaskDialog = null;
        this.addTaskBtn.addEventListener("click", () => {
            //if (!this.addTaskDialog) {
            this.addTaskDialog = new AddTaskDialog(this.docObj, this.projectList, this, this.contentPanel);
            //}
            this.addTaskDialog.show();
        });
        this.addProjectBtn.addEventListener("click", () => {
            // if (!this.projectDialog) {
            this.projectDialog = new ProjectDialog(this.docObj, this.projectList, this, true);
            //}
            this.projectDialog.show();
        });
        this.todayTaskBtn.addEventListener("click", this.contentPanel.displayTodaysTasks);
        this.projectsListEl.addEventListener("click", this.dispatchDisplay);
    }

    initDisplay() {
        const nameEl = this.docObj.createElement("h2");
        nameEl.textContent = this.user.name;
        this.userEl.innerHTML = `<img src=${userImage} alt="account icon">`;
        this.userEl.appendChild(nameEl);

        this.displayProjects();
        this.contentPanel.displayProject(0); // the default project is id 0;

        // one event handler for all cancel events (assumes all cancel buttons are laid out in div inside form inside dialog)
        const cancelButtons = this.docObj.querySelectorAll(".cancel");
        cancelButtons.forEach(el => {
            el.addEventListener("click", (e) => {
                e.target.parentElement.parentElement.parentElement.close();
            })
        });
    }

    displayProjects() {
        this.projectsListEl.innerHTML = "";
        this.projectList.forEach((el) => {
            const projName = this.createNameEl(el, "li");
            this.projectsListEl.appendChild(projName);
        });
    }

    createNameEl(projObj, elementType, selectedAttribute) {
        const projName = this.docObj.createElement(elementType);
        projName.setAttribute("data-id", projObj.id);
        projName.setAttribute("value", projObj.id);
        if (selectedAttribute) {
            projName.selected = true;
        }
        projName.textContent = projObj.name;
        return projName;
    }

    addProject(projObj) {
        const projName = this.createNameEl(projObj, "li");
        this.projectsListEl.appendChild(projName);
    }

    dispatchDisplay = (e) => {
        //figure out which project was clicked if any and dispatch to the contentPanel display function
        if (e.target.getAttribute("data-id")) {
            this.contentPanel.displayProject(e.target.getAttribute("data-id"));
        }
    }
}