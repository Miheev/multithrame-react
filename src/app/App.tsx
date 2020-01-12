import React, { ReactElement, Suspense } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Grommet } from 'grommet';

import { appModule } from './app.module';
import { appTheme } from './appTheme';
import { AppStore } from 'src/modules/redux/app.store';
import { DataMap } from 'src/modules/shared/models';
import { AppSpinner } from 'src/modules/core/components/app-spinner/app-spinner.component';

function AppRouted(props?: DataMap): ReactElement {
  return (
    <Router>
      <Suspense fallback={<AppSpinner/>}>
        <Switch>
          <Redirect exact={true} from="/" to="/popular"/>
          {appModule.map((route, i) => (
            // @ts-ignore
            <Route key={i}  {...route} />
          ))}
          <Redirect to="/popular"/>
        </Switch>
      </Suspense>
    </Router>
  );
}


export function App(props?: DataMap): ReactElement {
  return (
    <Grommet theme={appTheme} plain>
      <Provider store={AppStore}>
        <AppRouted {...props} />
      </Provider>
    </Grommet>
  );
}
