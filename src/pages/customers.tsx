import { 
        useEffect, 
        useState, 
        useRef, 
        useCallback } from 'react'
import { fetchCustomers } from "../lib/data/api";
import { TableSkeleton } from '../components/skeletons'
import ErrorPage from '../components/error-page'
import PageTitle from '../components/page-title';
import { withAuth } from "../lib/authutils";
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../components/button';
import CustomerForm from './customer-form';
import { Modal } from 'react-daisyui'
import {Customer, Column} from '../lib/data/definitions'
import DataTable from 'react-data-table-component';



export function Customers() {
  
  
  
  /* MODAL CREATING AND HANDLING */
  const [customerId, setCustomerId] = useState('') //id of the object to be edited in modal
  const [refresh, setRefresh] = useState(false);
  const [showDelete, setShowDelete] = useState(false); //flag to disable delete button
  const ref = useRef<HTMLDialogElement>(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = useCallback((id: string ='') => {
    setCustomerId(id)
    setShowModal(true)
    ref.current?.showModal();
    
  }, [ref]);
  useEffect(() => {
    if(showModal){
      ref.current?.showModal()
    } else {
      ref.current?.close()
    }
  },[showModal])
  
  const clearModal = () => {
    setCustomerId('')
    setShowModal(false);
  }
  const handleNew = () => {
    openModal('')
  }
  /* FETCH OF DATA TO RENDER */
  //CustomerWithActions is a type of customer that allows appending an actions column for use in the table view
  const [customers, setCustomers] = useState<CustomerWithActions[]>();
  const [error, setError] = useState();
  interface CustomerWithActions extends Customer {
    actions: JSX.Element;
  }
  useEffect(() => {
    fetchCustomers()
      .then((data) => {
        let temp: any = []
        data.forEach((row: CustomerWithActions) => {
          row.actions = (<>
                        <PencilSquareIcon onClick={() => openModal(String(row.id))} className="inline w-6 cursor-pointer"/>
                        
                        <TrashIcon onClick={() => handleDelete(String(row.id))} className="inline w-6 ml-2 cursor-pointer" />                        
                        </>)
          temp.push(row)
        });
        
        setCustomers(temp as CustomerWithActions[]);
      }).catch((error) => {
        setError(error)})
    setRefresh(false)
  }, [refresh]);
  
  
  const columns: Column[] = [
    {
      name: 'Action',
      selector: (row: any) => row.actions,
      maxWidth: '5em'
    },
    {
      name: 'Name',
      selector: (row: Customer) => row.name,
      sortable: true,
    },
    {
      name: 'Company',
      selector: (row: Customer) => row.company,
      sortable: true,
    },
    {
      name: 'Position',
      selector: (row: Customer) => row.position,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row: Customer) => row.email,
    },
    {
      name: 'Phone',
      selector: (row: Customer) => row.phoneNumber,
    },
  ];
  
  const handleDelete = (id: string) => {
    console.log("deleting id ",id)
    alert('not implemented yet')
    
  }
  const handleSelectedChange = (event: any) => {
    setShowDelete(event.selectedCount == 0)
  }
  
   /* RENDERING IF ERROR OR STILL LOADING */
   if(error){
    console.error(error)
    return <ErrorPage />
  }
  if(typeof customers == 'undefined'){
    return (<TableSkeleton />)
  }
  return(
    <>
      
      {typeof(customers) == "object" && (
        <PageTitle title='Customers' />
      )}
        {/* modal content */}
        {showModal &&
        <Modal ref={ref}  className="modal-box bg-white w-full  p-4 rounded-md" >
          <form method="dialog" onSubmit={clearModal}>
            <Button className="bg-gray visible absolute right-2 top-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-md w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
              <span className="text-gray-400 hover:text-white-900">x</span>
            </Button>
          </form>
          <Modal.Body>
          {customerId   && <CustomerForm id={customerId} forwardedRef={ref} setRefresh={setRefresh} onClose={clearModal}/>}
          {!customerId && <CustomerForm forwardedRef={ref} setRefresh={setRefresh} onClose={clearModal}/>}
          </Modal.Body>
        </Modal>
        }
        {/* END modal content */}
      
        
      <div className="mt-6 flow-root">
        <Button className='btn btn-primary float-right m-2' onClick={handleNew}>
            New Customer
        </Button>
        <Button className="btn btn-error float-right m-2 mr-0 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200" disabled={showDelete}>
          Delete
        </Button>
        {typeof(customers) == "object" &&
          <DataTable
              columns={columns}
              data={customers}
              selectableRows
              pagination
              striped
              onSelectedRowsChange={handleSelectedChange}
          />
        }
      </div>
    </>
  )
}

export default withAuth(Customers);