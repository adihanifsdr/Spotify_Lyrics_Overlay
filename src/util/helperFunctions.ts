function formatTime(ms: number | undefined): string {
  if (!ms) return '0:00'
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

function getCallSpeed(tempo: number | undefined): number {
  if (!tempo) return 500
  if (tempo > 120) return 300
  if (tempo > 100) return 400
  return 500
}

export { formatTime, getCallSpeed } 