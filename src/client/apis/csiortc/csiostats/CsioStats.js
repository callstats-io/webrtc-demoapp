'use strict';

import CsioConfigParams from '../../utils/Common';

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
      userID, this.csInitCallback, this.csStatsCallback, CsioConfigParams);
  }
  // csio related events, and function
  // CSIO object callback
  defaultConfigCallback(config) {
    console.log('ConfigService, default config:', config);
  }
  recommendedConfigCallback(config) {
    console.log('ConfigService, recommended config:', config);
  }
  csInitCallback(csError, csErrMsg) {
    console.log('Status: errCode= ' + csError + ' errMsg= ' + csErrMsg);
  }
  csStatsCallback(stats) {
    console.log('stats callback');
  };
}

export default CsioStats;
