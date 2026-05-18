import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

const PublishCourse = () => {
    const {register,handleSubmit,setValue,getValues, formState:{errors}} = useForm()
    const dispatch = useDispatch();
    const {token} = useSelector((state)=>state.auth)
    const {course} = useSelector((state)=> state.course)
    const [loading,setLoading] = useState(false)
    
    const onSubmit = ( data )=>{

    }

  return (
    <div>
        <p> Publish Course </p>
        <form onSubmit={handleSubmit(onSubmit)}>
                <div> 
                    <label htmlFor='public'> Make this Course as Publish </label>
                    <input 
                        type='checkbox' 
                        id='public'
                        {...register("status")}
                          />  
                </div> 
        </form>
    </div>
  )
} 

export default PublishCourse