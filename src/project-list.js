import { makeDefaultProject } from "./project.js";
import { getDefaultTask } from "./task.js";
import { reviveProject } from "./project.js";

export { ProjectList };

class ProjectList {
  constructor(storage, projectStrings) {
    this.projects = {};
    this.storage = storage;
    if (projectStrings) {
      for (const projKey in projectStrings) {
        this.projects[projKey] = reviveProject(projectStrings[projKey]);
      }
    } else {
      const defaultProj = makeDefaultProject();
      defaultProj.addTask(getDefaultTask());
      this.add(defaultProj);
    }
  }

  forEach(callback) {
    for (const projKey in this.projects) {
      callback(this.projects[projKey]);
    }
  }

  isBlank() {
    return Object.keys(this.projects).length === 0;
  }

  getProjects() {
    return this.projects;
  }

  add(projObj) {
    //adds or replaces
    this.projects[projObj.id] = projObj;
    this.updateStorage();
  }

  updateStorage() {
    this.storage.setItem("projects", this.projects);
  }

  getProj(id) {
    return this.projects[id];
  }

  getAllTasksByDate(utcdate) {
    return Object.values(this.projects).reduce((acc, el) => {
      acc[el.id] = el.getTasksByDate(utcdate);
      return acc;
    }, {});
  }

  deleteProject(id) {
    delete this.projects[id];
    this.storage.setItem("projects", this.projects);
  }
}
