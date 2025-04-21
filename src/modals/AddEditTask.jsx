import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import crossIcon from "../assets/icon-cross.svg";
import { useSelector, useDispatch } from 'react-redux';
import boardSlice from '../redux/boardsSlice';

function AddEditTask({
  type,
  device,
  setOpenAddEditTask,
  setIsTaskModalOpen,
  taskIndex,
  pervColIndex = 0,
}) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const board = useSelector((state) =>
    state.boards.find((board) => board.isActive)
  );

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const columns = board?.columns || [];
  const col = columns.find((col, index) => index === pervColIndex);
  const task = Array.isArray(col?.tasks)
    ? col.tasks.find((task, index) => index === taskIndex)
    : null;

  const [status, setStatus] = useState(columns[pervColIndex]?.name || '');
  const [newColIndex, setnewColIndex] = useState(pervColIndex);
  const [subtasks, setSubtasks] = useState([
    { title: '', isCompleted: false, id: uuidv4() },
    { title: '', isCompleted: false, id: uuidv4() },
  ]);

  useEffect(() => {
    if (
      type === 'edit' &&
      isFirstLoad &&
      task &&
      Array.isArray(task.subtasks)
    ) {
      setSubtasks(
        task.subtasks.map((subtask) => ({
          ...subtask,
          id: uuidv4(),
        }))
      );
      setTitle(task.title);
      setDescription(task.description);
      setIsFirstLoad(false);
    }
  }, [type, isFirstLoad, task]);

  const onChange = (id, newValue) => {
    setSubtasks((prevState) => {
      const newState = [...prevState];
      const subtask = newState.find((subtask) => subtask.id === id);
      subtask.title = newValue;
      return newState;
    });
  };

  const onChangeStatus = (e) => {
    setStatus(e.target.value);
    setnewColIndex(e.target.selectedIndex);
  };

  const onDelete = (id) => {
    setSubtasks((prevState) => prevState.filter((el) => el.id !== id));
  };

  const validated = () => {
    if (!title.trim()) {
      setIsValid(false);
      setErrorMessage('Task name cannot be empty');
      return false;
    }

    for (let i = 0; i < subtasks.length; i++) {
      if (!subtasks[i].title.trim()) {
        setIsValid(false);
        setErrorMessage('Subtask titles cannot be empty');
        return false;
      }
    }

    setIsValid(true);
    setErrorMessage('');
    return true;
  };

  const onSubmit = (type) => {
    if (type === 'add') {
      dispatch(
        boardSlice.actions.addTask({
          title,
          description,
          subtasks,
          status,
          newColIndex,
        })
      );
    } else {
      const updatedBoard = { ...board }; // Copy the board to avoid mutation
      const updatedColumn = updatedBoard.columns[pervColIndex];
      
      // Create a new task object to avoid mutation
      const updatedTask = {
        ...task,
        title,
        description,
        subtasks,
        status,
      };

      // Replace the task in the column
      updatedColumn.tasks = updatedColumn.tasks.map((t, index) =>
        index === taskIndex ? updatedTask : t
      );

      // Dispatch the action with the updated board
      dispatch(
        boardSlice.actions.updateBoard(updatedBoard)
      );
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        setOpenAddEditTask(false);
      }}
      className={
        device === 'mobile'
          ? 'py-6 px-6 pb-40 absolute overflow-y-scroll left-0 right-0 top-0 bottom-[-100vh] bg-[#000000]'
          : 'py-6 px-6 pb-40 absolute overflow-y-scroll left-0 right-0 top-0 bottom-0 bg-[#000000]'
      }
    >
      <div className="scrollbar-hide overflow-y-scroll max-h-[95vh] my-auto bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
        <h3 className="text-lg">{type === 'edit' ? 'Edit' : 'Add New'} Task</h3>

        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm dark:text-white text-gray-500">Task Name</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent px-4 py-2 outline-none rounded-md text-sm border border-gray-600 focus:outline-[#635fc7]"
            type="text"
            placeholder="e.g Take coffee break"
          />
        </div>

        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm dark:text-white text-gray-500">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-transparent px-4 py-2 outline-none min-h-[200px] rounded-md text-sm border border-gray-600 focus:outline-[#635fc7]"
            placeholder="e.g It's always good to take a coffee break. This 15 minute break will recharge the batteries a little"
          />
        </div>

        <div className="mt-8 flex flex-col space-y-1">
          <label className="text-sm dark:text-white text-gray-500">Subtasks</label>
          {subtasks.map((subtask, index) => (
            <div key={index} className="flex items-center w-full">
              <input
                onChange={(e) => onChange(subtask.id, e.target.value)}
                type="text"
                value={subtask.title}
                className="bg-transparent outline-none flex-grow px-4 py-2 rounded-md text-sm border border-gray-600 focus:outline-[#635fc7]"
                placeholder="e.g. Take coffee break"
              />
              <img
                onClick={() => onDelete(subtask.id)}
                src={crossIcon}
                className="m-4 cursor-pointer"
                alt="delete"
              />
            </div>
          ))}

          <button
            onClick={() =>
              setSubtasks((state) => [
                ...state,
                { title: '', isCompleted: false, id: uuidv4() },
              ])
            }
            className="w-full items-center dark:text-[#635fc7] dark:bg-white text-white bg-[#635fc7] py-2 rounded-full"
          >
            + Add New Subtask
          </button>
        </div>

        <div className="mt-8 flex flex-col space-y-3">
          <label className="text-sm dark:text-white text-gray-50">Current Status</label>
          <select
            value={status}
            onChange={onChangeStatus}
            className="select-status flex flex-grow px-4 py-2 rounded-md text-sm bg-white dark:bg-[#2b2c37] 
            border border-gray-300 focus:outline-[#635fc7]"
          >
            {columns.map((column, index) => (
              <option value={column.name} key={index}>
                {column.name}
              </option>
            ))}
          </select>

          {!isValid && errorMessage && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}

          <button
            onClick={() => {
              const formValid = validated();
              if (formValid) {
                onSubmit(type);
                setOpenAddEditTask(false);
              }
            }}
            className="w-full items-center text-white bg-[#635fc7] py-2 rounded-full"
          >
            {type === 'edit' ? 'Save Edit' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEditTask;
