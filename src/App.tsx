import CharacterCountsView from './views/CharacterCountsView'
import SubstitutionCipherView from './views/SubstitutionCipherView'
import TextAreaView from './views/TextAreaView'
import React, { useReducer } from 'react'

interface State {
  plainText: string
  cipherText: string
  code: { [key: string]: string }
}

interface Action {
  apply(state: State): State
}

function initializeModel(): State {
  return { plainText: '', cipherText: '', code: {} }
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

  getCodeLetter(plain: string): string {
    const code = this.data.code[plain]
    return code || ''
  }

  get setCodeLetter(): (plain: string, code: string) => void {
    return (plain, code) => {
      this.dispatchUpdate(new SetSubstitution(plain, code))
    }
  }

  get encrypt(): () => void {
    return () => this.dispatchUpdate(new Encrypt())
  }

  get decrypt(): () => void {
    return () => this.dispatchUpdate(new Decrypt())
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

class SetSubstitution {
  plain: string
  code: string
  constructor(plain: string, code: string) {
    this.plain = plain.toUpperCase()
    this.code = code.toUpperCase()
  }
  apply(data: State): State {
    const code = { ...data.code }
    if (this.code == '') {
      delete code[this.plain]
    } else {
      code[this.plain] = this.code
    }
    return { ...data, code }
  }
}

class Encrypt {
  apply(data: State): State {
    const cipherText = substitute(data.plainText, data.code)
    return { ...data, cipherText }
  }
}

class Decrypt {
  apply(data: State): State {
    const reverseCode = {} as { [key: string]: string }
    for (const [plain, code] of Object.entries(data.code)) {
      reverseCode[code] = plain
    }
    console.log(reverseCode)
    const plainText = substitute(data.cipherText, data.code)
    return { ...data, plainText }
  }
}

function substitute(text: string, mapping: { [key: string]: string }) {
  const chars = text.split('')
  const mappedChars = chars.map(
    (c) => mapping[c.toUpperCase()] || c.toLowerCase()
  )
  return mappedChars.join('')
}

function App() {
  const [state, sendModelMsg] = useReducer(updateModel, null, initializeModel)
  const appState = new AppState(state, sendModelMsg)

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <SubstitutionCipherView
            cipher={appState}
            setCodeLetter={appState.setCodeLetter}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-5">
          <TextAreaView
            label="Plain text"
            text={appState.plainText}
            changeText={appState.updatePlainText}
          />
        </div>
        <div className="col-sm-2">
          <br />
          <button
            type="button"
            className="btn btn-primary"
            onClick={appState.decrypt}>
            &larr; Decrypt
          </button>
          <br />
          <br />
          <button
            type="button"
            className="btn btn-primary"
            onClick={appState.encrypt}>
            Encrypt &rarr;
          </button>
          <br />
        </div>
        <div className="col-sm-5">
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
      <div className="row">
        <pre>{JSON.stringify(appState.data, null, ' ')}</pre>
      </div>
    </div>
  )
}

export default App
