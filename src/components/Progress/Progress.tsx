interface ProgressProps {
    value: number,
    maxValue: number
}

function Progress({value, maxValue}: ProgressProps) {
  return (
    <progress className="max-w-4xl h-3 progress progress-primary" value={value} max={maxValue}></progress>
  )
}

export default Progress