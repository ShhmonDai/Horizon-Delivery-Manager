import { useState, useMemo } from 'react';
import { Modal, Button, TextInput, Pagination, Select } from 'flowbite-react';

const PackageHistoryModal = ({ showModalHistory, setShowModalHistory, selectedApartment }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const filteredHistory = useMemo(() => {
        if (!selectedApartment?.packageHistory) return [];

        return selectedApartment.packageHistory
            .slice()
            .reverse()
            .filter((entry) => {
                const term = searchTerm.toLowerCase();
                const formattedDate = new Date(entry.deliveredAt).toLocaleString().toLowerCase();

                return (
                    entry.deliveredBy?.toLowerCase().includes(term) ||
                    entry.location?.toLowerCase().includes(term) ||
                    String(entry.amount).toLowerCase().includes(term) ||
                    formattedDate.includes(term)
                );
            });
    }, [selectedApartment, searchTerm]);

    const totalPages = Math.ceil(filteredHistory.length / pageSize);
    const paginatedHistory = filteredHistory.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleClose = () => {
        setShowModalHistory(false);
        setSearchTerm('');
        setCurrentPage(1);
    };

    return (
        <Modal dismissible show={showModalHistory} onClose={handleClose} popup size="lg">
            <Modal.Header>Package Delivery History - {selectedApartment?.apartmentNumber}</Modal.Header>
            <Modal.Body>
                <div className="mb-4 flex flex-col gap-3">
                    <TextInput
                        placeholder="Search by name, location, amount, or date..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <Select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                        <option value={3}>3 per page</option>
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                    </Select>
                </div>

                {paginatedHistory.length > 0 ? (
                    <div className="space-y-3 mb-4">
                        {paginatedHistory.map((entry, index) => (
                            <div key={index} className="p-2 border rounded bg-gray-50 shadow-sm">
                                <div><strong>Given Out By:</strong> {entry.deliveredBy}</div>
                                <div><strong>Date:</strong> {new Date(entry.deliveredAt).toLocaleString()}</div>
                                <div><strong>Amount:</strong> {entry.amount}</div>
                                <div><strong>Location:</strong> {entry.location || 'N/A'}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 text-center py-4">No matching delivery history.</div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center my-3">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                            showIcons
                        />
                    </div>
                )}

                <div className="my-4 flex justify-center">
                    <Button color="gray" onClick={handleClose}>Close</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default PackageHistoryModal;