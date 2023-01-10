module Interop = {
  module Response = {
    type t<'data>

    @send external json: t<'data> => Promise.t<'data> = "json"
  }

  type countriesResponse = array<{"label": string, "value": string}>

  @val
  external fetch: string => Promise.t<Response.t<countriesResponse>> = "fetch"

  @send external focus: Dom.element => unit = "focus"

  @send external scrollBy: (Dom.element, int, int) => unit = "scrollBy"

  @set external scrollTop: (Dom.element, int) => unit = "scrollTop"
}

open Interop

type state = {
  error: option<string>,
  scrollTop: int,
  ignoreMouse: bool,
  loading: bool,
  expanded: bool,
  query: string,
  items: countriesResponse,
  selected: string,
  cursor: string,
}

let defaultState = {
  error: None,
  scrollTop: 0,
  ignoreMouse: false,
  loading: true,
  expanded: false,
  query: "",
  items: [],
  selected: "",
  cursor: "",
}

let itemHeight = 16
let itemPaddingVertical = 4
let itemFullHeight = itemHeight + itemPaddingVertical * 2
let itemsHeight = 200

let noStyle = ReactDOM.Style.make()

let hiddenStyle = ReactDOM.Style.make(~display="none", ())

let hoverStyle = ReactDOM.Style.make(~backgroundColor="navy", ~color="white", ())

