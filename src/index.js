import "./styles.css";
import { createUser } from "./user.js";
import { WebStorage } from "./storage.js";
import { ProjectList } from "./project-list.js";
import { NavPanel } from "./nav.js";

const todoList = function (windowObj) {
    const storage = new WebStorage(windowObj);
    let userObj = storage.getItem("name");
    if (userObj === null) {
        userObj = createUser("user");
        storage.setItem("name", userObj);
    }

    // load existing user's todo lists
    let projects = storage.getItem("projects");

    if (projects) {
        projects = new ProjectList(storage, projects);
    } else {
        projects = new ProjectList(storage);
    }
    const navPanel = new NavPanel(userObj, projects, document, storage);
    navPanel.initDisplay();
    // now we have to set into motion some display updates
}

todoList(window); //let's go