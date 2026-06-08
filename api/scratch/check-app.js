import app from '../src/app.js';
console.log('App imported successfully!');
console.log('Routes registered:');
app.routes.forEach(r => {
    console.log(`- [${r.method}] ${r.path}`);
});
