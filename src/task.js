import taskImage from "./assets/task.svg";
import completedTaskImage from "./assets/task-completed.svg";
import { UTCDate } from "@date-fns/utc";
import { format } from "date-fns";


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
function createTask(name, color, description, dueDate = `${new UTCDate()}`, priority = "2", completed = false, id = `${Date.now()}`) {

    function toggleDone() {
        this.completed = !this.completed;
    }

    function getPriorityStr() {
        return this.priority;
    }
    
    function pastDue() {
        return false; // TODO figure out if the task is past due
    }

    function hasDueDate() {
        return (this.dueDate !== "");
    }

    function getDueDateStr() {
        return format(new UTCDate(this.dueDate), "yyyy-MM-dd");
    }

    function getTaskAltText() {
        if (this.completed) {
            return "Task marked as done";
        } else {
            return "Task not done";
        }
    }

    function getTaskCircleImg() {

        if (this.completed) {
            return `${completedTaskImage}`;
        } else {
            return `${taskImage}`;
        }
    }
    return { name, color, description, dueDate, priority, completed, id, toggleDone, getPriorityStr, hasDueDate, getDueDateStr, getTaskAltText, getTaskCircleImg };
}

function reviveTask(taskObj) {
    const date = (taskObj.dueDate == "") ? "" : new UTCDate(taskObj.dueDate);
    const task = createTask(taskObj.name, taskObj.color, taskObj.description, date, taskObj.priority, taskObj.completed, taskObj.id);
    console.log("reviving task: ", task);
    return task;
}

function getDefaultTask() {
    return createTask("Add tasks", "#000000", "Add all your tasks");
}