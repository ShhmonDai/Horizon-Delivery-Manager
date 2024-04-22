import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';




export default function Pin() {

    const [email, setEmail] = useState(import.meta.env.VITE_QUICK_USER);
    const [formPinData, setFormPinData] = useState({ email: email });
    const { loading, error: errorMessage } = useSelector(state => state.user);
    const [errorMessageAlert, setErrorMessageAlert] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const clearAlert = () => {
        setErrorMessageAlert(null);
    };

    const handlePinChange = (e) => {
        setFormPinData({ ...formPinData, [e.target.id]: e.target.value.trim() });
    };
    const handlePinSubmit = async (e) => {

        e.preventDefault();

        if (!formPinData.email || !formPinData.password) {
            return setErrorMessageAlert('Please fill all the fields');
        }

        try {
            setErrorMessageAlert(null);
            dispatch(signInStart());
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formPinData),
            });

            const data = await res.json();
            if (data.success === false) {
                setErrorMessageAlert(data.message);
                dispatch(signInFailure(data.message));
            }


            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/packages');
            }

        } catch (error) {
            setErrorMessageAlert(error.message);
            dispatch(signInFailure(error.message));
        }
    };



  return (
    <div className=' mb-20 flex flex-col items-center'>
        <h1 className='my-4 text-4xl'>
            For Quick Access
        </h1>
          <span className='my-4' >Please Enter the 4-Digit PIN:</span>

        

        <form className='flex flex-col gap-4' onSubmit={handlePinSubmit}>



            <div className=''>

              <TextInput type='password' id='password' placeholder='****' autoComplete='password' maxLength="4" onChange={handlePinChange}/>
            </div>
              <Button gradientDuoTone='pinkToOrange' type='submit' disabled={loading}>
                  {loading ? (
                      <>
                          <Spinner size='sm' />
                          <span className='pl-3'>Loading...</span>
                      </>
                  ) : ('Sign In'
                  )}
              </Button>
        </form>

          {errorMessageAlert && (
              <Alert className='mt-5' color='failure' onDismiss={() => clearAlert()}>
                  {errorMessageAlert}
              </Alert>
          )
          }
        
    </div>
  )
}
