import { Farinel, farinel } from "./farinel";
import { Button } from "./html/button";
import { Div } from "./html/div";
import { Input } from "./html/input";

const MyButton = () => {
  const myButton = farinel();

  const handleClick = async () => {
    await myButton.setState({...myButton.state, loading: true});

    setTimeout(async () => await myButton.setState({counter: myButton.state.counter + 1, loading: false}), 3000);
  }

  // return myButton
  //   .stating((state: any) => ({
  //     loading: false,
  //     counter: 0,
  //   }))
  //   .when((state: any) => state.counter > 5, () => 
  //     <button type="button" onClick={() => handleClick()}>counter is &gt; then 5!!</button>
  //   )
  //   .extracting((state: any) => ({
  //     ...state,
  //     text: state.loading ? "Loading..." : "Click me!",
  //   }))
  //   .otherwise(() => 
  //     <button type="button" disabled={myButton.state.loading} onClick={() => handleClick()}>{myButton.state.text}</button>
  //   );
  return myButton
    .stating((state: any) => ({
      loading: false,
      counter: 0,
    }))
    .when((state: any) => state.counter > 5, () => 
      Button({}, "counter is &gt; then 5!!")
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

  // return farinel()
  //   .stating((state: any) => ({
  //     maxCount: 5,
  //   }))
  //   .watching([myButton])
  //   .test((state: any) => myButton.state.counter === state.maxCount)
  //   .with(5, () => (
  //     <div>HELLO!!</div>
  //   ))
  //   .otherwise(() => 
  //     <div onClick={() => console.log("container click")} onMouseOver={() => console.log("container over")}>
  //       <input type="text" disabled={myButton.state.loading} value={myButton.state.counter} />
  //       {myButton}
  //     </div>
  //   )

    return farinel()
      .stating((state: any) => ({
        maxCount: 5,
      }))
      .watching([myButton])
      .test((state: any) => myButton.state.counter === state.maxCount)
      .with(5, () => 
        Div({}, "HELLO!!")
      )
      .otherwise(() => 
        Div({}, 
          Input({
            type: "text",
            disabled: myButton.state.loading,
            value: myButton.state.counter,
          }),
          myButton
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
