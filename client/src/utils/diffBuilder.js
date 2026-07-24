/**
 * Generates a unified diff array from before and after snippets,
 * matching issues to relevant lines.
 */
export function buildUnifiedDiff(beforeCode, afterCode, issues = []) {
  const beforeLines = (beforeCode || '').split('\n');
  const afterLines = (afterCode || '').split('\n');

  const diffLines = [];
  let oldLineNum = 1;
  let newLineNum = 1;

  // Track assigned issues so every issue gets anchored to a line
  const unassignedIssues = [...issues];

  // Helper to find matching issues for a line or category
  const getIssuesForLine = (lineContent, isRemoval) => {
    const matched = [];
    const lower = lineContent.toLowerCase();

    for (let i = unassignedIssues.length - 1; i >= 0; i--) {
      const issue = unassignedIssues[i];
      const descLower = issue.description.toLowerCase();

      // Check keyword overlap between issue description and code line
      const keywords = descLower.split(/\s+/).filter(w => w.length > 3);
      const hasOverlap = keywords.some(kw => lower.includes(kw));

      if (hasOverlap || isRemoval) {
        matched.push(issue);
        unassignedIssues.splice(i, 1);
      }
    }
    return matched;
  };

  // Simple unified diff algorithm
  const maxLen = Math.max(beforeLines.length, afterLines.length);

  for (let i = 0; i < maxLen; i++) {
    const bLine = beforeLines[i];
    const aLine = afterLines[i];

    if (bLine !== undefined && aLine !== undefined) {
      if (bLine === aLine) {
        diffLines.push({
          type: 'context',
          oldLine: oldLineNum++,
          newLine: newLineNum++,
          content: bLine,
          issues: []
        });
      } else {
        // Line modified: show removal then addition
        const lineIssues = getIssuesForLine(bLine, true);
        diffLines.push({
          type: 'remove',
          oldLine: oldLineNum++,
          newLine: null,
          content: bLine,
          issues: lineIssues
        });
        diffLines.push({
          type: 'add',
          oldLine: null,
          newLine: newLineNum++,
          content: aLine,
          issues: []
        });
      }
    } else if (bLine !== undefined) {
      const lineIssues = getIssuesForLine(bLine, true);
      diffLines.push({
        type: 'remove',
        oldLine: oldLineNum++,
        newLine: null,
        content: bLine,
        issues: lineIssues
      });
    } else if (aLine !== undefined) {
      diffLines.push({
        type: 'add',
        oldLine: null,
        newLine: newLineNum++,
        content: aLine,
        issues: []
      });
    }
  }

  // If any unassigned issues remain, attach to the first removal or first line
  if (unassignedIssues.length > 0) {
    const targetIdx = diffLines.findIndex(l => l.type === 'remove') >= 0
      ? diffLines.findIndex(l => l.type === 'remove')
      : 0;

    if (diffLines[targetIdx]) {
      diffLines[targetIdx].issues.push(...unassignedIssues);
    }
  }

  return diffLines;
}
