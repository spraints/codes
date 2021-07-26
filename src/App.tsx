import { Cipher, ReplacementCipher } from './Model'
import CharacterCountsView from './views/CharacterCountsView'
import SubstitutionCipherView from './views/SubstitutionCipherView'
import TextAreaView from './views/TextAreaView'
import React, { useReducer } from 'react'

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

  get updatePlainText(): (s: string) => void {
    return (s) => {
      this.dispatchUpdate(new UpdatePlainText(s))
    }
  }

  get cipherText(): string {
    return this.data.cipherText
  }

  get updateCipherText(): (s: string) => void {
    return (s) => {
      this.dispatchUpdate(new UpdateCipherText(s))
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
          <SubstitutionCipherView />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <TextAreaView
            label="Plain text"
            text={appState.plainText}
            changeText={appState.updatePlainText}
          />
        </div>
        <div className="col-sm-6">
          <TextAreaView
            label="Cipher text"
            text={appState.cipherText}
            changeText={appState.updateCipherText}
            disableAutoCorrect={true}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <CharacterCountsView text={appState.cipherText} />
        </div>
      </div>
    </div>
  )
}

export default App
