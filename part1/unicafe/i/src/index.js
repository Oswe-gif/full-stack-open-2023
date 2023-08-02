import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";


const Button = ({opinion, text}) => {
  return (
    <button onClick={opinion}>
      {text}
    </button>
  )
}

const StatisticLine = (props) => {
  return(
    <tbody>
        <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
    </tbody>

  )
}

const Statistics =(props)=>{
  let all = props.good+props.neutral+props.bad;
  let avarage = (props.good-props.bad)/(props.good+props.neutral+props.bad);
  let positive = (((props.good)/(props.good+props.neutral+props.bad))*100);

  if (props.good !=0 || props.neutral !=0 || props.bad !=0)
  {
    return(
      <>
        <table>
          <StatisticLine text="Good" value={props.good}/>
          <StatisticLine text="Netral" value={props.neutral}/>
          <StatisticLine text="Bad" value={props.bad}/>
          <StatisticLine text="All" value={all}/>
          <StatisticLine text="Avarage" value={avarage}/>
          <StatisticLine text="Positive" value={positive+"%"}/>
        </table>
      </>
    )
  }
  return(
    <>
      <p>No feedback given</p>
    </>
  )

}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good+1);
  const increaseNeutral = () => setNeutral(neutral+1);
  const increaseBad = () => setBad(bad+1);


  return (
    <div>
      <h1>Give feedback</h1>
      <Button opinion={increaseGood} text='good'/>
      <Button opinion={increaseNeutral} text='neutral'/>
      <Button opinion={increaseBad} text='bad'/>
      <h1>statistics</h1>

      <Statistics good={good} neutral={neutral} bad={bad}/>
      
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();