import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const publicFolder = "public";

app.use(express.static(path.join(__dirname, publicFolder)));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, publicFolder, "index.html"));
});

const PORT = 3869;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});