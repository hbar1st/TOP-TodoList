import { ContentPanel } from "./content.js";
import userImage from "./assets/person-icon.svg";
import addImage from "./assets/add-circle.svg";

export class NavPanel {

    constructor(user, projects, docObj) {
        this.user = user;
        this.projects = projects;
        this.docObj = docObj;
        this.contentPanel = new ContentPanel(projects, docObj);
        this.userEl = this.docObj.querySelector(".user-name");
    }

    initDisplay() {
        const nameEl = this.docObj.createElement("h2");
        nameEl.textContent = this.user.name;
        this.userEl.innerHTML = `<img src=${userImage} alt="account icon">`;
        this.userEl.appendChild(nameEl);
    }
}