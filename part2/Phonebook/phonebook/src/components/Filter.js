const Filter = (props) => {
    
    return (
        <>
        Filter shown with <input value={props.filter} onChange={props.handleFilterChange}/>
        </>
        
    )
  }
  
  export default Filter