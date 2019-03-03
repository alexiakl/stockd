import React from 'react';
import { Droppable, DragDropContext } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import DraggableSymbol from './DraggableSymbol';
import { updateOrder } from '../../actions/symbolsPicker';

const DroppableContainer = ({ dispatch, symbols }) => {
  const onDragEnd = result => {
    const { destination, source } = result;
    if (source && destination) {
      const element = symbols[source.index];
      symbols.splice(source.index, 1);
      symbols.splice(destination.index, 0, element);
      dispatch(updateOrder(symbols));
    }
  };

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

const mapStateToProps = state => ({
  symbols: state.symbolsPicker.symbols,
});

export default connect(mapStateToProps)(DroppableContainer);
