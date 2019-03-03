import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

const DroppableWrapper = ({ props }) => {
  const { droppableId } = props;
  return (
    <Droppable droppableId={droppableId}>
      {provided => (
        <div
          className={props.className}
          ref={provided.innerRef}
          {...provided.droppableProps}
          {...provided.droppablePlaceholder}
        >
          {props.children}
        </div>
      )}
    </Droppable>
  );
};

export default DroppableWrapper;
