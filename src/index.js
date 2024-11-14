import "./styles.css";
import { createUser } from "./user.js";
import { WebStorage } from "./storage.js";
import { getDefaultProject, reviveProject } from "./project.js";
import { getDefaultTask, priorityStrings } from "./task.js";
import { NavPanel } from "./nav.js";

const todoList = function (w) {
    const storage = new WebStorage(w);
    let userObj = storage.getItem("name");
    let projects = [];

    function setDefaults() {
        //create the default project that no one can erase. 
        const defaultProj = getDefaultProject();
        defaultProj.addTask(getDefaultTask());
        projects.push(defaultProj);
        storage.setItem("projects", projects);
    }

    if (userObj === null) {
        // Greet new user!
        const name = w.prompt("Hey there stranger! You've reached Hana's To Do List App and to get started, I'll need to know what to call you:", "stranger");
        if (!name) { //user clicked cancel
            return;
        }
        // save this person's profile and display the app?
        userObj = createUser(name);
        storage.setItem("name", userObj);
        setDefaults();
    }

    // load existing user's todo lists
    if (projects.length === 0) {
        projects = storage.getItem("projects");
        if (projects) {
            projects = projects.map(el => reviveProject(el));
        } else {
            projects = [];
            setDefaults();
        }
    }
    console.log(projects);

    // now we have to set into motion some display updates
    const navPanel = new NavPanel(userObj, projects, document);
    navPanel.initDisplay();
}

todoList(window); //let's go


// what kind of data set will i create for a new user?
// todoist uses some initial todos set to a project called My Project and the first to do is 'add all my tasks' or something of that nature

//what kind of data will local storage have?

//my name (in future my account avatar)

//a list of my projects that I created (projects are lists of todo items)

//each project is a list of todo items. It has a name and a color.
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