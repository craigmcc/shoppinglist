const url ="?withCategory";
console.log("url", url);
const params = new URLSearchParams(url);
console.log("params", params);
const splits = new URLSearchParams(url.split("?")[1]);
console.log("splits", splits);
