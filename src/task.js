export { createTask, reviveTask };

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
function createTask(name, color, description, dueDate, priority, completed = false, id = Date.now()) {

    const markDone = () => {
        completed = true;
    }

    const pastDue = () => {
        return false; // TODO figure out if the task is past due
    }

    return { name, color, description, dueDate, priority, completed, id, markDone };
}

function reviveTask(taskObj) {
    const task = createTask(taskObj.name, taskObj.color, taskObj.description, new Date(taskObj.dueDate), taskObj.priority, taskObj.completed, taskObj.id);
    console.log("reviving task: ", task);
    return task;
}