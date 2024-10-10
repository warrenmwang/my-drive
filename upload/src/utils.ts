import { ZodError } from "zod";
import { Chunk } from "./schema";
import fs from "node:fs";

export function concatChunksOrderly(chunks: Chunk[]): Buffer {
  // throw error if number of chunks is not equal to expected
  if (chunks.length === 0)
    throw new Error("cannot construct a file with 0 chunks");
  if (chunks[0].totalChunks !== chunks.length)
    throw new Error(
      "mismatch expected total number of chunks and the given number of chunks at call time to create file",
    );

  // Create array of chunks in order
  const tmp = Array.from({ length: chunks.length }).fill(null);
  for (const chunk of chunks) {
    if (chunk.chunkIndex < 0 || chunk.chunkIndex > chunks.length - 1)
      throw new Error(
        `chunk index ${chunk.chunkIndex} is out of range [0, ${chunks.length - 1}]`,
      );
    tmp[chunk.chunkIndex] = chunk;
  }
  // ensure no nulls, else throw error
  if (tmp.includes(null))
    throw new Error("missing chunks in order to construct file");

  // Construct file from array of chunks
  const chunksInOrder = tmp as Chunk[];
  return Buffer.concat(chunksInOrder.map((chunk) => chunk.buffer));
}

export function writeToFile(file: Buffer, path: string): void {
  fs.writeFileSync(path, file);
}

export function consoleLogError(err: Error | ZodError) {
  console.log(`[UPLOAD]: Error - ${err.message}`);
}
