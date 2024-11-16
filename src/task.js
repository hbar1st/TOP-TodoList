import taskImage from "./assets/task.svg";
import completedTaskImage from "./assets/task-completed.svg";
export { createTask, reviveTask, getDefaultTask };

//use composition for this since it may get more features in the future
export const priorityStrings = { 0: "low", 1: "medium", 2: "high" };

/**
 * 
 * @param {*} name 
 * @param {*} color 
 * @param {*} description 
 * @param {*} dueDate 
 * @param {*} priority an index number 0 for low, 1 for medium and 2 for high
 * @returns 
 */
function createTask(iname, icolor, idescription, idueDate = `${new Date()}`, ipriority = priorityStrings["2"], icompleted = false, iid = `${Date.now()}`) {

    let completed = icompleted;
    let priority = ipriority;
    let name = iname;
    let color = icolor;
    let description = idescription;
    let id = iid;
    let dueDate = idueDate;

    function toggleDone() {
        completed = !completed;
    }

    function pastDue() {
        return false; // TODO figure out if the task is past due
    }

    function getTaskAltText() {
        if (completed) {
            return "Task marked as done";
        } else {
            return "Task not done";
        }
    }

    function getTaskCircleImg() {

        if (completed) {
            return `${completedTaskImage}`;
        } else {
            return `${taskImage}`;
        }
    }
    return { name, color, description, dueDate, priority, completed, id, toggleDone, getTaskAltText, getTaskCircleImg };
}

function reviveTask(taskObj) {
    const task = createTask(taskObj.name, taskObj.color, taskObj.description, new Date(taskObj.dueDate), taskObj.priority, taskObj.completed, taskObj.id);
    console.log("reviving task: ", task);
    return task;
}

function getDefaultTask() {
    return createTask("Add tasks", "pink", "Add all your tasks");
}