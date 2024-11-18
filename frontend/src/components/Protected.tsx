import React from 'react'

const Protected = ({children, authentication = true} : {children: React.ReactNode, authentication : boolean}) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default Protected