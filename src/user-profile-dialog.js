export { UserProfileDialog };

class UserProfileDialog {
  constructor(docObj, navPanel, contentPanel, user) {
    this.user = user;
    this.docObj = docObj;
    this.navPanel = navPanel;
    this.contentPanel = contentPanel;

    this.userNameInputEl = this.docObj.querySelector("#user-name");
    this.saveBtn = this.docObj.querySelector("#user-profile-modal .save");
    this.saveBtn.addEventListener("click", this.updateProfile.bind(this));

    this.defaultThemeBtn = this.docObj.querySelector(
      "#user-profile-modal #default"
    );
    this.darkThemeBtn = this.docObj.querySelector("#user-profile-modal #dark");

    this.defaultThemeBtn.addEventListener("click", this.switchTheme.bind(this));
    this.darkThemeBtn.addEventListener("click", this.switchTheme.bind(this));
  }

  updateProfile() {
    this.user.name = this.userNameInputEl.value;
    const userDialog = this.docObj.querySelector("#user-profile-modal");
    this.navPanel.updateProfileName(this.userNameInputEl.value);
    this.navPanel.updateStorage();
    userDialog.close();
  }

  /**
   * loads the user data into the user profile edit dialog modal
   */
  loadProfile() {
    this.userNameInputEl.value = this.user.name;
  }

  switchTheme(e) {
    const bodyEl = this.docObj.querySelector("body");
    const mainEl = this.docObj.querySelector("main");
    const theme = (e && e.target.id) ?? this.user.theme;

    if (theme === "dark") {
      bodyEl.style.background =
        "repeating-conic-gradient(rgb(57, 1, 14) 0%,rgb(214, 219, 210) 15%,rgb(57, 1, 14) 33%)";
      mainEl.style.backgroundColor = "rgb(255 249 243)";
    } else {
      //use default theme colors
      bodyEl.style.background =
        "repeating-conic-gradient(rgb(231, 90, 124) 0%,rgb(214, 219, 210) 15%,rgb(231, 90, 124) 33%)";
      mainEl.style.backgroundColor = "rgb(255 246 243)";
    }

    this.user.theme = theme;
  }
}
