export class ContentPanel {

    constructor(projects, docObj) {
        this.projects = projects;
        this.contentEl = docObj.querySelector("main");
        this.docObj = docObj;
    }

    refreshDisplay() {

    }
}