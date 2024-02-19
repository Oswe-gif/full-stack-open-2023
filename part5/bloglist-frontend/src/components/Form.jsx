import Input from "./Input"

const Form =({title, fields, buttonName, onSubmitFunction})=>{
    return(
        <>
            <h1>{title}</h1>
            <form onSubmit={onSubmitFunction}>
                {fields.map(field =><Input key={field.id} type={field.type} value={field.value} name ={field.name} onChange={field.onChange}/>)}
                <button type="submit">{buttonName}</button>
            </form> 
        </>
    )
}
export default Form