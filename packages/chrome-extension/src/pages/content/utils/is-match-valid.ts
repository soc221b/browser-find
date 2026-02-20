export default function isMatchValid(match: { ranges: Range[] }): boolean {
  if (match.ranges.length === 0) {
    return false;
  }

  return match.ranges.every((range) => {
    return range.startContainer.isConnected && range.endContainer.isConnected && !range.collapsed;
  });
}
