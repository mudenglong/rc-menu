'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _rcUtil = require('rc-util');

var _rcUtil2 = _interopRequireDefault(_rcUtil);

exports['default'] = {
  componentDidMount: function componentDidMount() {
    this.componentDidUpdate();
  },

  componentDidUpdate: function componentDidUpdate() {
    if (this.props.mode !== 'inline') {
      if (this.props.expanded) {
        this.bindRootCloseHandlers();
      } else {
        this.unbindRootCloseHandlers();
      }
    }
  },

  handleDocumentKeyUp: function handleDocumentKeyUp(e) {
    if (e.keyCode === _rcUtil.KeyCode.ESC) {
      this.props.onItemHover({
        key: this.props.eventKey,
        item: this,
        hover: false
      });
    }
  },

  handleDocumentClick: function handleDocumentClick(e) {
    // If the click originated from within this component
    // don't do anything.
    if (_rcUtil2['default'].Dom.contains(React.findDOMNode(this), e.target)) {
      return;
    }
    var props = this.props;
    props.onItemHover({
      hover: false,
      item: this,
      key: this.props.eventKey
    });
    this.triggerExpandedChange(false);
  },

  bindRootCloseHandlers: function bindRootCloseHandlers() {
    if (!this._onDocumentClickListener) {
      this._onDocumentClickListener = _rcUtil2['default'].Dom.addEventListener(document, 'click', this.handleDocumentClick);
      this._onDocumentKeyupListener = _rcUtil2['default'].Dom.addEventListener(document, 'keyup', this.handleDocumentKeyUp);
    }
  },

  unbindRootCloseHandlers: function unbindRootCloseHandlers() {
    if (this._onDocumentClickListener) {
      this._onDocumentClickListener.remove();
      this._onDocumentClickListener = null;
    }

    if (this._onDocumentKeyupListener) {
      this._onDocumentKeyupListener.remove();
      this._onDocumentKeyupListener = null;
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    this.unbindRootCloseHandlers();
  }
};
module.exports = exports['default'];