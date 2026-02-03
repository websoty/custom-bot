import path from "path";

export function resolveAssetPath(relativePath: string) {
  return path.resolve(process.cwd(), relativePath);
}
