import framework from "./framework/framework.js";

window.addEventListener("hashchange", () => {
    framework.changeRoute();
});

framework.changeRoute();