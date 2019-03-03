import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const DraggableItemWrapper = ({ props }) => {
  const { draggableId, index } = props;
  return (
    <Draggable draggableId={draggableId} index={index}>
      {provided => (
        <div
          className={props.className}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {props.children}
        </div>
      )}
    </Draggable>
  );
};

export default DraggableItemWrapper;
