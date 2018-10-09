import { Action } from '@ngrx/store';

import { Language } from '../reducers/language.reducer';

export class ChangeLanguage implements Action {
  static readonly type: 'Change Language' = 'Change Language';
  readonly type = ChangeLanguage.type;
  constructor(public language: Language) {}
}

export type LanguageAction = ChangeLanguage;
