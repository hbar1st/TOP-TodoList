import "./styles.css";
import { createUser } from "./user.js";
import { WebStorage } from "./storage.js";
import { ProjectList } from "./project-list.js";
import { NavPanel } from "./nav.js";

const todoList = function (windowObj) {
    const storage = new WebStorage(windowObj);
    let userObj = storage.getItem("name");
    const body = document.querySelector("body");
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
    const navPanel = new NavPanel(userObj, projects, document);
    navPanel.initDisplay();
    // now we have to set into motion some display updates
}

todoList(window); //let's go



//it can also have its own due date (and if any sub-task has a later todo, we'd need to highlight that somehow)

//each todo item is a grouping/object containing the title of the todo
//plus description, due date and priority. (due date must be presented but they don't have to provide one)
//Only the name is absolutely required
//and I want to give todos colors
//but those colors are over-written if the project has its own color

//also TODOs need status. Like complete/incomplete boolean.
//user can mark a todo as complete
//user can change due date
//user can change color (but not if project has color)
//user can change desc and even the title of the task
//user can delete a task
//users can select from a list of projects to assign a task to (or re-assign to another project)
//user can do bulk actions? (delete? or mark complete?)

//user can change name of the project
//user can change the color of the project
//user can change the due date of the project
//which may affect any sub-tasks that are out of range 
//user can delete a project (which deletes the entire task list ?? or just the projects and the tasks are orphaned??)

//user can change their name

//how is priority represented? low/medium/high

//what are the objects I need to concern myself with?

//task object (represents one task)
//project object (represents one project)
//user object (represents the user)
//controlRoom class for the full screen
//projectsDisplay for the projects we have
//dueDateDisplay for the upcoming tasks and projects
//tasklist display
//editing dialogs for projects and tasks

// i need a way to remove all the tasks of a project en masse when the project gets deleted.
// i need a way to migrate a todo from one project to another

// note you need to update storage any time someone modifies a task or project 
// even if they are completing it (mark done), or they're editing the due date or priority or color etc.