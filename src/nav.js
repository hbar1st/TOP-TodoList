export class NavPanel {

    constructor(user, projects, docObj) {
        this.user = user;
        this.projects = projects;
        this.navEl = docObj.querySelector("nav");
        this.docObj = docObj;
    }

    refreshDisplay() {
        
    }
}