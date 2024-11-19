import "./styles.css";
import { createUser } from "./user.js";
import { WebStorage } from "./storage.js";
import { ProjectList } from "./project-list.js";
import { NavPanel } from "./nav.js";

const todoList = function (windowObj) {
    const storage = new WebStorage(windowObj);
    let userObj = storage.getItem("name");
    if (userObj === null) {
        // save this person's profile and display the app?
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

//it can also have its own due date (and if any sub-task has a later todo, we'd need to highlight that somehow)

//user can change color (but not if project has color)

//users can select from a list of projects to assign a task to (or re-assign to another project)
//user can do bulk actions? (delete? or mark complete?)

//user can change the due date of the project
//which may affect any sub-tasks that are out of range 

//user can change their name

// i need a way to migrate a todo from one project to another
