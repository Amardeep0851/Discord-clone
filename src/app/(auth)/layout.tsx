import React from 'react'

function authLayout({children}:{children:React.ReactNode}) {
  return (
    <div className="w-screen flex justify-center pt-10 h-screen">
      {children}
    </div>
  )
}

export default authLayout