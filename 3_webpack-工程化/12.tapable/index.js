const { SyncHook } = require("tapable");

// "arg1", "arg2", "arg3"为传递的三个参数
const hook = new SyncHook(["arg1", "arg2", "arg3"]);

hook.tap("hook1", (arvg1, arvg2, arvg3) => {
  console.log(arvg1, arvg2, arvg3);
});
hook.call(1, 2, 3);
