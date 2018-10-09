import { State } from '../reducers';
import { Language } from '../reducers/language.reducer';

export const $language = (state: State) => state.language.language;

export const $languages = () => Object.values(Language);
