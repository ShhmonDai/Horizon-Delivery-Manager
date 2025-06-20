import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {

    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password) {
            return setErrorMessage('Please fill out all fields')
        }

        try {
            setLoading(true);
            setErrorMessage(null);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success === false) {
                setLoading(false);
                return setErrorMessage(data.message);
            }

            if (res.ok) {
                navigate('/sign-in');
            }

        } catch (error) {
            setErrorMessage(error.message);
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen mt-20'>

            <div className='flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-top sm:gap-10 md:gap-20'>
                {/* left side */}
                <div className='flex-1'>
                    <Link to="/" className='font-bold dark:text-white text-2xl sm:text-4xl'>
                        <span className='px-2 py-1 bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 rounded-lg text-white'>
                           The Horizon
                        </span>
                        Manager
                    </Link>
                    <p className='text-sm mt-5 mb-10'>
                        Welcome to Horizon Package Manager. You can sign up with your email and password or with Google account for initial access. For full access you have to wait for 
                        permissions to be granted to your account by the administrator.
                    </p>

                    <p className='text-center lg:text-left text-sm mt-5 font-bold mb-20'>
                        For a preview: A Demo Account has already been created. Available at the
                        <span className="px-1">
                            <Link to='/sign-in' className='text-blue-500'>
                                Sign In
                            </Link> page.
                        </span>
                    </p>
                </div>


                {/* right side */}
                <div className='flex-1'>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div className=''>
                            <Label value='Your username' />
                            <TextInput type='text' placeholder='Username' id='username' onChange={handleChange} />
                        </div>
                        <div className=''>
                            <Label value='Your email' />
                            <TextInput type='email' placeholder='name@company.com' id='email' onChange={handleChange} />
                        </div>
                        <div className=''>
                            <Label value='Your passsword' />
                            <TextInput type='password' placeholder='********' id='password' onChange={handleChange} />
                        </div>
                        <Button gradientDuoTone='pinkToOrange' type='submit' disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner size='sm' />
                                    <span className='pl-3'>Loading...</span>
                                </>
                            ) : ('Sign up'
                            )}
                        </Button>
                        <OAuth />
                    </form>
                    <div className='flex gap-2 text-sm mt-5 mb-20'>
                        <span>Have an account?</span>
                        <Link to='/sign-in' className='text-blue-500'>
                            Sign In
                        </Link>
                    </div>
                    {
                        errorMessage && (
                            <Alert className='mt-5' color='failure' onDismiss={() => setErrorMessage(null)}>
                                {errorMessage}
                            </Alert>
                        )
                    }
                </div>

            </div>
        </div>
    )
}