import { reviveTask } from "./task";
import { isSameDay } from "date-fns";
import { utc } from "@date-fns/utc";

export { createProject, reviveProject, getDefaultProject };

//there is a default project that all tasks automatically get assigned to. Even if I remove the task from a project I made, under the covers, all tasks belong
// to this default project and cannot be removed from it (otherwise they'll be orphaned and I won't be able to retrieve them?)

function createProject(name, color, id = `${Date.now()}`, subTasks = {}) {

    const getTasks = () => {
        return subTasks;
    }

    const getTasksByDate = (utcdate) => {
        let todaysTasks = {};
        for (const taskId in subTasks) {
            if (isSameDay(new Date(subTasks[taskId].dueDate), utcdate, { in: utc })) {
                todaysTasks[taskId] = subTasks[taskId];
            }
        }
        return todaysTasks;
    }

    const setTasks = (tasks) => {
        subTasks = tasks;
    }

    function addTask(taskObj) {
        subTasks[taskObj.id] = taskObj;
        this.subTasks[taskObj.id] = taskObj;
    }

    const getTask = (id) => {
        return subTasks[id];
    }

    function delTask(taskId) {
        delete subTasks[taskId];
        delete this.subTasks[taskId];
    }

    const toggleDone = (taskId) => {
        subTasks[taskId].toggleDone();
    }

    return { name, color, id, subTasks, getTasks, getTask, setTasks, addTask, delTask, toggleDone, getTasksByDate };
}

function reviveProject(projObj) {
    // I don't need to revive the id because a string is fine for now
    const tasks = {};
    for (const taskKey in projObj.subTasks) {
        tasks[taskKey] = reviveTask(projObj.subTasks[taskKey]);
    }
    const proj = createProject(projObj.name, projObj.color, Number(projObj.id), tasks);
    return proj;
}

function getDefaultProject() {
    return createProject("My Tasks", "#ffffff", 0); // special id 0 means it cannot be edited or removed
}
