'use strict';

import CsioConfigParams from '../../utils/Common';
import {CsioEvents, TriggerEvent} from '../../../events/CsioEvents';

class CsioStats {
  constructor() {
    this.isInitialized = false;
    this.config = {};
    this.csObject = new callstats();
    this.csObject.on('defaultConfig', this.defaultConfigCallback.bind(this));
    this.csObject.on('recommendedConfig', this.recommendedConfigCallback.bind(this));
  }
  initialize(userID) {
    if (this.isInitialized) {
      return;
    }
    this.csObject.initialize(
      __appid__,
      __appsecret__,
      userID,
      this.csInitCallback.bind(this),
      this.csStatsCallback.bind(this),
      CsioConfigParams);
  }
  // csio related events, and function
  // CSIO object callback
  defaultConfigCallback(config) {
    console.log('ConfigService, default config:', config);
    this.config = {...this.config, ...config};
  }
  recommendedConfigCallback(config) {
    console.log('ConfigService, recommended config:', config);
    this.config = {...this.config, ...config};
    const detail = {
      config: this.config
    };
    TriggerEvent(CsioEvents.CsioStats.ON_INITIALIZED, detail);
  }
  csInitCallback(csError, csErrMsg) {
    console.log('Status: errCode= ' + csError + ' errMsg= ' + csErrMsg);
    if (csError !== 'success') {
      TriggerEvent(CsioEvents.CsioStats.ON_DISCONNECTED, {});
    }
  }
  csStatsCallback(stats) {
    console.log('stats callback');
  };
}

export default CsioStats;
