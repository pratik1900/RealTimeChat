import React from "react";

import classes from "./Spinner.module.css";

const Spinner = () => (
  <div className={classes.Container}>
    <div className={classes.Loader}>Loading...</div>
  </div>
);

export default Spinner;
