import './SubstitutionCipherView.css'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface Cipher {
  getCodeLetter(plain: string): string
  getPlainLetter(code: string): string
}

interface Props {
  cipher: Cipher
  setCodeLetter: (plain: string, code: string) => void
}

export function SubstitutionCipherView(props: Props) {
  const { cipher, setCodeLetter } = props
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
        </tr>
      </tbody>
    </table>
  )
}

export function SubstitutionPlainView(props: Props) {
  const { cipher, setCodeLetter } = props
  const seen = {} as { [key: string]: number }
  for (const c of ALPHABET) {
    const x = cipher.getPlainLetter(c)
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
          {ALPHABET.map((x) => [cipher.getPlainLetter(x), x]).map(([c, x]) => (
            <td key={x}>
              <CodeLetter
                conflict={c.length > 0 && seen[c] ? seen[c] > 1 : false}
                code={c}
                onChange={(newC) => setCodeLetter(newC, x)}
              />
            </td>
          ))}
        </tr>
        <tr>
          <th>code</th>
          {ALPHABET.map((c) => (
            <td key={c}>{c}</td>
          ))}
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
