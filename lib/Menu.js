'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MenuMixin = require('./MenuMixin');

var _MenuMixin2 = _interopRequireDefault(_MenuMixin);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _util = require('./util');

var Menu = _react2['default'].createClass({
  displayName: 'Menu',

  propTypes: {
    openSubMenuOnMouseEnter: _react2['default'].PropTypes.bool,
    closeSubMenuOnMouseLeave: _react2['default'].PropTypes.bool,
    selectedKeys: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string),
    defaultSelectedKeys: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string),
    defaultOpenKeys: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string),
    openKeys: _react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.string),
    mode: _react2['default'].PropTypes.string,
    onClick: _react2['default'].PropTypes.func,
    onSelect: _react2['default'].PropTypes.func,
    onDeselect: _react2['default'].PropTypes.func,
    onDestroy: _react2['default'].PropTypes.func,
    openTransitionName: _react2['default'].PropTypes.string,
    openAnimation: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.object]),
    level: _react2['default'].PropTypes.number,
    eventKey: _react2['default'].PropTypes.string,
    selectable: _react2['default'].PropTypes.bool,
    children: _react2['default'].PropTypes.any
  },

  mixins: [_MenuMixin2['default']],

  getDefaultProps: function getDefaultProps() {
    return {
      openSubMenuOnMouseEnter: true,
      closeSubMenuOnMouseLeave: true,
      selectable: true,
      onClick: _util.noop,
      onSelect: _util.noop,
      onOpen: _util.noop,
      onClose: _util.noop,
      onDeselect: _util.noop,
      defaultSelectedKeys: [],
      defaultOpenKeys: []
    };
  },

  getInitialState: function getInitialState() {
    var props = this.props;
    var selectedKeys = props.defaultSelectedKeys;
    var openKeys = props.defaultOpenKeys;
    if ('selectedKeys' in props) {
      selectedKeys = props.selectedKeys || [];
    }
    if ('openKeys' in props) {
      openKeys = props.openKeys || [];
    }
    return {
      selectedKeys: selectedKeys, openKeys: openKeys
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var props = {};
    if ('selectedKeys' in nextProps) {
      props.selectedKeys = nextProps.selectedKeys;
    }
    if ('openKeys' in nextProps) {
      props.openKeys = nextProps.openKeys;
    }
    this.setState(props);
  },

  onDestroy: function onDestroy(key) {
    var state = this.state;
    var props = this.props;
    var selectedKeys = state.selectedKeys;
    var openKeys = state.openKeys;
    var index = selectedKeys.indexOf(key);
    if (!('selectedKeys' in props) && index !== -1) {
      selectedKeys.splice(index, 1);
    }
    index = openKeys.indexOf(key);
    if (!('openKeys' in props) && index !== -1) {
      openKeys.splice(index, 1);
    }
  },

  onItemHover: function onItemHover(e) {
    var _this = this;

    var item = e.item;

    // special for top sub menu
    if (this.props.mode !== 'inline' && !this.props.closeSubMenuOnMouseLeave && item.isSubMenu) {
      (function () {
        var activeKey = _this.state.activeKey;
        var activeItem = _this.getFlatInstanceArray().filter(function (c) {
          return c && c.props.eventKey === activeKey;
        })[0];
        if (activeItem && activeItem.props.open) {
          _this.onOpenChange({
            key: item.props.eventKey,
            item: e.item,
            open: true
          });
        }
      })();
    }

    this.onCommonItemHover(e);
  },

  onSelect: function onSelect(selectInfo) {
    var props = this.props;
    if (props.selectable) {
      // root menu
      var selectedKeys = this.state.selectedKeys;
      var selectedKey = selectInfo.key;
      if (props.multiple) {
        selectedKeys = selectedKeys.concat([selectedKey]);
      } else {
        selectedKeys = [selectedKey];
      }
      if (!('selectedKeys' in props)) {
        this.setState({
          selectedKeys: selectedKeys
        });
      }
      props.onSelect((0, _objectAssign2['default'])({}, selectInfo, {
        selectedKeys: selectedKeys
      }));
    }
  },

  onClick: function onClick(e) {
    var props = this.props;
    props.onClick(e);
  },

  onOpenChange: function onOpenChange(e) {
    var openKeys = this.state.openKeys;
    var props = this.props;
    var changed = true;
    if (e.open) {
      changed = openKeys.indexOf(e.key) === -1;
      if (changed) {
        openKeys = openKeys.concat(e.key);
      }
    } else {
      var index = openKeys.indexOf(e.key);
      changed = index !== -1;
      if (changed) {
        openKeys = openKeys.concat();
        openKeys.splice(index, 1);
      }
    }
    if (changed) {
      if (!('openKeys' in this.props)) {
        // hack: batch does not update state
        this.state.openKeys = openKeys;
        this.setState({ openKeys: openKeys });
      }
      var info = (0, _objectAssign2['default'])({ openKeys: openKeys }, e);
      if (e.open) {
        props.onOpen(info);
      } else {
        props.onClose(info);
      }
    }
  },

  onDeselect: function onDeselect(selectInfo) {
    var props = this.props;
    if (props.selectable) {
      var selectedKeys = this.state.selectedKeys.concat();
      var selectedKey = selectInfo.key;
      var index = selectedKeys.indexOf(selectedKey);
      if (index !== -1) {
        selectedKeys.splice(index, 1);
      }
      if (!('selectedKeys' in props)) {
        this.setState({
          selectedKeys: selectedKeys
        });
      }
      props.onDeselect((0, _objectAssign2['default'])({}, selectInfo, {
        selectedKeys: selectedKeys
      }));
    }
  },

  getOpenTransitionName: function getOpenTransitionName() {
    var props = this.props;
    var transitionName = props.openTransitionName;
    var animationName = props.openAnimation;
    if (!transitionName && typeof animationName === 'string') {
      transitionName = props.prefixCls + '-open-' + animationName;
    }
    return transitionName;
  },

  isInlineMode: function isInlineMode() {
    return this.props.mode === 'inline';
  },

  lastOpenSubMenu: function lastOpenSubMenu() {
    var _this2 = this;

    var lastOpen = [];
    if (this.state.openKeys.length) {
      lastOpen = this.getFlatInstanceArray().filter(function (c) {
        return c && _this2.state.openKeys.indexOf(c.props.eventKey) !== -1;
      });
    }
    return lastOpen[0];
  },

  renderMenuItem: function renderMenuItem(c, i, subIndex) {
    var key = (0, _util.getKeyFromChildrenIndex)(c, this.props.eventKey, i);
    var state = this.state;
    var extraProps = {
      openKeys: state.openKeys,
      open: state.openKeys.indexOf(key) !== -1,
      selectedKeys: state.selectedKeys,
      selected: state.selectedKeys.indexOf(key) !== -1,
      openSubMenuOnMouseEnter: this.props.openSubMenuOnMouseEnter
    };
    return this.renderCommonMenuItem(c, i, subIndex, extraProps);
  },

  render: function render() {
    var props = (0, _objectAssign2['default'])({}, this.props);
    props.className += ' ' + props.prefixCls + '-root';
    return this.renderRoot(props);
  }
});

exports['default'] = Menu;
module.exports = exports['default'];