@react.component
let make = (~className: string, ~country: option<string>, ~onChange: string => unit) => {
  let (state, setState) = React.useState(_ => defaultState)
  let searchRef = React.useRef(Js.Nullable.null)
  let itemsRef = React.useRef(Js.Nullable.null)

  open Promise
  React.useEffect1(() => {
    if !state.loading {
      onChange(state.selected)
    } else {
      ()
    }
    None
  }, [state.selected])

  React.useEffect0(() => {
    fetch(
      "https://gist.githubusercontent.com/rusty-key/659db3f4566df459bd59c8a53dc9f71f/raw/4127f9550ef063121c564025f6d27dceeb279623/counties.json",
    )
    ->then(res => {
      Response.json(res)
    })
    ->then(data => {
      setState(
        prev => {
          let selected = switch country {
          | Some(country) => country
          | None => data[0]["value"]
          }
          {
            ...prev,
            loading: false,
            items: data,
            selected,
            cursor: "",
          }
        },
      )
      resolve()
    })
    ->catch(e => {
      setState(
        prev => {
          ...prev,
          error: Some("Could not load the countries."),
        },
      )
      resolve()
    })
    ->ignore

    None
  })

  let {loading, expanded, query, items, selected, cursor} = state

  open Js.Array
  let filteredItems = items |> filter(e => {
    Js.String.indexOf(Js.String.toLowerCase(state.query), Js.String.toLowerCase(e["label"])) > -1
  })

  let moveUp = () => {
    let index = filteredItems |> findIndex(e => e["value"] == cursor)

    if index > 0 {
      let cursorPosition = itemFullHeight * index
      if cursorPosition - state.scrollTop < itemFullHeight {
        switch itemsRef.current->Js.Nullable.toOption {
        | Some(dom) => scrollBy(dom, 0, -itemHeight - itemPaddingVertical * 2)
        | None => ()
        }
      } else {
        ()
      }
      filteredItems[index - 1]["value"]
    } else if cursor == "" {
      filteredItems[0]["value"]
    } else {
      cursor
    }
  }

  let moveDown = () => {
    let index = filteredItems |> findIndex(e => e["value"] == cursor)
    if index < Array.length(filteredItems) - 1 {
      let cursorPosition = itemFullHeight * index
      if cursorPosition - state.scrollTop > itemsHeight - itemFullHeight * 2 {
        switch itemsRef.current->Js.Nullable.toOption {
        | Some(dom) => scrollBy(dom, 0, itemFullHeight)
        | None => ()
        }
      } else {
        ()
      }

      filteredItems[index + 1]["value"]
    } else if cursor == "" {
      filteredItems[0]["value"]
    } else {
      cursor
    }
  }

  let handleSearchInput = searchInput => {
    let value = ReactEvent.Form.target(searchInput)["value"]
    setState(prev => {
      ...prev,
      query: value,
      cursor: "",
    })

    switch itemsRef.current->Js.Nullable.toOption {
    | Some(dom) => scrollTop(dom, 0)
    | None => ()
    }
  }

  let handleKeyEvent = e => {
    let keyCode = ReactEvent.Keyboard.keyCode(e)
    setState(prev => {
      switch keyCode {
      | 13 /* enter */ => {...prev, selected: cursor, expanded: false}
      | 38 /* up */ => {
          ReactEvent.Keyboard.preventDefault(e)
          {...prev, cursor: moveUp(), ignoreMouse: true}
        }

      | 40 /* down */ => {
          ReactEvent.Keyboard.preventDefault(e)
          {...prev, cursor: moveDown(), ignoreMouse: true}
        }

      | 27 /* escape */ => {
          ReactEvent.Keyboard.preventDefault(e)
          {...prev, expanded: false}
        }

      | _ => prev
      }
    })
  }

  let handleMouseMove = e => {
    if state.ignoreMouse === true {
      setState(prev => {...prev, ignoreMouse: false})
    } else {
      ()
    }
  }

  let handleScroll = e => {
    let scrollTop = ReactEvent.Synthetic.currentTarget(e)["scrollTop"]

    setState(prev => {
      ...prev,
      scrollTop,
    })
  }

  <div className>
    <div
      className="country-select-field"
      tabIndex=0
      ariaExpanded={expanded}
      ariaControls="some_id"
      onFocus={e => {
        setState(prev => {...prev, expanded: !loading && true})
        switch searchRef.current->Js.Nullable.toOption {
        | Some(dom) => Js.Global.setTimeout(() => dom->focus, 0)->ignore
        | None => ()
        }
      }}
      onMouseDown={e => {
        ReactEvent.Mouse.preventDefault(e)

        setState(prev => {...prev, expanded: !loading && !prev.expanded})

        switch searchRef.current->Js.Nullable.toOption {
        | Some(dom) => Js.Global.setTimeout(() => dom->focus, 0)->ignore
        | None => ()
        }
      }}>
      {switch items {
      | [] =>
        if state.loading {
          switch state.error {
          | Some(s) => React.string(s)
          | None => React.string("Loading...")
          }
        } else {
          React.string("...")
        }

      | items => {
          let index = items |> findIndex(e => {
            e["value"] == selected
          })
          React.string(items[index]["label"])
        }
      }}
    </div>
    <div id="some_id" className="country-select-popup" style={expanded ? noStyle : hiddenStyle}>
      <input
        autoComplete="off"
        className="country-select-search"
        placeholder="Search"
        ref={ReactDOM.Ref.domRef(searchRef)}
        onInput=handleSearchInput
        onBlur={e => {
          setState(prev => {...prev, expanded: false})
        }}
        onKeyDown={handleKeyEvent}
      />
      <div
        className="country-select-countries-list"
        onScroll={handleScroll}
        onMouseMove={handleMouseMove}
        ref={ReactDOM.Ref.domRef(itemsRef)}>
        {React.array({
          filteredItems |> mapi((item, i) => {
            // let selectedClass = if state.selected == item["value"] {
            //   "selected"
            // } else {
            //   ""
            // }
            let hover = if state.cursor == item["value"] {
              true
            } else {
              false
            }
            let itemStart = i * itemFullHeight
            let isVisible =
              itemStart + itemFullHeight > state.scrollTop &&
                itemStart < state.scrollTop + itemsHeight

            {
              isVisible
                ? <div
                    className="country-select-country"
                    style={hover ? hoverStyle : noStyle}
                    key={item["value"]}
                    value={item["value"]}
                    ariaSelected={state.selected == item["value"]}
                    onMouseDown={ReactEvent.Mouse.preventDefault}
                    onClick={e => {
                      setState(prev => {
                        ...prev,
                        selected: item["value"],
                        expanded: false,
                      })
                    }}
                    alt={item["label"]}
                    onMouseEnter={e =>
                      setState(prev =>
                        if prev.ignoreMouse {
                          prev
                        } else {
                          {
                            ...prev,
                            cursor: item["value"],
                          }
                        }
                      )}>
                    <span className={`fi fi-${item["value"]}`} />
                    {React.string(item["label"])}
                  </div>
                : <div className="country-select-country" />
            }
          })
        })}
      </div>
    </div>
  </div>
}
