import { ADD_SYMBOL, REMOVE_SYMBOL, FILTER_SYMBOLS } from '../actions/actions';

const symbolPicker = (state = [], action) => {
  switch (action.type) {
    case ADD_SYMBOL:
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false,
        },
      ];
    case REMOVE_SYMBOL:
      return state.map(todo =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo,
      );
    case FILTER_SYMBOLS:
      return state.map(todo =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo,
      );
    default:
      return state;
  }
};

export default symbolPicker;
