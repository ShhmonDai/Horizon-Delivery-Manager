import { Modal, Table, Button, TextInput, Alert, Label, Select, Checkbox } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { BsFillHouseFill, BsBoxes } from "react-icons/bs";
import PackageHistoryModal from "../components/PackageHistoryModal";


export default function Packages() {

  const { currentUser } = useSelector((state) => state.user);
  const [apartments, setApartments] = useState([]);
  const [apartmentSearch, setApartmentSearch] = useState([]);
  const [apartmentToFind, setApartmentToFind] = useState(['']);
  const [reload, setReload] = useState(false);

  //Sorting State
  const [sortOption, setSortOption] = useState('apartmentNumberAsc');
  //Collator for proper alpha numeric sorting
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  //Hide Apartments with no packages
  const [hideEmpty, setHideEmpty] = useState(false);

  //History
  const [showModalHistory, setShowModalHistory] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);

  const handleShowHistory = (apartment) => {
    setSelectedApartment(apartment);
    setShowModalHistory(true);
  };

  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalDeliver, setShowModalDeliver] = useState(false);
  const [showModalDeliverAll, setShowModalDeliverAll] = useState(false);

  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

{/* Fetch Apartments useEffect */ }
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
    if (currentUser.isAdmin || currentUser.isWorker) {
      fetchApartments();
    }
  }, [currentUser._id, reload, currentUser.isAdmin, currentUser.isWorker]);

{/* Search useEffect */ }  
useEffect(() =>{
  const handleSearch = (e) => {
    const apartmentsCopy = apartments;
    setApartmentSearch(apartmentsCopy.filter(apartment => apartment.apartmentNumber == e));
  };

  if (apartmentToFind != '')
    handleSearch(apartmentToFind);

}, [apartmentToFind, apartments] );

