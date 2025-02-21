import { KnowledgeBaseEntry } from '../types';

function getCloseMatches(userQuestion: string, questions: string[], n: number = 1, cutoff: number = 0.6): string[] {
  const results: Array<[string, number]> = [];
  
  questions.forEach(question => {
    const similarity = calculateSimilarity(userQuestion.toLowerCase(), question.toLowerCase());
    if (similarity >= cutoff) {
      results.push([question, similarity]);
    }
  });

  results.sort((a, b) => b[1] - a[1]);
  return results.slice(0, n).map(result => result[0]);
}

function calculateSimilarity(s1: string, s2: string): number {
  const words1 = s1.split(' ');
  const words2 = s2.split(' ');
  
  let matches = 0;
  const totalWords = Math.max(words1.length, words2.length);
  
  words1.forEach(word => {
    if (words2.some(w => w.includes(word) || word.includes(w))) {
      matches++;
    }
  });

  return matches / totalWords;
}

export function findBestMatch(userQuestion: string, questions: KnowledgeBaseEntry[]): KnowledgeBaseEntry | null {
  const userQuestionLower = userQuestion.toLowerCase();
  
  // First try exact match
  const exactMatch = questions.find(
    q => q.question.toLowerCase() === userQuestionLower
  );
  if (exactMatch) return exactMatch;

  // Then try close matches using our similarity algorithm
  const questionStrings = questions.map(q => q.question);
  const closeMatches = getCloseMatches(userQuestion, questionStrings, 1, 0.6);
  
  if (closeMatches.length > 0) {
    return questions.find(q => q.question === closeMatches[0]) || null;
  }

  // Finally try word matching for partial matches
  const userWords = userQuestionLower.split(' ').filter(w => w.length > 3);
  let bestMatch: KnowledgeBaseEntry | null = null;
  let maxMatchingWords = 0;

  questions.forEach(entry => {
    const questionWords = entry.question.toLowerCase().split(' ');
    const matchingWords = userWords.filter(word => 
      questionWords.some(qWord => qWord.includes(word) || word.includes(qWord))
    ).length;

    if (matchingWords > maxMatchingWords) {
      maxMatchingWords = matchingWords;
      bestMatch = entry;
    }
  });

  return maxMatchingWords > 0 ? bestMatch : null;
}