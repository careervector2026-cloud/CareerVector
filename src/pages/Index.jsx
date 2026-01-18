import React from 'react'
import { useNavigate} from 'react-router-dom'
const Index = () => {
  const navigate = useNavigate();
  return (
    <>
    <div className='flex justify-center items-center min-h-screen bg-gray-300'>
        <div className="flex flex-col justify-center items-center gap-5h-75 w-75 bg-gray-200">
          <div>CareerVortex</div>
          <div className='flex gap-5'>
            <button onClick={()=>navigate("/student/login")}>Student</button>
            <button onClick={()=>navigate("/recruiter/login")}>Recruiter</button>
          </div>
        </div>
    </div>
    </>
  )
}

export default Index