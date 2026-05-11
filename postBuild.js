import { execSync } from "child_process";
import path from "path";

function buildVite(dir) {
    const absolutePath = path.resolve(dir);

    try {
        execSync('npm install -D vite', { cwd: absolutePath, encoding: 'utf-8'});
        execSync('npm run build', { cwd: absolutePath, encoding: 'utf-8' });
    } catch (err) {
        console.log(err);
    }
}

buildVite("vi-web-site");