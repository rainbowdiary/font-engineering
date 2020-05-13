const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("hello webpack");
  }, 1000);
  resolve()
})
  .then((resolve, reject) => {
    console.log("hello webpack3");
  })
console.log("hello");