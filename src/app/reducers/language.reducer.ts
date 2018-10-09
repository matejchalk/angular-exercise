import { ChangeLanguage, LanguageAction } from '../actions/language.action';

export enum Language {
  English = 'en',
  Czech = 'cs'
}

export interface LanguageState {
  language: Language;
}

const initialState: LanguageState = {
  language: Language.English
};

export function languageReducer(state = initialState, action: LanguageAction) {
  switch (action.type) {
    case ChangeLanguage.type: {
      const language = action.language;
      return { ...state, language };
    }
    default: {
      return state;
    }
  }
}
