import { ChangeEvent } from 'react'

interface PlainTextViewState {
  plainText: string
  updatePlainText: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

type PlainTextViewProps = {
  state: PlainTextViewState
}

export default function PlainTextView(props: PlainTextViewProps) {
  const { state } = props
  return (
    <div>
      <b>Plain text</b>
      <textarea
        className="form-control"
        placeholder="plain text"
        onChange={state.updatePlainText}
        value={state.plainText}></textarea>
    </div>
  )
}
