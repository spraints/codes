import LetterFrequencies from '../LetterFrequencies'

interface Props {
  text: string
}

function countCharacters(text: string) {
  const counts = {} as { [key: string]: { letter: string; count: number } }
  for (const c of text.toUpperCase()) {
    if (!counts[c]) {
      counts[c] = { letter: c, count: 1 }
    } else {
      counts[c].count++
    }
  }
  const ret = []
  for (const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    ret.push(counts[c] || { letter: c, count: 0, percent: 0 })
  }
  const letters = ret.reduce((n, x) => n + x.count, 0)
  ret.sort((a, b) => b.count - a.count)
  return ret.map((x) => ({ percent: (100 * x.count) / letters, ...x }))
}

export default function CharacterCountsView(props: Props) {
  const frequencies = countCharacters(props.text)
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th colSpan={2}>Common letters</th>
            <th colSpan={3}>Letters in message</th>
          </tr>
        </thead>
        <tbody>
          {frequencies.map((x, i) => (
            <tr key={i}>
              <td>{LetterFrequencies[i].letter}</td>
              <td>{LetterFrequencies[i].percent.toFixed(1)}%</td>
              <td>{x.letter}</td>
              <td>{x.count}</td>
              <td>{x.percent.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
