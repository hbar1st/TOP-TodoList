import {createUser} from "./user.js";

console.log("gotta start somewhere");



//how do I know if someone is new or not?
//check localStorage?

//if no name stored there, then assume this is a new person and present a splash screen?

//what kind of data will local storage have?

//my name

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