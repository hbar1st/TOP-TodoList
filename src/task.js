import taskImage from "./assets/task.svg";
import completedTaskImage from "./assets/task-completed.svg";
import { format } from "date-fns/format";
import { isAfter } from "date-fns";
import { UTCDate } from "@date-fns/utc";

export { createTask, reviveTask, getDefaultTask, makeUTCString };

//use composition for this since it may get more features in the future
export const priorityStrings = { 0: "low", 1: "medium", 2: "high" };

/**
 *
 * @param {*} name
 * @param {*} color
 * @param {*} description
 * @param {*} dueDate must be a string in utc format
 * @param {*} priority an index number 0 for low, 1 for medium and 2 for high
 * @param {*} completed
 * @param {*} id
 * @returns
 */
function createTask(
  name,
  color,
  description,
  dueDate = makeUTCString(),
  priority = "2",
  completed = false,
  id = `${Date.now()}`
) {
  function toggleDone() {
    this.completed = !this.completed;
  }

  function isPastDue() {
    if (this.dueDate && this.dueDate !== "Invalid Date") {
      const today = format(new Date(), "yyyy-MM-dd");
      const dueDate = this.getDueDateShort();
      return isAfter(today, dueDate);
    } else {
      return false;
    }
  }

  function hasDueDate() {
    return this.dueDate !== "";
  }

  function getDueDateShort() {
    return dueDate ? format(new UTCDate(dueDate), "yyyy-MM-dd") : "";
  }

  function setDueDateStr(str) {
    if (str) {
      this.dueDate = makeUTCString(str);
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
  return {
    name,
    color,
    description,
    dueDate,
    priority,
    completed,
    id,
    toggleDone,
    isPastDue,
    getDueDateShort,
    setDueDateStr,
    hasDueDate,
    getTaskAltText,
    getTaskCircleImg,
  };
}

function reviveTask(taskObj) {
  const date = taskObj.dueDate === "" ? "" : makeUTCString(taskObj.dueDate);
  const task = createTask(
    taskObj.name,
    taskObj.color,
    taskObj.description,
    date,
    taskObj.priority,
    taskObj.completed,
    taskObj.id
  );
  return task;
}

function getDefaultTask() {
  return createTask("Add tasks", "#000000", "Add all your tasks");
}

function makeUTCString(date = new Date()) {
  if (date instanceof Date) {
    return date.toUTCString();
  } else {
    // assume it is a string
    return new Date(date).toUTCString();
  }
}
