import React from 'react';
import { Droppable, DragDropContext } from 'react-beautiful-dnd';
import DraggableSymbol from './DraggableSymbol';

const onDragEnd = () => {};
const DroppableContainer = ({ dispatch, symbols }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="symbolsPicker"
        direction="horizontal"
        type="SYMBOL"
      >
        {provided => (
          <div
            className="stock-buttons"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {symbols.map((symbol, index) => (
              <DraggableSymbol
                key={symbol}
                dispatch={dispatch}
                symbol={symbol}
                index={index}
              />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DroppableContainer;
