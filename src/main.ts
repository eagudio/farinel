import { farinel } from "./farinel";
import { Button } from "./html/button";
import { Div } from "./html/div";
import { Input } from "./html/input";
import { Option } from "./html/option";
import { Select } from "./html/select";

const MyButton = ({
  counter,
  loading,
  onButtonClick,
}: any) => {
  const myButton = farinel();

  const handleClick = async () => {
    await myButton.setState({...myButton.state, loading: true});

    onButtonClick({...myButton.state, loading: true});

    setTimeout(async () => {
      await myButton.setState({counter: myButton.state.counter + 1, loading: false})
    
      onButtonClick({counter: myButton.state.counter, loading: myButton.state.loading});
    }, 1000);
  }

  return myButton
    .stating((state: any) => ({
      loading,
      counter,
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
  const container = farinel();

  return container
    .stating((state: any) => ({
      counter: 0,
      loading: false,
    }))
    .test((state: any, currentState: any) => container.state.counter === currentState)
    .with(5, () => 
      Div({}, "HELLO!!")
    )
    .otherwise(() => 
      Div({},
        Div({}, `status: ${container.state.loading === true ? 'loading' : 'ready'}`),
        Div({
          align: "left",
        },
          MyButton({
            counter: container.state.counter,
            loading: container.state.loading,
            onButtonClick: ({counter, loading}: {counter: number, loading: boolean}) => {
              container.setState({
                counter,
                loading,
              });
            },
          })
        ),
        Input({
          type: "text",
          disabled: container.state.loading,
          value: container.state.counter,
        }),
        Select({
          value: container.state.counter,
        }, 
          [0, 1, 2, 3, 4].map(i => Option({
            value: i,
          }, `option ${i}`))
        )
          .on("change", async (e: any) => {
            const value = Number(e.target.value);

            await container.setState({counter: value});
          })
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
