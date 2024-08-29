import { merge } from "webpack-merge";
import commonConfig from "./webpack.config.js";

export default merge(commonConfig, {
  mode: "development",
});
