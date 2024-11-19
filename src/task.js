import taskImage from "./assets/task.svg";
import completedTaskImage from "./assets/task-completed.svg";
import { format } from "date-fns/format";
import { isAfter, parseJSON } from "date-fns";

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
 * @param {*} completed 
 * @param {*} id 
 * @returns 
 */
function createTask(name, color, description, dueDate = `${(new Date()).toUTCString()}`, priority = "2", completed = false, id = `${Date.now()}`) {

    function toggleDone() {
        this.completed = !this.completed;
    }

    function getPriorityStr() {
        return this.priority;
    }

    function isPastDue() {
        if (getDueDateShort()) {
            const today = format(new Date(), "yyyy-MM-dd");
            const dueDate = this.getDueDateShort();
            console.log("compare today: ", today, " with due date: ", dueDate);
            return isAfter(today, dueDate);
        } else {
            return false;
        }
    }

    function hasDueDate() {
        return (this.dueDate !== "");
    }

    function setDueDate(dateObj) {
        this.dueDate = (new dateStr).toUTCString();
        dueDate = this.dueDate;
    }

    function getDueDateShort() {
        return this?.dueDate ? format(new Date(this.getDueDateStr()), "yyyy-MM-dd") : "";
    }
    function getDueDateStr() {
        return this.dueDate; //stored internally as utc string //format(new Date(this.dueDate), "yyyy-MM-dd"); // use local time for strings
    }

    function setDueDateStr(str) {
        if (str) {
            this.dueDate = (new Date(str)).toUTCString();   //use local format    
        } else {
            this.dueDate = "";
        }
        dueDate = this.dueDate;
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
    return { name, color, description, dueDate, priority, completed, id, toggleDone, isPastDue, getPriorityStr, getDueDateShort, setDueDate, setDueDateStr, hasDueDate, getDueDateStr, getTaskAltText, getTaskCircleImg };
}

function reviveTask(taskObj) {
    //const date = (taskObj.dueDate == "") ? "" : new Date(taskObj.dueDate); //my old way of reviving the date
    const date = (taskObj.dueDate === "") ? "" : (new Date(taskObj.dueDate)).toUTCString(); //parseJSON(taskObj.dueDate).toUTCString(); //TODO REFACTOR THIS!!!
    console.log("reviveTask is setting date to : ", date, " but originally it was: ",);
    const task = createTask(taskObj.name, taskObj.color, taskObj.description, date, taskObj.priority, taskObj.completed, taskObj.id);
    console.log("reviving duedate from: ", taskObj.dueDate, " to ", task.dueDate);
    return task;
}

function getDefaultTask() {
    return createTask("Add tasks", "#000000", "Add all your tasks");
}