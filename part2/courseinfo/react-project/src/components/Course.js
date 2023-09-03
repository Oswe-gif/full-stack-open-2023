import React from "react";


const Header =(props)=>
{
  return(
    <>
      <h1>{props.name}</h1>
    </>
  )
}
const Content =(props)=>
{
    return(
    <>
      {props.parts.map(part =>(<Part  key={part.id} parts={part.name} exercises={part.exercises}/>))}
    </>
  )
}
const Part =(props)=>
{
  return(
    <>
      <p>{props.parts} {props.exercises}</p>
    </>
  )
}
const Total =(props)=>
{
  //let total=0;  
  //props.parts.map(part =>(total+=part.exercises))
  const initialValue = 0;
  const total = props.parts.reduce((accumulator, currentValue) => accumulator + currentValue.exercises, initialValue);
  return(
    <>
        <p>Number of exercises {total}</p>

    </>
    
  )
}


const Course =(props)=>
{
    return(
        <>
            <Header name={props.course.name}/>
            <Content parts={props.course.parts}/>
            <Total parts={props.course.parts}/>
        </>
    )
}

export default Course

