import "../scss/app.scss";
import "../scss/demo.scss";

window["RectAnnotate" as any] = require("./classes/RectAnnotate").default;

if (module && module.hot) module.hot.accept();
