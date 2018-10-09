import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';

import { ChangeLanguage } from '../actions/language.action';
import { Language } from '../reducers/language.reducer';

@Injectable()
export class LanguageEffects {
  constructor(private action$: Actions, private translate: TranslateService) {}

  @Effect({ dispatch: false })
  setupLanguage$ = this.action$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    tap(() => {
      this.translate.addLangs(Object.values(Language));
      this.translate.setDefaultLang(Language.English);
      this.translate.use(Language.English);
    })
  );

  @Effect({ dispatch: false })
  changeLanguage$ = this.action$.pipe(
    ofType(ChangeLanguage.type),
    tap((action: ChangeLanguage) => {
      this.translate.use(action.language);
    })
  );
}
