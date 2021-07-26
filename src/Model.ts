export interface Cipher {
  encode(plain: string): string
  decode(cipher: string): string
}

export interface Replacement {
  plain: string
  cipher: string
}

export class SubstitutionCipher {
  replacements: Replacement[]

  constructor(replacements: Replacement[]) {
    this.replacements = replacements
  }

  encode(plain: string): string {
    let result = ''
    for (const c of plain) {
    }
    return 'todo!'
  }

  decode(cipher: string): string {
    return 'todo!'
  }
}
