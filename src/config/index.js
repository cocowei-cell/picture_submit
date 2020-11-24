// 开发模式
// dev为开发模式 pro为线上模式 打包前记得改动模式
const model = "pro";
// 开发地址
const Dev = {
  mainURL: "http://localhost:3000",
  staticURL: "http://localhost:8080",
};
// 线上地址
const Pro = {
  mainURL: "http://182.92.120.217:6197",
  staticURL: "http://182.92.120.217:8197",
};

let config = {};
model == "dev" ? (config = { ...Dev }) : (config = { ...Pro });

export default config;
