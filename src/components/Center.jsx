import React, {  useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import Column from './Column'


function Center({boardModalOpen , setBoardModalOpen}) {

  const [windowSize, setwindowSize] = useState([
    window.innerWidth,
    window.innerHeight
  ])

  const [isSideBarOpen, setisSideBarOpen] = useState(true)

  const boards = useSelector((state) => state.boards)
  const board = boards.find((board) => board.isActive === true)
  const columns = board.columns

  useEffect(() => {
    const handleWindowResize = () => {
      setwindowSize([window.innerWidth , window.innerHeight])
    }

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }

  })

  return (
    <div className={`bg-[#f4f7fd] scrollbar-hide h-screen flex dark:bg-[#20212c] overflow-x-scroll gap-6 ${
      windowSize[0] >= 768 && isSideBarOpen ? 'ml-[261px]' : 'ml-0'
    }`}>    
        {
          windowSize[0] >= 768 && (
            <SideBar/>
          )
        }

       {/*Columns section*/} 

        {
          columns.map((col , index) =>(
            <Column key={index} colIndex={index}/>
          )
          )
        }
    
    </div>
  )
}

export default Center