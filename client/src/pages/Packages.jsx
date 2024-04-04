import { Modal, Table, Button, TextInput, Alert, Label } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';


export default function Packages() {

  const { currentUser } = useSelector((state) => state.user);
  const [apartments, setApartments] = useState([]);
  const [reload, setReload] = useState(false);

  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [apartmentToFind, setApartmentToFind] = useState('')

  const [formData, setFormData] = useState({});
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

  return (
    <div className='min-h-screen table-auto overflow-x-scroll md:mx-auto max-w-2xl p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>

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
                        setFormData({ ...formData, _id: apartment._id, apartmentNumber: apartment.apartmentNumber, packageLocation: apartment.packageLocation, packageAmount: apartment.packageAmount });
                      }}
                      className='font-medium text-cyan-500 hover:underline cursor-pointer'
                    >
                      Update
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
        show={showModalUpdate}
        onClose={() => setShowModalUpdate(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Update Packages:
            </h3>
            <form onSubmit={handleSubmit}>

              <Label>Packages Location</Label>
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

    </div>
  );
}