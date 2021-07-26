import CharacterCountsView from './views/CharacterCountsView'
import {
  SubstitutionCipherView,
  SubstitutionPlainView,
} from './views/SubstitutionCipherView'
import TextAreaView from './views/TextAreaView'
import classNames from 'classnames'
import React, { useReducer } from 'react'

interface State {
  mode: 'MANUAL' | 'AUTODECRYPT' | 'AUTOENCRYPT'
  cipherMode: 'PLAIN' | 'CRYPTED'
  plainText: string
  cipherText: string
  code: { [key: string]: string }
}

interface Action {
  apply(state: State): State
}

function initializeModel(): State {
  return {
    mode: 'MANUAL',
    cipherMode: 'CRYPTED',
    plainText: '',
    cipherText: '',
    code: {},
  }
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

  get reset(): () => void {
    return () => this.dispatchUpdate(new Reset())
  }

  get plainText(): string {
    return this.data.plainText
  }

  get updatePlainText(): (s: string) => void {
    return (s) => {
      this.dispatchUpdate(this.maybeAutoEncrypt(new UpdatePlainText(s)))
    }
  }

  get cipherText(): string {
    return this.data.cipherText
  }

  get updateCipherText(): (s: string) => void {
    return (s) => {
      this.dispatchUpdate(this.maybeAutoDecrypt(new UpdateCipherText(s)))
    }
  }

  getCodeLetter(plain: string): string {
    const code = this.data.code[plain]
    return code || ''
  }

  getPlainLetter(code: string): string {
    for (const [c, x] of Object.entries(this.data.code)) {
      if (x === code) {
        return c
      }
    }
    return ''
  }

  get setCodeLetter(): (plain: string, code: string) => void {
    return (plain, code) => {
      this.dispatchUpdate(this.maybeAuto(new SetSubstitution(plain, code)))
    }
  }

  get encrypt(): () => void {
    return () => this.dispatchUpdate(new Encrypt())
  }

  get decrypt(): () => void {
    return () => this.dispatchUpdate(new Decrypt())
  }

  get switchCipherMode(): () => void {
    return () => this.dispatchUpdate(new SwitchCipherMode())
  }

  get manual(): boolean {
    return this.data.mode === 'MANUAL'
  }

  get autoEncrypt(): boolean {
    return this.data.mode === 'AUTOENCRYPT'
  }

  get autoDecrypt(): boolean {
    return this.data.mode === 'AUTODECRYPT'
  }

  setMode(mode: 'MANUAL' | 'AUTOENCRYPT' | 'AUTODECRYPT'): () => void {
    return () => this.dispatchUpdate(new SetMode(mode))
  }

  private maybeAuto(action: Action): Action {
    return this.maybeAutoEncrypt(this.maybeAutoDecrypt(action))
  }

  private maybeAutoDecrypt(action: Action): Action {
    if (this.autoDecrypt) {
      return new MultiAction(action, new Decrypt())
    }
    return action
  }

  private maybeAutoEncrypt(action: Action): Action {
    if (this.autoEncrypt) {
      return new MultiAction(action, new Encrypt())
    }
    return action
  }
}

class MultiAction {
  actions: Action[]
  constructor(...actions: Action[]) {
    this.actions = actions
  }
  apply(data: State): State {
    return this.actions.reduce((data, action) => action.apply(data), data)
  }
}

class Reset {
  apply(data: State): State {
    return { ...data, mode: 'MANUAL', code: {} }
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
    if (this.code === '') {
      delete code[this.plain]
    } else if (this.plain === '') {
      for (const [c, x] of Object.entries(code)) {
        if (x === this.code) {
          delete code[c]
          break
        }
      }
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
    const plainText = substitute(data.cipherText, reverseCode)
    return { ...data, plainText }
  }
}

class SetMode {
  mode: 'MANUAL' | 'AUTOENCRYPT' | 'AUTODECRYPT'
  constructor(mode: 'MANUAL' | 'AUTOENCRYPT' | 'AUTODECRYPT') {
    this.mode = mode
  }
  apply(data: State): State {
    return { ...data, mode: this.mode }
  }
}

class SwitchCipherMode {
  apply(data: State): State {
    const cipherMode = data.cipherMode === 'CRYPTED' ? 'PLAIN' : 'CRYPTED'
    return { ...data, cipherMode }
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
          {appState.data.cipherMode === 'CRYPTED' ? (
            <SubstitutionCipherView
              cipher={appState}
              setCodeLetter={appState.setCodeLetter}
            />
          ) : (
            <SubstitutionPlainView
              cipher={appState}
              setCodeLetter={appState.setCodeLetter}
            />
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={appState.switchCipherMode}>
            switch entry mode
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={appState.reset}>
            reset code
          </button>
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
            disabled={!appState.manual}
            onClick={appState.decrypt}>
            &larr; Decrypt
          </button>
          <br />
          <br />
          <button
            type="button"
            className="btn btn-primary"
            disabled={!appState.manual}
            onClick={appState.encrypt}>
            Encrypt &rarr;
          </button>
          <br />
          <br />
          <div className="btn-group">
            <button
              type="button"
              className={classNames('btn', 'btn-primary', {
                active: appState.manual,
              })}
              onClick={appState.setMode('MANUAL')}>
              manual
            </button>
            <button
              type="button"
              className={classNames('btn', 'btn-primary', {
                active: appState.autoEncrypt,
              })}
              onClick={appState.setMode('AUTOENCRYPT')}>
              encrypt
            </button>
            <button
              type="button"
              className={classNames('btn', 'btn-primary', {
                active: appState.autoDecrypt,
              })}
              onClick={appState.setMode('AUTODECRYPT')}>
              decrypt
            </button>
          </div>
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
