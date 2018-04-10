'use strict';
import React from 'react';
import PrecalltestResultPopupHandler from '../../../handlers/meetingpage/PrecalltestResultPopupHandler';
import {CsioEvents} from '../../../../events/CsioEvents';

class PrecalltestResultPopup extends React.Component {
  constructor(props) {
    super(props);
    this.precalltestResultPopupHandler = new PrecalltestResultPopupHandler();
    this.state = this.precalltestResultPopupHandler.getState();
    document.addEventListener(
      CsioEvents.CsioStats.SHOW_PRECALLTEST_RESULT,
      this.precalltestResultPopupHandler.showPrecallStats.bind(this),
      false
    );
  }

  render() {
    return (
      <div className="modal" tabIndex="-1" role="dialog" style={{
        display: this.state.showModal, paddingTop: '2%'}}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title"> <strong>Precall test result: </strong></h4>
            </div>
            <div className="modal-body">
              <div className={'row'}>
                <div className={'col-xs-2'}/>
                <div className={'col-xs-4'}>
                  <p> <strong> Connectivity :  </strong></p>
                </div>
                <div className={'col-xs-4'}>
                  <p> <strong> {this.state.mediaConnectivity}  </strong></p>
                </div>
                <div className={'col-xs-2'}/>
              </div>
              <div className={'row'}>
                <div className={'col-xs-2'}/>
                <div className={'col-xs-4'}>
                  <p> <strong> RTT :  </strong></p>
                </div>
                <div className={'col-xs-4'}>
                  <p> <strong> {this.state.rtt} ms  </strong></p>
                </div>
                <div className={'col-xs-2'}/>
              </div>
              <div className={'row'}>
                <div className={'col-xs-2'}/>
                <div className={'col-xs-4'}>
                  <p> <strong> Fractional Loss :  </strong></p>
                </div>
                <div className={'col-xs-4'}>
                  <p> <strong> {this.state.fractionalLoss}  </strong></p>
                </div>
                <div className={'col-xs-2'}/>
              </div>
              <div className={'row'}>
                <div className={'col-xs-2'}/>
                <div className={'col-xs-4'}>
                  <p> <strong> Throughput :  </strong></p>
                </div>
                <div className={'col-xs-4'}>
                  <p> <strong> {this.state.throughput} kbps  </strong></p>
                </div>
                <div className={'col-xs-2'}/>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary"
                  onClick={this.precalltestResultPopupHandler.handleCloseModal.bind(this)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PrecalltestResultPopup;
