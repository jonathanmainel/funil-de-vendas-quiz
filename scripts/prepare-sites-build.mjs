import { access, cp, mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";

const outputDirectory = "dist";
const generatedDirectories = (await readdir(outputDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

let generatedWorkerDirectory;
for (const directory of generatedDirectories) {
  try {
    await access(join(outputDirectory, directory, "wrangler.json"));
    generatedWorkerDirectory = directory;
    break;
  } catch {
    // A pasta não contém a saída do worker.
  }
}

if (!generatedWorkerDirectory) {
  throw new Error("O worker de publicação não foi gerado.");
}

const source = join(outputDirectory, generatedWorkerDirectory, "index.js");
const destination = join(outputDirectory, "server", "index.js");

await mkdir(join(outputDirectory, "server"), { recursive: true });
await cp(source, destination, { force: true });
