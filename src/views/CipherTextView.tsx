import { ChangeEvent } from 'react'

interface CipherTextViewState {
  cipherText: string
  updateCipherText: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

type CipherTextViewProps = {
  state: CipherTextViewState
}

export default function PlainTextView(props: CipherTextViewProps) {
  const { state } = props
  return (
    <div>
      <b>Cipher text</b>
      <textarea
        className="form-control"
        placeholder="plain text"
        onChange={state.updateCipherText}>
        {state.cipherText}
      </textarea>
    </div>
  )
}
