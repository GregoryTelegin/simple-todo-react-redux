import '../../styles/shared/Button/Button.css';

function ButtonShowFormCreateTodosLists(props) {
    return (
        <button
            onClick={props.onClick}
            className="createTodosListButton"
        >
            {props.children}
        </button>
    );
}

export {ButtonShowFormCreateTodosLists};