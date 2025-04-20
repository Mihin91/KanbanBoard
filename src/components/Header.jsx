import React, { useState } from 'react'
import logo from '../assets/logo-mobile.svg'
import iconDown from "../assets/icon-chevron-down.svg"
import iconUp from "../assets/icon-chevron-up.svg"
import ellipsis from "../assets/icon-vertical-ellipsis.svg"
import HeaderDropdown from './HeaderDropdown'
import AddEditBoardModal from '../modals/AddEditBoardModal'
import AddEditTask from '../modals/AddEditTask'
import { useDispatch, useSelector } from 'react-redux'
import ElipsisMenu from './ElipsisMenu'
import DeleteModal from '../modals/DeleteModal'
import boardSlice from '../redux/boardsSlice'



function Header({setBoardModalOpen , boardModalOpen}) {

    const [openDropdown, setOpenDropdown] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [openAddEditTask, setOpenAddEditTask] = useState(false)
    const [isElipsisOpen, setIsElipsisOpen] = useState(false)
    const [ boardType ,  setBoardType] = useState('add')
    const dispatch = useDispatch()
    const boards = useSelector( state => state.boards)
    const board = boards.find( board => board.isActive)

    const setOpenEditModal = () => {
        setBoardModalOpen(true)
        setIsElipsisOpen(false)
    }

    const setOpenDeleteModal = () => {
        setIsDeleteModalOpen(true)
        setIsElipsisOpen(false)
    }

    const onDeleteBtnClick = () => {
        dispatch(boardSlice.actions.deleteBoard())
        dispatch(boardSlice.actions.setBoardActive({index : 0}))
        setIsDeleteModalOpen(false)
    }

    const onDropDownClick = () => {
        setOpenDropdown(state => !state)
        setIsElipsisOpen(false)
        setBoardType('add')
    }

  return (
    <div className =' p-4 fixed left-0 bg-white dark:bg-[#2b2d42] z-50 right-0'>
        <header className= ' flex justify-between dark:text-white items-center'>

            {/*left side*/}

            <div className=' flex items-center space-x-2 md:space-x-4 '>
                <img src={logo} alt="logo"className=' h-6 w-6'/>
                <h3 className=' hidden md:inline-block font-bold font-sans md:text-4xl '> 
                    Kanban
                </h3>
                <div className=' flex items-center'>
                    <h3 className=' truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 '>
                        {board?.name}
                    </h3>
                    <img src={openDropdown ? iconUp: iconDown} alt="dropdown icon" className=' w-3 ml-2 md:hidden '
                    onClick={onDropDownClick}/>
                </div> 
            </div>

            {/*Right side*/}

            <div className=' flex space-x-4 items-center md:space-x-6'>
                <button 
                onClick={() => {
                    setOpenAddEditTask(state => !state)
                }}
                className= ' hidden md:block button'>
                    + Add New Task
                </button>
                
                <button 
                onClick={() => {
                    setOpenAddEditTask(state => !state)
                }}
                className=' button py-1 px-3 md:hidden'>
                    +
                </button>

                <img src={ellipsis} onClick={() => {
                    setBoardType('edit')
                    setOpenDropdown(false)
                    setIsElipsisOpen(state => !state)
                }}alt="ellipsis" className=' cursor-pointer h-6'/>

                {
                    isElipsisOpen && <ElipsisMenu 
                    setOpenDeleteModal={setOpenDeleteModal}
                    setOpenEditModal={setOpenEditModal}
                    type='Boards'/>
                }

            </div>
        </header>

        {openDropdown && <HeaderDropdown setBoardModalOpen={setBoardModalOpen} 
        setOpenDropdown={setOpenDropdown}/>}

        {
            boardModalOpen && <AddEditBoardModal type={boardType} setBoardModalOpen = 
            {setBoardModalOpen}/>
        }

        {
            openAddEditTask && <AddEditTask setOpenAddEditTask={setOpenAddEditTask} device='mobile'
            type='add'/>

        }

        {
            isDeleteModalOpen && <DeleteModal setIsDeleteModalOpen={setIsDeleteModalOpen} 
            onDeleteBtnClick={onDeleteBtnClick} title={board?.name} type='board'/>
        }
    </div>
  )
}

export default Header