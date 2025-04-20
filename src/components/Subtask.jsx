import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Subtask({index , taskIndex , colIndex}) {
    const dispatch = useDispatch()
    const boards = useSelector(state => state.boards)
    const board = boards.find(board => board.isActive)
    const columns = board.columns
    const col = columns.find((column , i) => colIndex === i)
    const task = col.tasks.find((col , i) => taskIndex === i)
    const subtask = task.subtasks.find((subtask , i  ) => i === index)
    const checked = subtask.isCompleted




  return (
    <div className=' w-full flex hover:bg-[#635fc740] dark:hover:bg-[#635fc740]
    rounded-md relative items-center justify-start dark:bg-[#20212c] p-3 gap-4 bg-[#f4f7fd] '>

        <input type="checkbox" className=' w-4 h-4 accent-[#635fc7] cursor-pointer' checked={checked}/>

        <p className={checked && 'line-throuhg opacity-30'}>
            {subtask.title}
        </p>
    </div>
  )
}

export default Subtask