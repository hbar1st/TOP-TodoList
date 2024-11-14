import { createTask, reviveTask } from "./task";

export { createProject, reviveProject, getDefaultProject };

//there is a default project that all tasks automatically get assigned to. Even if I remove the task from a project I made, under the covers, all tasks belong
// to this default project and cannot be removed from it (otherwise they'll be orphaned and I won't be able to retrieve them?)

function createProject(name, color, id = Date.now(), subTasks = []) {

    const getTasks = () => {
        return subTasks;
    }

    const addTask = (taskObj) => {
        subTasks.push(taskObj);
    }

    const delTask = (taskObj) => {
        subTasks = subTasks.filter((el) => el.id !== taskObj.id);
    }

    return { name, color, id, subTasks, getTasks, addTask, delTask };
}

function reviveProject(projObj) {
    // I don't need to revive the id because a string is fine for now
    const tasks = projObj.subTasks.map(el => reviveTask(el));
    const proj = createProject(projObj.name, projObj.color, Number(projObj.id), tasks);
    console.log("reviving: ", proj);
    return proj;
}

function getDefaultProject() {
    return createProject("My Tasks", "white", 0); // special id 0 means it cannot be edited or removed
}
