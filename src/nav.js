import { ContentPanel } from "./content.js";
import userImage from "./assets/person-icon.svg";
import addImage from "./assets/add-circle.svg";
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

        this.addTaskBtn.addEventListener("click", this.contentPanel.displayAddTaskDialog);
        this.todayTaskBtn.addEventListener("click", this.contentPanel.displayTasks);
        this.projectsListEl.addEventListener("click", this.dispatchDisplay);
    }

    initDisplay() {
        const nameEl = this.docObj.createElement("h2");
        nameEl.textContent = this.user.name;
        this.userEl.innerHTML = `<img src=${userImage} alt="account icon">`;
        this.userEl.appendChild(nameEl);

        this.projects.forEach((el) => {
            const projName = this.docObj.createElement("li");
            projName.setAttribute("id", el.id);
            projName.textContent = el.name;
            this.projectsListEl.appendChild(projName);
        });

        this.contentPanel.displayProject(0); // the default project is id 0;
    }

    dispatchDisplay = (e) => {
        //figure out which project was clicked if any and dispatch to the contentPanel display function
        console.log(e.target);
        console.log(this.contentPanel);
        this.contentPanel.displayProject(e.target.getAttribute("id"));
    }
}