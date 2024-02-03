module.exports = {
  apps: [{
    name: "app", 
    script: "app.js",
    instances: "max",     
    autorestart: true, 
    watch: false,    
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "development", 
      JWT_SECRET: "dev-secret"  
 },
    env_production: {
      NODE_ENV: "production", 
      JWT_SECRET: "prod-secret" 
    }
  }]
};
