import fs from "fs/promises";
import path from "path";

const dir = "src/main/resources/markdownsections";

const files = await fs.readdir(dir);
files.forEach(file => console.log(file));
