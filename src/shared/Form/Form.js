import '../../styles/shared/Form/Form.css';

export function FormCreateTodosList(props) {
    return (
        <form className="formCreateTodosLists">
            {
                props.children.map(input => {
                    return input
                })
            }
        </form>
    )
}