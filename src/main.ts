import { farinel } from "./farinel";
import { Button } from "./html/button";
import { Div } from "./html/div";
import { Input } from "./html/input";

const MyButton = () => {
  const myButton = farinel();

  const handleClick = async () => {
    await myButton.setState({...myButton.state, loading: true});

    setTimeout(async () => await myButton.setState({counter: myButton.state.counter + 1, loading: false}), 1000);
  }

  return myButton
    .stating((state: any) => ({
      loading: false,
      counter: 0,
    }))
    .when((state: any) => state.counter > 3, () => 
      Button({
        disabled: myButton.state.loading,
      }, "counter is > then 3!!")
        .on("click", () => handleClick())
    )
    .extracting((state: any) => ({
      ...state,
      text: state.loading ? "Loading..." : "Click me!",
    }))
    .otherwise(() =>
      Button({
        disabled: myButton.state.loading,
      }, myButton.state.text)
        .on("click", () => handleClick())
    );
}

const Container = () => {
  const myButton = MyButton();

    return farinel()
      .stating((state: any) => ({}))
      .watching([myButton])
      .test((state: any, currentState: any) => myButton.state.counter === currentState)
      .with(5, () => 
        Div({}, "HELLO!!")
      )
      .otherwise(() => 
        Div({}, 
          Div({}, `status: ${myButton.state.loading === true ? 'loading' : 'ready'}`),
          Div({
            align: "left",
          }, myButton),
          Input({
            type: "text",
            disabled: myButton.state.loading,
            value: myButton.state.counter,
          }),
          [1, 2, 3].map(i => Div({}, `counter: ${myButton.state.counter}`)),
        )
          .on("click", () => console.log("container click"))
          .on("mouseover", () => console.log("container over"))
      );
}

const App = async () => {
  await farinel()
    .createRoot(document.body, Container());
}

App();
