type Props = {
  label: string
  disableAutoCorrect?: boolean
  text: string
  changeText: (s: string) => void
}

export default function TextAreaView(props: Props) {
  const { label, disableAutoCorrect, text, changeText } = props
  const ac = disableAutoCorrect ? 'off' : 'on'
  const sc = disableAutoCorrect ? 'false' : 'true'
  return (
    <div>
      <b>{label}</b>
      <textarea autoComplete={ac} autoCorrect={ac} autoCapitalize={ac} spellCheck={sc}
        className="form-control"
        onChange={(event) => changeText(event.target.value)}
        rows={5}
        value={text}/>
    </div>
  )
}
