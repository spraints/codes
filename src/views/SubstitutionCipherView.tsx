import './SubstitutionCipherView.css'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface Cipher {
  getCodeLetter(plain: string): string
}

interface Props {
  cipher: Cipher
  setCodeLetter: (plain: string, code: string) => void
  reset: () => void
}

export default function SubstitutionCipherView(props: Props) {
  const { cipher, setCodeLetter, reset } = props
  const seen = {} as { [key: string]: number }
  for (const c of ALPHABET) {
    const x = cipher.getCodeLetter(c)
    if (seen[x]) {
      seen[x]++
    } else {
      seen[x] = 1
    }
  }
  return (
    <table>
      <tbody>
        <tr>
          <th>plain</th>
          {ALPHABET.map((c) => (
            <td key={c}>{c}</td>
          ))}
        </tr>
        <tr>
          <th>code</th>
          {ALPHABET.map((c) => [c, cipher.getCodeLetter(c)]).map(([c, x]) => (
            <td key={c}>
              <CodeLetter
                conflict={x.length > 0 && seen[x] ? seen[x] > 1 : false}
                code={x}
                onChange={(newX) => setCodeLetter(c, newX)}
              />
            </td>
          ))}
          <td>
            <button type="button" className="btn btn-danger" onClick={reset}>
              reset
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

function CodeLetter(props: {
  conflict: boolean
  code: string
  onChange: (newCode: string) => void
}) {
  const { conflict, code, onChange } = props
  const htmlClass = `form-control ${conflict ? 'is-invalid' : ''} substitution`
  return (
    <input
      className={htmlClass}
      type="text"
      value={code}
      onChange={(event) => onChange(event.target.value)}
      maxLength={1}
      size={1}
    />
  )
}
