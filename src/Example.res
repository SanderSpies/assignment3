switch ReactDOM.querySelector("#root") {
| Some(rootElement) => {
    let root = ReactDOM.Client.createRoot(rootElement)

    let onChange = e => Js.log("Selected value:" ++ e)

    ReactDOM.Client.Root.render(
      root,
      <>
        <CountrySelect className="x1" country=Some("us") onChange />
      </>,
    )
  }

| None => ()
}
