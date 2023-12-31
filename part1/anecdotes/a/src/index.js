import React, {useState}from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const Button =({anecdote, text})=>{
  return(
    <button onClick={anecdote}>
    {text}
    </button>
  )
}

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [vote, setVote] = useState([0,0,0,0,0,0]);
  const randomAnecdote = ()=>
  {
    let randomValue = Math.floor(Math.random() * (anecdotes.length));
    setSelected(randomValue);
  }
  const voteAnecdote = ()=>
  {
    const copy = [...vote];
    copy[selected] +=1;
    setVote(copy);
    
  }

  return (
    <>
      <h1>Anecdote of the day</h1>
      <p>{props.anecdotes[selected]}</p>
      <p>Has {vote[selected]} votes</p>
      <Button anecdote={voteAnecdote} text={"Vote"}/>
      <Button anecdote={randomAnecdote} text={"Next anecdote"}/>
      <h1>Anecdote with most votes</h1>
      <p>{props.anecdotes[vote.indexOf(Math.max(...vote))]}</p>
      <p>Has {Math.max(...vote)} votes</p>
    </>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App anecdotes={anecdotes}/>
  </React.StrictMode>
);

