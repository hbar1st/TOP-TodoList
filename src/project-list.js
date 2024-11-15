import { getDefaultProject } from "./project.js";
import { getDefaultTask, priorityStrings } from "./task.js";

export { ProjectList };

class ProjectList {

    constructor(projectStrings) {
        this.projects = {};
        if (projectStrings) {
            for (projKey in projectStrings) {
                this.projects[projKey] = reviveProject(this.projects[projKey]);
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
    }

    getProj(id) {
        return this.projects[id];
    }

    delete(id) {
        delete this.projects[id];
    }
}