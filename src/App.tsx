import { Cipher, ReplacementCipher } from './Model'
import TODO from './TODO'
import CipherTextView from './views/CipherTextView'
import PlainTextView from './views/PlainTextView'
import React, { ChangeEvent, useReducer } from 'react'

const CipherView = TODO
const CharacterCountsView = TODO

interface State {
  cipher: Cipher
  plainText: string
  cipherText: string
}

interface Action {
  apply(state: State): State
}

function initializeModel(): State {
  return { cipher: new ReplacementCipher([]), plainText: '', cipherText: '' }
}

function updateModel(model: State, action: Action) {
  const newModel = action.apply(model)
  console.log(newModel)
  return newModel
}

class AppState {
  data: State
  dispatchUpdate: React.Dispatch<Action>

  constructor(data: State, dispatchUpdate: React.Dispatch<Action>) {
    this.data = data
    this.dispatchUpdate = dispatchUpdate
  }

  get plainText(): string {
    return this.data.plainText
  }

  get updatePlainText(): (event: ChangeEvent<HTMLTextAreaElement>) => void {
    return (event) => {
      this.dispatchUpdate(new UpdatePlainText(event.target.value))
    }
  }

  get cipherText(): string {
    return this.data.cipherText
  }

  get updateCipherText(): (event: ChangeEvent<HTMLTextAreaElement>) => void {
    return (event) => {
      this.dispatchUpdate(new UpdateCipherText(event.target.value))
    }
  }
}

class UpdatePlainText {
  newPlainText: string
  constructor(newPlainText: string) {
    this.newPlainText = newPlainText
  }
  apply(data: State): State {
    return { ...data, plainText: this.newPlainText }
  }
}

class UpdateCipherText {
  newCipherText: string
  constructor(newCipherText: string) {
    this.newCipherText = newCipherText
  }
  apply(data: State): State {
    return { ...data, cipherText: this.newCipherText }
  }
}

function App() {
  const [state, sendModelMsg] = useReducer(updateModel, null, initializeModel)
  const appState = new AppState(state, sendModelMsg)

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <CipherView state={appState} />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <PlainTextView state={appState} />
        </div>
        <div className="col-sm-6">
          <CipherTextView state={appState} />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <CharacterCountsView state={appState} />
        </div>
      </div>
    </div>
  )
}

export default App
