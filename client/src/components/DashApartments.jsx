import { Modal, Table, Button, TextInput, Alert, Label } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';




export default function DashApartments() {

    const { currentUser } = useSelector((state) => state.user);
    const [apartments, setApartments] = useState([]);
    const [reload, setReload] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [showModalCreate, setShowModalCreate] = useState(false);

    const [apartmentIdToDelete, setApartmentIdToDelete] = useState('');
    const [apartmentToFind, setApartmentToFind] = useState('')

    const [formData, setFormData] = useState({});
    const [formDataCreate, setFormDataCreate] = useState({});

    const [publishError, setPublishError] = useState(null);


    useEffect(() => {
        const fetchApartments = async () => {
            try {
                const res = await fetch(`/api/apartment/getapartments`);
                const data = await res.json();
                if (res.ok) {
                    setApartments(data.apartments);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchApartments();
        }
    }, [currentUser._id, reload, currentUser.isAdmin]);

    const searchApartment = () => {
        console.log(apartmentToFind);
        if (apartmentToFind == '') {
            clearSearch();
        } else {    
            setApartments((prev) => prev.filter((apartment) => apartment.apartmentNumber == apartmentToFind));
        }
    };

    const clearSearch = () => {
        reload ? setReload(false) : setReload(true);
        setApartmentToFind('');
    };


    const handleDeleteApartment = async () => {
        try {
            const res = await fetch(`/api/apartment/deleteapartment/${apartmentIdToDelete}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                setApartments((prev) => prev.filter((apartment) => apartment._id !== apartmentIdToDelete));
                setShowModal(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/apartment/updateapartment/${formData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }

            if (res.ok) {
                setPublishError(null);
                setShowModalUpdate(false);
                reload ? setReload(false) : setReload(true);
            }
        } catch (error) {
            setPublishError('Something went wrong');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/apartment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataCreate),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                return;
            }

            if (res.ok) {
                setPublishError(null);
                setShowModalCreate(false);
                reload ? setReload(false) : setReload(true);
            }
        } catch (error) {
            setPublishError('Something went wrong');
        }
    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>

        <div className='flex justify-center gap-2 my-5'>
                <TextInput className='w-full' placeholder='Find Apartment... ' value={apartmentToFind} onChange={(e) => setApartmentToFind(((e.target.value).toUpperCase()))} />
                <Button gradientDuoTone="pinkToOrange" onClick={searchApartment}>Find</Button>
                <Button gradientDuoTone="pinkToOrange" outline onClick={clearSearch}>Clear</Button>
        </div>

                {currentUser.isAdmin && apartments.length > 0 ? (
                    <>
                        <Table hoverable className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Apartment</Table.HeadCell>
                                <Table.HeadCell>Pkg Location</Table.HeadCell>
                                <Table.HeadCell>Number of Pkgs</Table.HeadCell>
                                <Table.HeadCell>Update</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>
                            
                            {apartments.map((apartment) => (
                                <Table.Body className='divide-y' key={apartment.apartmentNumber}>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>

                                        <Table.Cell>{apartment.apartmentNumber}</Table.Cell>
                                        <Table.Cell>{apartment.packageLocation}</Table.Cell>
                                        <Table.Cell>{apartment.packageAmount}</Table.Cell>

                                        <Table.Cell>
                                            <span
                                                onClick={() => {
                                                    setShowModalUpdate(true);
                                                    setApartmentIdToUpdate(apartment._id);
                                                    setApartmentNumToUpdate(apartment.apartmentNumber);
                                                    setFormData({ ...formData, _id: apartment._id, apartmentNumber: apartment.apartmentNumber, packageLocation: apartment.packageLocation, packageAmount: apartment.packageAmount });
                                                }}
                                                className='font-medium text-cyan-500 hover:underline cursor-pointer'
                                            >
                                                Update
                                            </span>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <span
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setApartmentIdToDelete(apartment._id);

                                                }}
                                                className='font-medium text-red-500 hover:underline cursor-pointer'
                                            >
                                                Delete
                                            </span>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                        
                    </>
                ) : (
                    <p>There are no apartments!</p>
                )}


            
            <div className='mt-10 flex justify-center'> 
                <span
                    onClick={() => {
                        setShowModalCreate(true);
                 }}
                  className='font-medium text-blue-500 hover:underline cursor-pointer'
                    >
                  Add a new Apartment
                </span>
            </div>
  


                <Modal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    popup
                    size='md'
                >
                    <Modal.Header />
                    <Modal.Body>
                        <div className='text-center'>
                            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                                Are you sure you want to delete this apartment?
                            </h3>
                            <div className='flex justify-center gap-4'>
                                <Button color='failure' onClick={handleDeleteApartment}>
                                    Yes, Im sure
                                </Button>
                                <Button color='gray' onClick={() => setShowModal(false)}>
                                    No, cancel
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

            <Modal
                show={showModalUpdate}
                onClose={() => setShowModalUpdate(false)}
                popup
                size='md'
            >
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Update The Apartment:
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <Label>Apartment Number</Label>
                            <TextInput type='text' placeholder='Apt Number' id='apartmentNumber' value={formData.apartmentNumber} onChange={(e) =>
                                setFormData({ ...formData, apartmentNumber: (e.target.value).toUpperCase() })
                            } />
                            <Label>Package Location</Label>
                            <TextInput type='text' placeholder='Pkg Location' id='packageLocation' value={formData.packageLocation} onChange={(e) =>
                                setFormData({ ...formData, packageLocation: e.target.value })
                            } />
                            <Label>Number of Packages</Label>
                            <TextInput type='text' placeholder='Number of packages' id='packageAmount' value={formData.packageAmount} onChange={(e) =>
                                setFormData({ ...formData, packageAmount: e.target.value })
                            } />

                        <div className='my-5 flex justify-center gap-4'>
                                <Button color='gray' type='submit'>
                                Update
                            </Button>
                            <Button color='gray' onClick={() => setShowModalUpdate(false)}>
                                Cancel
                            </Button>
                        </div>

                        </form>
                       
                        {publishError && (
                            <Alert className='mt-5' color='failure'>
                                {publishError}
                            </Alert>
                        )}
                            
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                show={showModalCreate}
                onClose={() => setShowModalCreate(false)}
                popup
                size='md'
            >
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Add a new Apartment:
                        </h3>
                        <form onSubmit={handleCreate}>
                            <Label>Apartment Number</Label>
                            <TextInput type='text' placeholder='Apartment' id='apartmentNumber' value={formDataCreate.apartmentNumber} onChange={(e) =>
                                setFormDataCreate({ ...formDataCreate, apartmentNumber: (e.target.value).toUpperCase() })
                            } />
                            <Label>Package Location</Label>
                            <TextInput type='text' placeholder='Package Location' id='packageLocation' value={formDataCreate.packageLocation} onChange={(e) =>
                                setFormDataCreate({ ...formDataCreate, packageLocation: e.target.value })
                            } />
                            <Label>Number of Packages</Label>
                            <TextInput type='text' placeholder='Number of Packages' id='packageAmount' value={formDataCreate.packageAmount} onChange={(e) =>
                                setFormDataCreate({ ...formDataCreate, packageAmount: e.target.value })
                            } />

                            <div className='my-5 flex justify-center gap-4'>
                                <Button color='gray' type='submit'>
                                    Add
                                </Button>
                                <Button color='gray' onClick={() => setShowModalCreate(false)}>
                                    Cancel
                                </Button>
                            </div>

                        </form>

                        {publishError && (
                            <Alert className='mt-5' color='failure'>
                                {publishError}
                            </Alert>
                        )}

                    </div>
                </Modal.Body>
            </Modal>

        </div>
    );
}