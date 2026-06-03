function tokenize(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function chunkWords(words: string[]): string[][] {
  const chunks: string[][] = [];
  let index = 0;
  let chunkIndex = 0;

  while (index < words.length) {
    const size = Math.min(1 + (chunkIndex % 2), words.length - index);
    chunks.push(words.slice(index, index + size));
    index += size;
    chunkIndex += 1;
  }

  return chunks;
}

export function streamCannedResponse(
  fullText: string,
  onUpdate: (partial: string) => void,
  onComplete: () => void,
): () => void {
  const words = tokenize(fullText);

  if (!words.length) {
    onComplete();
    return () => undefined;
  }

  const chunks = chunkWords(words);
  let chunkIndex = 0;
  let partial = "";
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  function scheduleNext() {
    if (chunkIndex >= chunks.length) {
      onComplete();
      return;
    }

    const delay = 40 + Math.round(Math.random() * 20);
    timeoutId = setTimeout(() => {
      partial += (partial ? " " : "") + chunks[chunkIndex].join(" ");
      chunkIndex += 1;
      onUpdate(partial);

      if (chunkIndex < chunks.length) {
        scheduleNext();
      } else {
        onComplete();
      }
    }, delay);
  }

  scheduleNext();

  return () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  };
}
