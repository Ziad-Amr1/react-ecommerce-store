export function getFileSignature(file) {
  if (!file) return "";

  return `${file.name ?? ""}-${file.type ?? ""}-${file.size ?? 0}-${file.lastModified ?? 0}`;
}

export function filterDuplicateFiles(files = [], existingFiles = []) {
  const seen = new Set();

  (existingFiles || []).forEach((file) => {
    const signature = getFileSignature(file);

    if (signature) {
      seen.add(signature);
    }
  });

  return (files || []).filter((file) => {
    const signature = getFileSignature(file);

    if (!signature || seen.has(signature)) {
      return false;
    }

    seen.add(signature);
    return true;
  });
}
