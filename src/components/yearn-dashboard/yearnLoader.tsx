import React from 'react'
import Image from 'next/image'

const YearnLoader: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <Image
        src="/icons/logo.svg"
        alt="Yearn Finance Logo"
        width={50}
        height={50}
        // className="animate-pulse"
      />
      <div className="absolute flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-t-transparent border-[#0657F9] rounded-full animate-spin"></div>
      </div>
    </div>
  )
}

export default YearnLoader
