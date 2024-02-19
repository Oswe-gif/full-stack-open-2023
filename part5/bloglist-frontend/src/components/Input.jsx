const Input =({type, value, name, onChange})=>{
    return(
        <div>
            {name}
            <input type={type} value={value} name={name} onChange={onChange} />
        </div>
    )
}

export default Input