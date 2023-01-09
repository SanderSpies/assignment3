// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Curry = require("rescript/lib/js/curry.js");
var React = require("react");
var $$Promise = require("@ryyppy/rescript-promise/src/Promise.bs.js");
var Js_array = require("rescript/lib/js/js_array.js");
var Js_string = require("rescript/lib/js/js_string.js");
var Caml_array = require("rescript/lib/js/caml_array.js");
var Caml_int32 = require("rescript/lib/js/caml_int32.js");
var Caml_option = require("rescript/lib/js/caml_option.js");

var $$Response = {};

var Interop = {
  $$Response: $$Response
};

var defaultState_items = [];

var defaultState = {
  error: undefined,
  scrollTop: 0,
  ignoreMouse: false,
  loading: true,
  expanded: false,
  query: "",
  items: defaultState_items,
  selected: "",
  cursor: ""
};

var itemFullHeight = 24;

var noStyle = {};

var hiddenStyle = {
  display: "none"
};

var hoverStyle = {
  backgroundColor: "navy",
  color: "white"
};

function CountrySelect(props) {
  var onChange = props.onChange;
  var country = props.country;
  var match = React.useState(function () {
        return defaultState;
      });
  var setState = match[1];
  var state = match[0];
  var searchRef = React.useRef(null);
  var itemsRef = React.useRef(null);
  React.useEffect((function () {
          if (!state.loading) {
            Curry._1(onChange, state.selected);
          }
          
        }), [state.selected]);
  React.useEffect((function () {
          $$Promise.$$catch(fetch("https://gist.githubusercontent.com/rusty-key/659db3f4566df459bd59c8a53dc9f71f/raw/4127f9550ef063121c564025f6d27dceeb279623/counties.json").then(function (res) {
                      return res.json();
                    }).then(function (data) {
                    Curry._1(setState, (function (prev) {
                            var selected = country !== undefined ? country : Caml_array.get(data, 0).value;
                            return {
                                    error: prev.error,
                                    scrollTop: prev.scrollTop,
                                    ignoreMouse: prev.ignoreMouse,
                                    loading: false,
                                    expanded: prev.expanded,
                                    query: prev.query,
                                    items: data,
                                    selected: selected,
                                    cursor: ""
                                  };
                          }));
                    return Promise.resolve(undefined);
                  }), (function (e) {
                  Curry._1(setState, (function (prev) {
                          return {
                                  error: "Could not load the countries.",
                                  scrollTop: prev.scrollTop,
                                  ignoreMouse: prev.ignoreMouse,
                                  loading: prev.loading,
                                  expanded: prev.expanded,
                                  query: prev.query,
                                  items: prev.items,
                                  selected: prev.selected,
                                  cursor: prev.cursor
                                };
                        }));
                  return Promise.resolve(undefined);
                }));
        }), []);
  var cursor = state.cursor;
  var selected = state.selected;
  var items = state.items;
  var expanded = state.expanded;
  var loading = state.loading;
  var filteredItems = Js_array.filter((function (e) {
          return Js_string.indexOf(state.query.toLowerCase(), e.label.toLowerCase()) > -1;
        }), items);
  var moveUp = function (param) {
    var index = Js_array.findIndex((function (e) {
            return e.value === cursor;
          }), filteredItems);
    if (index <= 0) {
      if (cursor === "") {
        return Caml_array.get(filteredItems, 0).value;
      } else {
        return cursor;
      }
    }
    var cursorPosition = Math.imul(itemFullHeight, index);
    if ((cursorPosition - state.scrollTop | 0) < itemFullHeight) {
      var dom = itemsRef.current;
      if (!(dom == null)) {
        dom.scrollBy(0, -24);
      }
      
    }
    return Caml_array.get(filteredItems, index - 1 | 0).value;
  };
  var moveDown = function (param) {
    var index = Js_array.findIndex((function (e) {
            return e.value === cursor;
          }), filteredItems);
    if (index >= (filteredItems.length - 1 | 0)) {
      if (cursor === "") {
        return Caml_array.get(filteredItems, 0).value;
      } else {
        return cursor;
      }
    }
    var cursorPosition = Math.imul(itemFullHeight, index);
    if ((cursorPosition - state.scrollTop | 0) > (200 - (itemFullHeight << 1) | 0)) {
      var dom = itemsRef.current;
      if (!(dom == null)) {
        dom.scrollBy(0, itemFullHeight);
      }
      
    }
    return Caml_array.get(filteredItems, index + 1 | 0).value;
  };
  var handleSearchInput = function (searchInput) {
    var value = searchInput.target.value;
    Curry._1(setState, (function (prev) {
            return {
                    error: prev.error,
                    scrollTop: prev.scrollTop,
                    ignoreMouse: prev.ignoreMouse,
                    loading: prev.loading,
                    expanded: prev.expanded,
                    query: value,
                    items: prev.items,
                    selected: prev.selected,
                    cursor: ""
                  };
          }));
    var dom = itemsRef.current;
    if (!(dom == null)) {
      dom.scrollTop = 0;
      return ;
    }
    
  };
  var handleKeyEvent = function (e) {
    var keyCode = e.keyCode;
    Curry._1(setState, (function (prev) {
            if (keyCode === 13) {
              return {
                      error: prev.error,
                      scrollTop: prev.scrollTop,
                      ignoreMouse: prev.ignoreMouse,
                      loading: prev.loading,
                      expanded: false,
                      query: prev.query,
                      items: prev.items,
                      selected: cursor,
                      cursor: prev.cursor
                    };
            }
            if (keyCode < 38) {
              if (keyCode !== 27) {
                return prev;
              } else {
                e.preventDefault();
                return {
                        error: prev.error,
                        scrollTop: prev.scrollTop,
                        ignoreMouse: prev.ignoreMouse,
                        loading: prev.loading,
                        expanded: false,
                        query: prev.query,
                        items: prev.items,
                        selected: prev.selected,
                        cursor: prev.cursor
                      };
              }
            }
            if (keyCode >= 41) {
              return prev;
            }
            switch (keyCode) {
              case 38 :
                  e.preventDefault();
                  return {
                          error: prev.error,
                          scrollTop: prev.scrollTop,
                          ignoreMouse: true,
                          loading: prev.loading,
                          expanded: prev.expanded,
                          query: prev.query,
                          items: prev.items,
                          selected: prev.selected,
                          cursor: moveUp(undefined)
                        };
              case 39 :
                  return prev;
              case 40 :
                  e.preventDefault();
                  return {
                          error: prev.error,
                          scrollTop: prev.scrollTop,
                          ignoreMouse: true,
                          loading: prev.loading,
                          expanded: prev.expanded,
                          query: prev.query,
                          items: prev.items,
                          selected: prev.selected,
                          cursor: moveDown(undefined)
                        };
              
            }
          }));
  };
  var handleMouseMove = function (e) {
    if (state.ignoreMouse === true) {
      return Curry._1(setState, (function (prev) {
                    return {
                            error: prev.error,
                            scrollTop: prev.scrollTop,
                            ignoreMouse: false,
                            loading: prev.loading,
                            expanded: prev.expanded,
                            query: prev.query,
                            items: prev.items,
                            selected: prev.selected,
                            cursor: prev.cursor
                          };
                  }));
    }
    
  };
  var handleScroll = function (e) {
    var scrollTop = e.currentTarget.scrollTop;
    Caml_int32.div(scrollTop, itemFullHeight);
    Curry._1(setState, (function (prev) {
            return {
                    error: prev.error,
                    scrollTop: scrollTop,
                    ignoreMouse: prev.ignoreMouse,
                    loading: prev.loading,
                    expanded: prev.expanded,
                    query: prev.query,
                    items: prev.items,
                    selected: prev.selected,
                    cursor: prev.cursor
                  };
          }));
  };
  var tmp;
  if (items.length !== 0) {
    var index = Js_array.findIndex((function (e) {
            return e.value === selected;
          }), items);
    tmp = Caml_array.get(items, index).label;
  } else if (state.loading) {
    var s = state.error;
    tmp = s !== undefined ? s : "Loading...";
  } else {
    tmp = "...";
  }
  return React.createElement("div", {
              className: props.className
            }, React.createElement("div", {
                  "aria-expanded": expanded,
                  "aria-controls": "some_id",
                  className: "country-select-field",
                  tabIndex: 0,
                  onFocus: (function (e) {
                      Curry._1(setState, (function (prev) {
                              return {
                                      error: prev.error,
                                      scrollTop: prev.scrollTop,
                                      ignoreMouse: prev.ignoreMouse,
                                      loading: prev.loading,
                                      expanded: !loading && true,
                                      query: prev.query,
                                      items: prev.items,
                                      selected: prev.selected,
                                      cursor: prev.cursor
                                    };
                            }));
                      var dom = searchRef.current;
                      if (!(dom == null)) {
                        setTimeout((function (param) {
                                dom.focus();
                              }), 0);
                        return ;
                      }
                      
                    }),
                  onMouseDown: (function (e) {
                      e.preventDefault();
                      Curry._1(setState, (function (prev) {
                              return {
                                      error: prev.error,
                                      scrollTop: prev.scrollTop,
                                      ignoreMouse: prev.ignoreMouse,
                                      loading: prev.loading,
                                      expanded: !loading && !prev.expanded,
                                      query: prev.query,
                                      items: prev.items,
                                      selected: prev.selected,
                                      cursor: prev.cursor
                                    };
                            }));
                      var dom = searchRef.current;
                      if (!(dom == null)) {
                        setTimeout((function (param) {
                                dom.focus();
                              }), 0);
                        return ;
                      }
                      
                    })
                }, tmp), React.createElement("div", {
                  className: "country-select-popup",
                  id: "some_id",
                  style: expanded ? noStyle : hiddenStyle
                }, React.createElement("input", {
                      ref: Caml_option.some(searchRef),
                      className: "country-select-search",
                      autoComplete: "off",
                      placeholder: "Search",
                      onKeyDown: handleKeyEvent,
                      onBlur: (function (e) {
                          Curry._1(setState, (function (prev) {
                                  return {
                                          error: prev.error,
                                          scrollTop: prev.scrollTop,
                                          ignoreMouse: prev.ignoreMouse,
                                          loading: prev.loading,
                                          expanded: false,
                                          query: prev.query,
                                          items: prev.items,
                                          selected: prev.selected,
                                          cursor: prev.cursor
                                        };
                                }));
                        }),
                      onInput: handleSearchInput
                    }), React.createElement("div", {
                      ref: Caml_option.some(itemsRef),
                      className: "country-select-countries-list",
                      onMouseMove: handleMouseMove,
                      onScroll: handleScroll
                    }, Js_array.map((function (item) {
                            var hover = state.cursor === item.value;
                            return React.createElement("div", {
                                        key: item.value,
                                        "aria-selected": state.selected === item.value,
                                        className: "country-select-country",
                                        style: hover ? hoverStyle : noStyle,
                                        alt: item.label,
                                        value: item.value,
                                        onClick: (function (e) {
                                            Curry._1(setState, (function (prev) {
                                                    return {
                                                            error: prev.error,
                                                            scrollTop: prev.scrollTop,
                                                            ignoreMouse: prev.ignoreMouse,
                                                            loading: prev.loading,
                                                            expanded: false,
                                                            query: prev.query,
                                                            items: prev.items,
                                                            selected: item.value,
                                                            cursor: prev.cursor
                                                          };
                                                  }));
                                          }),
                                        onMouseDown: (function (prim) {
                                            prim.preventDefault();
                                          }),
                                        onMouseEnter: (function (e) {
                                            Curry._1(setState, (function (prev) {
                                                    if (prev.ignoreMouse) {
                                                      return prev;
                                                    } else {
                                                      return {
                                                              error: prev.error,
                                                              scrollTop: prev.scrollTop,
                                                              ignoreMouse: prev.ignoreMouse,
                                                              loading: prev.loading,
                                                              expanded: prev.expanded,
                                                              query: prev.query,
                                                              items: prev.items,
                                                              selected: prev.selected,
                                                              cursor: item.value
                                                            };
                                                    }
                                                  }));
                                          })
                                      }, React.createElement("span", {
                                            className: "fi fi-" + item.value + ""
                                          }), item.label);
                          }), filteredItems))));
}

var itemHeight = 16;

var itemPaddingVertical = 4;

var itemsHeight = 200;

var make = CountrySelect;

exports.Interop = Interop;
exports.defaultState = defaultState;
exports.itemHeight = itemHeight;
exports.itemPaddingVertical = itemPaddingVertical;
exports.itemFullHeight = itemFullHeight;
exports.itemsHeight = itemsHeight;
exports.noStyle = noStyle;
exports.hiddenStyle = hiddenStyle;
exports.hoverStyle = hoverStyle;
exports.make = make;
/* react Not a pure module */