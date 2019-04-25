import React from 'react';
import { Droppable, DragDropContext } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import DraggableSymbol from './DraggableSymbol';
import { updateOrder } from '../../actions/symbolsPicker';

const DroppableContainer = ({ dispatch, symbols }) => {
  const onDragEnd = result => {
    const { destination, source } = result;
    if (source && destination) {
      const newSymbols = cloneDeep(symbols);
      const element = newSymbols[source.index];
      newSymbols.splice(source.index, 1);
      newSymbols.splice(destination.index, 0, element);
      dispatch(updateOrder(newSymbols));
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
