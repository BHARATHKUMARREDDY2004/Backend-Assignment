module.exports = {
  apps: [
    {
      name: "app",
      script: "app.js",
      instances: 3,
      exec_mode: "cluster",
    },
  ],
};
