import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { set } from 'mongoose';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';



export default function DashApartments() {

    const { currentUser } = useSelector((state) => state.user);
    const [apartments, setApartments] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);

    const [apartmentIdToDelete, setApartmentIdToDelete] = useState('');
    const [apartmentIdToUpdate, setApartmentIdToUpdate] = useState('');

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
    }, [currentUser._id]);


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

    const handleUpdateApartment = async () => {

    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>

                {currentUser.isAdmin && apartments.length > 0 ? (
                    <>
                        <Table hoverable className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Apartment</Table.HeadCell>
                                <Table.HeadCell>Location</Table.HeadCell>
                                <Table.HeadCell>Amount</Table.HeadCell>
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
                                                    setApartmentIdToUpdate(apartment.apartmentNumber);
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
                                                    setApartmentIdToDelete(apartment.apartmentNumber);
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
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to Update?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleUpdateApartment}>
                                Yes, Im sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModalUpdate(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    );
}