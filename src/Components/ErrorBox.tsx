import React, { FC } from "react";
import "./ErrorBox.css";

const ErrorBox: FC<{ errorMessage: string }> = (props) => {
  return <div className="error">⚠️{props.errorMessage}</div>;
};

export default ErrorBox;
