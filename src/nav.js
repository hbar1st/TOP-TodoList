import { ContentPanel } from "./content.js";
import userImage from "./assets/person-icon.svg";
import { AddProjectDialog } from "./project-dialogs.js";
import { AddTaskDialog } from "./task-dialogs.js";
import { UserProfileDialog } from "./user-profile-dialog.js"

export { NavPanel }

class NavPanel {

    /**
     * 
     * @param {*} user a user object
     * @param {*} projects an array of project objects
     * @param {*} docObj the document object
     */
    constructor(user, projectList, docObj, storage) {
        this.user = user;
        this.storage = storage;
        this.projectList = projectList;
        this.docObj = docObj;
        this.contentPanel = new ContentPanel(projectList, docObj, this);
        this.userEl = this.docObj.querySelector(".user-name");
        this.addTaskBtn = this.docObj.querySelector("#add-task>button");
        this.todayTaskBtn = this.docObj.querySelector("#today-task>button");
        this.projectsListEl = this.docObj.querySelector(".projects>ul");
        this.addProjectBtn = this.docObj.querySelector("#add-project");
        this.addTaskDialog = null;
        this.addProjectDialog = null;
        this.userProfileDialog = new UserProfileDialog(this.docObj, this, this.contentPanel, this.user);

        this.addTaskBtn.addEventListener("click", () => {
            if (!this.addTaskDialog) {
                this.addTaskDialog = new AddTaskDialog(this.docObj, this.projectList, this, this.contentPanel);
            }
            this.addTaskDialog.show();

        });
        this.addProjectBtn.addEventListener("click", () => {
            if (!this.addProjectDialog) {
                this.addProjectDialog = new AddProjectDialog(this.docObj, this.projectList, this, this);
            }
            this.addProjectDialog.show();
        });
        this.todayTaskBtn.addEventListener("click", this.contentPanel.displayTodaysTasks);
        this.projectsListEl.addEventListener("click", this.dispatchDisplay);
    }

    initDisplay() {
        const nameEl = this.docObj.createElement("h2");
        nameEl.textContent = this.user.name;
        const accountImg = this.docObj.createElement("img");
        accountImg.setAttribute("src", `${userImage}`);
        accountImg.setAttribute("alt", "account icon");
        accountImg.addEventListener("click", () => {
            const userDialog = this.docObj.querySelector("#user-profile-modal");
            userDialog.showModal();
        });
        this.userEl.appendChild(accountImg);
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
        this.userProfileDialog.loadProfile();
        this.userProfileDialog.switchTheme(null, this.user.theme);
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
        this.contentPanel.displayProject(projObj.id);
    }

    dispatchDisplay = (e) => {
        //figure out which project was clicked if any and dispatch to the contentPanel display function
        if (e.target.getAttribute("data-id")) {
            this.contentPanel.displayProject(e.target.getAttribute("data-id"));
        }
    }

    updateStorage() {
        this.storage.setItem("name", this.user);

        const nameEl = this.docObj.createElement("h2");

        nameEl.textContent = this.user.name;
    }
}