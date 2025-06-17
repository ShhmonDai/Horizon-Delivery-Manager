import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';




export default function DashProfile() {
    const { currentUser, error, loading } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    console.log(imageFileUploadProgress, imageFileUploadError);
    const filePickerRef = useRef();
    const dispatch = useDispatch();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);


    const uploadImage = async () => {

        setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
            'state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageFileUploadError('Could not upload image (File must be less than 2MB)'
                );
                setImageFileUploadProgress(null);
                setImageFile(null);
                setImageFileUrl(null);
                setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setFormData({ ...formData, profilePicture: downloadURL });
                    setImageFileUploading(false);
                });
            }
        );
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);

        if (Object.keys(formData).length === 0) {
            setUpdateUserError('No changes made');
            return;
        }
        if (imageFileUploading) {
            setUpdateUserError('Please wait for image to upload');
            return;
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User's profile updated successsfuly");
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message));
            } else {
                dispatch(deleteUserSuccess(data));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='min-h-screen max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden
                />
                <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()} >
                    {imageFileUploadProgress && (
                        <CircularProgressbar value={imageFileUploadProgress || 0} text={
                            `${imageFileUploadProgress}%`}
                            strokeWidth={4}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgba(59, 130, 246, ${imageFileUploadProgress / 100})`,
                                    strokeLinecap: 'round',
                                },
                                text: {
                                    fill: '#3b82f6',
                                    fontSize: '22px',
                                },
                            }}
                        />
                    )}
                    <img src={imageFileUrl || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full border-4 border-red-400 ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-20'}`} />
                </div>


                {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}

                {currentUser.email == 'demo@demo.com' ?
                    <>
                        <TextInput color='gray' type='text' id='username' placeholder='username' defaultValue={currentUser.username} disabled={currentUser.email == 'demo@demo.com'} />
                        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} disabled={currentUser.email == 'demo@demo.com'} />
                        <TextInput type='password' id='password' placeholder='password' autoComplete='password' disabled={currentUser.email == 'demo@demo.com'} />
                    </>
                    :
                    <>
                        <TextInput color='gray' type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} disabled={currentUser.email == 'demo@demo.com'} />
                        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange} disabled={currentUser.email == 'demo@demo.com'} />
                        <TextInput type='password' id='password' placeholder='old password' autoComplete='old password' onChange={handleChange} disabled={currentUser.email == 'demo@demo.com'} />
                        <TextInput type='password' id='passwordnew' placeholder='new password' autoComplete='new password' onChange={handleChange} disabled={currentUser.email == 'demo@demo.com'} />
                    </>
                }

                {currentUser.email == 'demo@demo.com' ?
                    <Button type='button' gradientDuoTone="pinkToOrange" outline disabled={loading || imageFileUploading || currentUser.email == 'demo@demo.com'}>
                        {loading || imageFileUploading ? 'Loading...' : 'Update'}
                    </Button>
                    :
                    <Button type='submit' gradientDuoTone="pinkToOrange" outline disabled={loading || imageFileUploading || currentUser.email == 'demo@demo.com'}>
                        {loading || imageFileUploading ? 'Loading...' : 'Update'}
                    </Button>
                }





            </form>
            <div className='text-red-500 flex justify-between mt-5'>
                {currentUser.email == 'demo@demo.com' ? <span className='line-through'>Delete Account</span> :
                    <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
                }
                <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
            </div>
            {updateUserSuccess && (<Alert color='success' className='mt-5'>
                {updateUserSuccess}
            </Alert>)
            }
            {updateUserError && (<Alert color='failure' className='mt-5'>
                {updateUserError}
            </Alert>)}


                <Modal dismissible show={showModal} onClose={() => setShowModal(false)} popup size='md' >

                    <Modal.Header className='bg-[rgba(0,0,0,0.3)]' />
                    <Modal.Body className='bg-[rgba(0,0,0,0.3)]'>
                        <div className='text-center'>
                            <HiOutlineExclamationCircle className='h-14 w-14 text-red-800 dark:text-red-700 mb-4 mx-auto' />
                            <h3 className='mb-5 text-lg text-white dark:text-white'>
                                Are you sure you want to delete your account?
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <Button color='failure' onClick={handleDeleteUser} >
                                    Yes, Im sure
                                </Button>
                                <Button color='gray' onClick={() => setShowModal(false)}>
                                    No, cancel
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>


        </div>
    )
}