import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { removeSymbol } from '../../actions/symbolsPicker';

const DraggableSymbol = ({ symbol, dispatch, index }) => {
  return (
    <Draggable draggableId={`symbol-${index}`} index={index}>
      {provided => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
        <div
          className="stock-button"
          role="button"
          onClick={evt => dispatch(removeSymbol(evt.target.innerHTML))}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {symbol}
        </div>
      )}
    </Draggable>
  );
};

export default DraggableSymbol;