{/* Submit function for updates */ }
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
        setShowModalDeliver(false);
        reload ? setReload(false) : setReload(true);

      }

    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  {/* Deliver function to Mark an apartments packages as Delivered. The results will be logged. */}
  const handleDeliver = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/apartment/markasdelivered/${formData._id}`, {
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

      setPublishError(null);
      setShowModalUpdate(false);
      setShowModalDeliver(false);
      setFormData({});
      reload ? setReload(false) : setReload(true);

    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  {/* Reset ALL apartment locations function. These won't be logged */ }
  const handleDeliverAll = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/apartment/deliverall`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      setPublishError(null);
      setShowModalDeliverAll(false);
      reload ? setReload(false) : setReload(true);

    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  {/* Sorting Logic */}
  const getSortedApartments = () => {
    let apartmentsCopy = [...apartments];

    switch (sortOption) {
      case 'apartmentNumberAsc':
        apartmentsCopy.sort((a, b) => collator.compare(a.apartmentNumber, b.apartmentNumber));
        break;
      case 'apartmentNumberDesc':
        apartmentsCopy.sort((a, b) => collator.compare(b.apartmentNumber, a.apartmentNumber));
        break;
      case 'oldestUpdate':
        apartmentsCopy.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        break;
      case 'newestUpdate':
        apartmentsCopy.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
      case 'packageAmount':
        apartmentsCopy.sort((a, b) => (parseInt(b.packageAmount || 0) - parseInt(a.packageAmount || 0)));
        break;
      default:
        break;
    }

    if (hideEmpty) {
      apartmentsCopy = apartmentsCopy.filter(
        (apt) => parseInt(apt.packageAmount) > 0
      );
    }

    return apartmentsCopy;

  };

  return (
    <div className='min-h-screen md:mx-auto max-w-2xl'>

      {/* Search Input */}
      <div className='flex justify-center gap-2 my-5 p-3'>
        <TextInput className='w-full' placeholder='Find Apartment... ' value={apartmentToFind} onChange={(e) => setApartmentToFind(((e.target.value).toUpperCase()))} />
      </div>

      <div className='min-h-screen table-auto overflow-x-scroll md:mx-auto max-w-2xl p-1 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>

        {/* Search Results Table, becomes visible if search found a result */}
        {(currentUser.isAdmin || currentUser.isWorker) && apartmentSearch.length > 0 ? (
          <div className="mb-10 p-2 sm:p-3">

            <div className="font-bold mb-3"> Search Results: </div>
            
            <Table hoverable striped className='shadow-lg shadow-slate-500 dark:shadow-[1px_5px_20px_-5px_rgb(250,250,250,0.5)]'>
              <Table.Head className="text-md">
                <Table.HeadCell>Apt</Table.HeadCell>
                <Table.HeadCell className='flex justify-center'>Shelf</Table.HeadCell>
                <Table.HeadCell className='text-lg'><BsBoxes /></Table.HeadCell>
                <Table.HeadCell>Update</Table.HeadCell>
                <Table.HeadCell className="hidden sm:table-cell">Deliver</Table.HeadCell>
                <Table.HeadCell className="hidden sm:table-cell">Date updated</Table.HeadCell>
              </Table.Head>

              {apartmentSearch.map((apartment) => (
                <Table.Body className="border-y-2 border-gray-100 dark:border-gray-700 text-lg" key={apartment.apartmentNumber}>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>

                    <Table.Cell onClick={() => handleShowHistory(apartment)} className='font-bold cursor-pointer'>{apartment.apartmentNumber}</Table.Cell>
                    <Table.Cell onClick={() => handleShowHistory(apartment)} className='font-semibold flex justify-center cursor-pointer'>{apartment.packageLocation}</Table.Cell>
                    <Table.Cell onClick={() => handleShowHistory(apartment)} className='font-semibold cursor-pointer'>{apartment.packageAmount}</Table.Cell>

                    <Table.Cell >
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

                    <Table.Cell className="hidden sm:table-cell">
                      <span
                        onClick={() => {
                          setShowModalDeliver(true);
                          setFormData({ ...formData, _id: apartment._id, apartmentNumber: apartment.apartmentNumber, packageLocation: '', packageAmount: '' });
                        }}
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                      >
                        Deliver
                      </span>
                    </Table.Cell>
                    <Table.Cell className="hidden sm:table-cell cursor-pointer" onClick={() => handleShowHistory(apartment)}>
                      {new Date(apartment.updatedAt).toLocaleDateString()}
                    </Table.Cell>

                  </Table.Row>
                </Table.Body>
              ))}
            </Table>

          </div>
        ) : (<p></p>)
        }

        <div className="font-bold mb-5 px-3 text-center ">All Apartments:</div>

        {/* Sort By */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5 px-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="sort" className="font-semibold">Sort by:</Label>
            <Select
              id="sort"
              className=" dark:bg-gray-800"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="apartmentNumberAsc">Apartment Number ↑</option>
              <option value="apartmentNumberDesc">Apartment Number ↓</option>
              <option value="newestUpdate">Newest Update</option>
              <option value="oldestUpdate">Oldest Update</option>
              <option value="packageAmount">Number of Packages</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              type="checkbox"
              id="hideEmpty"
              checked={hideEmpty}
              onChange={() => setHideEmpty((prev) => !prev)}
              className="h-4 w-4"
            />
            <Label htmlFor="hideEmpty" className="font-semibold">Hide Empty</Label>
          </div>
        </div>


        {/* All apartments Table */}
        <div className="flex justify-center ">
        {(currentUser.isAdmin || currentUser.isWorker) && apartments.length > 0 ? (
          <>

            
              <Table hoverable striped className='shadow-lg mb-10 w-fit'>
                <Table.Head className="text-md">
                  <Table.HeadCell>Apt</Table.HeadCell>
                  <Table.HeadCell className=''> Shelf </Table.HeadCell>
                  <Table.HeadCell className='text-lg'> <BsBoxes /> </Table.HeadCell>
                  <Table.HeadCell>Update</Table.HeadCell>
                  <Table.HeadCell className="hidden sm:table-cell">Deliver</Table.HeadCell>
                  <Table.HeadCell className="hidden sm:table-cell">Date updated</Table.HeadCell>
                </Table.Head>

              {getSortedApartments().map((apartment) => (
                <Table.Body className="border-y-2 text-md border-gray-100 dark:border-gray-700" key={apartment.apartmentNumber}>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>

                    <Table.Cell onClick={() => handleShowHistory(apartment)} className='font-bold cursor-pointer'>{apartment.apartmentNumber}</Table.Cell>
                    <Table.Cell onClick={() => handleShowHistory(apartment)} className="flex justify-center cursor-pointer">{apartment.packageLocation}</Table.Cell>
                    <Table.Cell onClick={() => handleShowHistory(apartment)} className="cursor-pointer">{apartment.packageAmount}</Table.Cell>

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

                    <Table.Cell className="hidden sm:table-cell">
                      <span
                        onClick={() => {
                          setShowModalDeliver(true);
                          setFormData({ ...formData, _id: apartment._id, apartmentNumber: apartment.apartmentNumber, packageLocation: '', packageAmount: ''});
                        }}
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                      >
                        Deliver
                      </span>
                    </Table.Cell>
                    <Table.Cell onClick={() => handleShowHistory(apartment)} className="hidden sm:table-cell cursor-pointer">
                      {new Date(apartment.updatedAt).toLocaleDateString()}
                    </Table.Cell>

                  </Table.Row>
                </Table.Body>
              ))}
            </Table>

          </>
        ) : (
              (currentUser.isAdmin || currentUser.isWorker) ? <p className="text-center">There are no apartments!</p> : <p className="text-center">You are not authorized to organize the packages, contact the administrator to be granted permission</p>
        )}


      </div>
      
      {(currentUser.isAdmin || currentUser.isWorker) && apartmentSearch.length > 0 ? (
        <div onClick={() => { setShowModalDeliverAll(true); }} className='mb-10 font-medium text-center text-red-500 hover:underline cursor-pointer'>
          Reset All Apartments
        </div>
      ) : ( <></> )}

      {/* Modal for updating apartments */}
      <Modal
        dismissible
        show={showModalUpdate}
          onClose={() => { setShowModalUpdate(false); }}
        popup
        size='md'
      >
        <Modal.Header> 
          <div className="text-2xl">
            Apartment: {formData.apartmentNumber}
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='text-center'>
            <h3 className='my-5 text-lg text-gray-500 dark:text-gray-400'>
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

              <div className='my-10 flex justify-center gap-4'>
                <Button color='gray' type='submit'>
                  Update
                </Button>
                  <Button color='gray' onClick={() => { setShowModalUpdate(false); }}>
                  Cancel
                </Button>
              </div>

            </form>

            <div
              onClick={() => {
                setShowModalUpdate(false); // Close the Update Modal first
                setShowModalDeliver(true); // Open the Deliver Modal
              }}
              className='mb-5 font-medium text-red-500 hover:underline cursor-pointer'
            >
              Deliver
            </div>

            {publishError && (
              <Alert className='mt-5' color='failure'>
                {publishError}
              </Alert>
            )}

          </div>
        </Modal.Body>
      </Modal>

      {/* Modal to mark packages as delivered */}      
      <Modal
        dismissible
        show={showModalDeliver}
        onClose={() => { setShowModalDeliver(false); }}
        popup
        size='md'
      >
      <Modal.Header>
          <div className="text-2xl">
            Apartment: {formData.apartmentNumber}
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='text-center'>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to mark the package as delivered?
            </h3>
            <form onSubmit={handleDeliver}>

              <div className='my-5 flex justify-center gap-4'>
                <Button color='gray' type='submit'>
                  Mark As Delivered
                </Button>
                <Button color='gray' onClick={() => { setShowModalDeliver(false); }}>
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


      {/* Modal to mark packages as delivered */}
      <Modal
          dismissible
          show={showModalDeliverAll}
          onClose={() => { setShowModalDeliverAll(false); }}
          popup
          size='md'
        >
          <Modal.Header />
          <Modal.Body>
            <div className='text-center'>
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                This will reset the locations and package amounts for all apartments. Are you sure you want to proceed?
              </h3>
              <form onSubmit={handleDeliverAll}>

                <div className='my-5 flex justify-center gap-4'>
                  <Button color='gray' type='submit'>
                    Reset
                  </Button>
                  <Button color='gray' onClick={() => { setShowModalDeliverAll(false); }}>
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

      <PackageHistoryModal
        showModalHistory={showModalHistory}
        setShowModalHistory={setShowModalHistory}
        selectedApartment={selectedApartment}
      />

      </div>
    </div>
  );
}