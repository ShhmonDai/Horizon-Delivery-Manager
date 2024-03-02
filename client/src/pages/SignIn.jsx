import { Button, Label, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";


export default function SignIn() {

    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const [error, setError] = useState(null);   


    const handleChange = (e) => {
        setFormData({[e.target.id]: e.target.value});
    };
        


    const handleSubmit = (e) => {
        setError(null);
        e.preventDefault();
        if(formData.password == '1234') {
            navigate('/Home');
        } else {
            setError('Wrong PIN. Please try again');
        }
    };


  return (
    <div className='min-h-screen mt-20 flex flex-col items-center'>
        <h1 className='my-4'>
            Please Enter the 4-Digit PIN:
        </h1>

        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className=''>
              <TextInput type='password' id='password' placeholder='****' autoComplete='password' onChange={handleChange}/>
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit'>Submit</Button>
        </form>
        
    </div>
  )
}
