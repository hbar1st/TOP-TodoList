import { getDefaultProject } from "./project.js";
import { getDefaultTask } from "./task.js";
import { reviveProject } from "./project.js";

export { ProjectList };

class ProjectList {

    constructor(storage, projectStrings) {
        this.projects = {};
        this.storage = storage;
        if (projectStrings) {
            console.log({ projectStrings });
            for (const projKey in projectStrings) {
                console.log(projectStrings[projKey]);
                this.projects[projKey] = reviveProject(projectStrings[projKey]);
            }
        } else {
            const defaultProj = getDefaultProject();
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
        return (Object.keys(this.projects).length === 0);
    }

    getProjects() {
        return this.projects;
    }

    add(projObj) {
        this.projects[projObj.id] = projObj;
        this.storage.setItem("projects", this.projects);
    }

    getProj(id) {
        return this.projects[id];
    }

    delete(id) {
        delete this.projects[id];
        this.storage.setItem("projects", this.projects);
    }
}