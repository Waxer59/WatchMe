export function formatViewersCountShort(count: number) {
  if (count < 1000) {
    return count
  }

  const suffixes = ['', 'k', 'm', 'b', 't']
  const suffixNum = Math.floor(('' + count).length / 3)
  const shortCount = parseFloat(('' + count).substr(0, suffixNum))
  const shortSuffix = suffixes[suffixNum]

  if (shortSuffix === 'k') {
    return `${shortCount.toLocaleString()}${shortSuffix}`
  }

  return `${shortCount.toLocaleString()}${shortSuffix}`
}