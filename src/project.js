import { reviveTask } from "./task";

export { createProject, reviveProject, getDefaultProject };

//there is a default project that all tasks automatically get assigned to. Even if I remove the task from a project I made, under the covers, all tasks belong
// to this default project and cannot be removed from it (otherwise they'll be orphaned and I won't be able to retrieve them?)

function createProject(name, color, id = `${Date.now()}`, subTasks = {}) {

    const getTasks = () => {
        return subTasks;
    }

    const setTasks = (tasks) => {
        subTasks = tasks;
    }

    const addTask = (taskObj) => {
        subTasks[taskObj.id] = taskObj;
    }

    const delTask = (taskObj) => {
        //todo
    }

    const toggleDone = (taskId) => {
        subTasks[taskId].toggleDone();
    }

    return { name, color, id, subTasks, getTasks, setTasks, addTask, delTask, toggleDone };
}

function reviveProject(projObj) {
    // I don't need to revive the id because a string is fine for now
    const tasks = {};
    for (const taskKey in projObj.subTasks) {
        tasks[taskKey] = reviveTask(projObj.subTasks[taskKey]);
    }
    const proj = createProject(projObj.name, projObj.color, Number(projObj.id), tasks);
    console.log("reviving: ", proj);
    return proj;
}

function getDefaultProject() {
    return createProject("My Tasks", "#ffffff", 0); // special id 0 means it cannot be edited or removed
}
