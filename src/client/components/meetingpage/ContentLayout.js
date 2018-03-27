import React from 'react';

class LayoutLeft extends React.Component {
  render() {
    const cusStyle = {

    };
    const rowStyle = {
      paddingTop: '2%',
      paddingLeft: '2%'
    };
    const videoStyle = {
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'block',
      maxWidth: '640px',
      maxHeight: '480px'
    };
    const imgStyle = {
      height: '80px',
      width: '100%',
      display: 'block'
    };
    return (
      <div className={'col-xs-8'} style={cusStyle}>
        <div className={'row'} style={rowStyle}>
          <div className={'row'}>
            <video className="thumbnail" autoPlay loop style={videoStyle}>
              <source src="http://techslides.com/demos/sample-videos/small.mp4" type="video/mp4"/>
            </video>
          </div>
        </div>
        <div className={'row'} style={rowStyle}>8 participants in call</div>
        <div className={'row'} style={rowStyle}>
          <div className="row">
            <div className="col-xs-3">
              <a href="#" className="thumbnail">
                <img alt="100%x180" data-src="holder.js/100%x180" style={imgStyle} src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTcxIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE3MSAxODAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MTgwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTYyNjg4ZGIzNTggdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNjI2ODhkYjM1OCI+PHJlY3Qgd2lkdGg9IjE3MSIgaGVpZ2h0PSIxODAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSI1OC43NjU2MjUiIHk9Ijk0LjUiPjE3MXgxODA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=" data-holder-rendered="true"/>
              </a>
            </div>
            <div className="col-xs-3">
              <a href="#" className="thumbnail">
                <img alt="100%x180" data-src="holder.js/100%x180" style={imgStyle} src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTcxIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE3MSAxODAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MTgwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTYyNjg4ZGIzNTggdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNjI2ODhkYjM1OCI+PHJlY3Qgd2lkdGg9IjE3MSIgaGVpZ2h0PSIxODAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSI1OC43NjU2MjUiIHk9Ijk0LjUiPjE3MXgxODA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=" data-holder-rendered="true"/>
              </a>
            </div>
            <div className="col-xs-3">
              <a href="#" className="thumbnail">
                <img alt="100%x180" data-src="holder.js/100%x180" style={imgStyle} src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTcxIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE3MSAxODAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MTgwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTYyNjg4ZGIzNTggdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNjI2ODhkYjM1OCI+PHJlY3Qgd2lkdGg9IjE3MSIgaGVpZ2h0PSIxODAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSI1OC43NjU2MjUiIHk9Ijk0LjUiPjE3MXgxODA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=" data-holder-rendered="true"/>
              </a>
            </div>
            <div className="col-xs-3">
              <a href="#" className="thumbnail">
                <img alt="100%x180" data-src="holder.js/100%x180" style={imgStyle} src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTcxIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE3MSAxODAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MTgwCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTYyNjg4ZGIzNTggdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNjI2ODhkYjM1OCI+PHJlY3Qgd2lkdGg9IjE3MSIgaGVpZ2h0PSIxODAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSI1OC43NjU2MjUiIHk9Ijk0LjUiPjE3MXgxODA8L3RleHQ+PC9nPjwvZz48L3N2Zz4=" data-holder-rendered="true"/>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
class LayoutRight extends React.Component {
  render() {
    const curStyle = {
      paddingLeft: '3%',
      color: '#442173'
    };
    const glyStyle = {
      fontSize: '22px'
    };
    const rowStyle = {
      paddingTop: '5%'
    };
    return (
      <div className={'col-xs-4'} style={curStyle}>
        <div className={'row'} style={rowStyle}>
          You name and settings
        </div>
        <div className={'row'} style={rowStyle}>
          <div className={'col-xs-7'}>
            <div className={'row'}>
              <div className={'col-xs-4'} style={{padding: '0px'}}>
                  Your name
              </div>
              <div className={'col-xs-8'} style={{padding: '0px'}}>
                <div className="input-group">
                  <input className="form-control" placeholder="Your name"/>
                </div>
              </div>
            </div>
            <div className={'row'} style={{paddingTop: '10%'}}>
              <div className={'col-xs-4'}>
                <span className="glyphicon glyphicon-volume-up" aria-hidden="true" style={glyStyle}></span>
              </div>
              <div className={'col-xs-4'}>
                <span className="glyphicon glyphicon-facetime-video" aria-hidden="true" style={glyStyle}></span>
              </div>
              <div className={'col-xs-4'}>
                <span className="glyphicon glyphicon-eye-open" aria-hidden="true" style={glyStyle}></span>
              </div>
            </div>
          </div>
          <div className={'col-xs-5'}>
            <div align="center" className="embed-responsive embed-responsive-16by9">
              <video autoPlay loop className="embed-responsive-item">
                <source src="http://techslides.com/demos/sample-videos/small.mp4" type="video/mp4"/>
              </video>
            </div>
          </div>
        </div>
        <div className={'row'} style={{paddingTop: '10%'}}>
          <hr />
        </div>
      </div>
    );
  }
}
class ContentLayout extends React.Component {
  render() {
    return (
      <div className={'container-fluid'}>
        <div className={'row'}>
          <LayoutLeft/>
          <LayoutRight/>
        </div>
      </div>
    );
  }
}

export default ContentLayout;
