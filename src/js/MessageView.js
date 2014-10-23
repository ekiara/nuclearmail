/** @jsx React.DOM */

var HTMLSandbox = require('./HTMLSandbox');
var React = require('react');
var RelativeDate = require('./RelativeDate');
var StyleMixin = require('./StyleMixin');
var Styles = require('./Styles');
var asap = require('asap');
var moment = require('moment');

var PropTypes = React.PropTypes;
var PureRenderMixin = React.addons.PureRenderMixin;
var _ = require('lodash');
var cx = React.addons.classSet;

var MessageView = React.createClass({
  propTypes: {
    message: PropTypes.object,
    isExpandedInitially: PropTypes.bool,
  },

  mixins: [
    PureRenderMixin,
    StyleMixin({
      root: {
        padding: '12px 12px 0 12px',
      },

      inner: {
        background: '#f9f9f9',
        borderRadius: '4px',
        boxShadow: '0px 1px 2px 1px #ddd',
      },

      innerIsExpanded: {
        background: 'white',
      },

      header: [{
        padding: '12px',
        cursor: 'pointer',
      }, Styles.clearfix],

      headerSender: {
        fontWeight: 'bold',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },

      headerDate: {
        color: '#666',
        fontSize: '14px',
        float: 'right',
      },

      subject: {
        fontSize: '14px',
        margin: '0 12px',
      },

      sandbox: {
        borderTop: '1px solid #eee',
        margin: '12px',
        width: 'calc(100% - 24px)',
      },
    })
  ],

  getInitialState() {
    return {
      isExpanded: null,
    };
  },

  _onHeaderClick() {
    this.setState({isExpanded: !this.state.isExpanded});
  },

  componentDidMount() {
    if (this._isExpanded()) {
      asap(() => this.getDOMNode().scrollIntoView(true));
    }
  },

  _isExpanded() {
    return this.state.isExpanded ||
      (this.state.isExpanded === null && this.props.isExpandedInitially);
  },

  render() /*object*/ {
    if (!this.props.message) {
      return (
        <div className={cx(this.props.className, 'MessageView')} />
      );
    }

    var msg = this.props.message;
    var isExpanded = this._isExpanded();
    var body = isExpanded && msg.body['text/html'] ||
      '<div style="white-space:pre">' +
        _.escape(msg.body['text/plain']) +
      '</div>';

    return (
      <div className={cx(this.props.className, this.styles.root)}>
        <div className={cx(
          this.styles.inner,
          isExpanded && this.styles.innerIsExpanded
        )}>
          <div
            className={this.styles.header}
            onClick={this._onHeaderClick}>
              <RelativeDate
                className={this.styles.headerDate}
                date={msg.date}
              />
              <div className={this.styles.headerSender}>
                {msg.from.name || msg.from.email}
              </div>
          </div>
          {isExpanded ? (
            <div>
              <div className={this.styles.subject}>
                {msg.subject}
              </div>
              <HTMLSandbox
                className={this.styles.sandbox}
                html={body}
                iframeBodyStyle={{
                  'font-family': window.getComputedStyle(document.body).fontFamily,
                  padding: '12px',
                }}
                showImages={true}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
});

module.exports = MessageView;