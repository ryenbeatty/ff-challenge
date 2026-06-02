import type { TranscriptSentence } from "./meetings-types";

export type TranscriptUtterance = {
  id: string;
  speakerId: string;
  speakerName: string;
  startTime: number;
  endTime: number;
  text: string;
  sentenceIds: string[];
};

export function groupTranscriptUtterances(
  transcript: TranscriptSentence[],
): TranscriptUtterance[] {
  if (!transcript.length) {
    return [];
  }

  const utterances: TranscriptUtterance[] = [];
  let current = createUtteranceFromSentence(transcript[0]);

  for (let index = 1; index < transcript.length; index += 1) {
    const sentence = transcript[index];

    if (sentence.speakerId === current.speakerId) {
      current.text = `${current.text} ${sentence.text}`;
      current.endTime = sentence.endTime;
      current.sentenceIds.push(sentence.id);
      continue;
    }

    utterances.push(current);
    current = createUtteranceFromSentence(sentence);
  }

  utterances.push(current);
  return utterances;
}

function createUtteranceFromSentence(sentence: TranscriptSentence): TranscriptUtterance {
  return {
    id: sentence.id,
    speakerId: sentence.speakerId,
    speakerName: sentence.speakerName,
    startTime: sentence.startTime,
    endTime: sentence.endTime,
    text: sentence.text,
    sentenceIds: [sentence.id],
  };
}

export function findUtteranceForTimestamp(
  utterances: TranscriptUtterance[],
  timestampSeconds: number,
): TranscriptUtterance | undefined {
  if (!utterances.length || Number.isNaN(timestampSeconds)) {
    return undefined;
  }

  let match = utterances[0];
  for (const utterance of utterances) {
    if (utterance.startTime <= timestampSeconds) {
      match = utterance;
      continue;
    }
    break;
  }

  return match;
}
