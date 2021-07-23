import { Cipher, ReplacementCipher } from './Model'
import TODO from './TODO'
import React, { useReducer } from 'react'

const CipherView = TODO
const PlainTextView = TODO
const CipherTextView = TODO
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
  return action.apply(model)
}

class AppState {
  data: State
  dispatchUpdate: React.Dispatch<Action>

  constructor(data: State, dispatchUpdate: React.Dispatch<Action>) {
    this.data = data
    this.dispatchUpdate = dispatchUpdate
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
