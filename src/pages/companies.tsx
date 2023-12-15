import {Company} from '../lib/data/definitions'
import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchCompanies } from "../lib/data/api";
import { TableSkeleton } from '../components/skeletons'
import ErrorPage from '../components/error-page'
import PageTitle from '../components/page-title';
import { Link } from 'react-router-dom';
import { withAuth } from "../lib/authutils";
import { StyleCheckbox } from '../lib/formstyles';
import Button from '../components/button';
import { useNavigate } from "react-router-dom";
import CompanyForm from './company-form';
import { Modal } from 'react-daisyui'
import { boolean } from 'zod';
// import CompanyForm from './company-form';


export function Companies() {
  const [visible, toggleVisible] = useState<boolean>(false);
  const [companies, setCompanies] = useState<Company[]>();
  const [error, setError] = useState();
  const [allChecked, setAllChecked] = useState(false);
  const [itemChecked, setItemChecked] = useState<(number | undefined)[]>([]);
  const [currentId, setCurrentId] = useState('')
  const [newCo, setNewCo] = useState(false);
  let editing = false;
  const navigate = useNavigate();
  const ref = useRef<HTMLDialogElement>(null);
  
  const handleModal = useCallback((id?: string) => {
    if(id) setCurrentId(id)
    if (!id) setNewCo(true)
    const handleEsc = (event: KeyboardEvent) => {
      //when they hit escape make sure to call clearModal
      // console.log('keypress, editing is ', editing) 
      // if (event.key === 'Escape') {
      //   console.log('ESC called, editing is ', editing) 
      //   if(editing){
      //     var c = confirm("Discard changes?");
      //     if(!c){
      //       return null;
      //     }
      //   } 
      //   clearModal()
      // } else {
      //   console.log('setting editing  to true') 
      // //set that they are editing
      //   editing =true;
      // }
      // console.log('now editins is ', editing)
    }
    window.addEventListener('keydown', handleEsc);
    // Use the "id" parameter as needed in your function
    ref.current?.showModal();
  }, [ref]);
  useEffect(() => {
    fetchCompanies()
      .then((data) => {
        setCompanies(data as Company[]);
      }).catch((error) => {
        setError(error)})
  }, []);
  const clearModal = () => {
    console.log('clearmodal')
    setNewCo(false)
    setCurrentId('')
    editing = false;
  }
  if(error){
    console.error(error)
    return <ErrorPage />
  }
  if(typeof companies == 'undefined'){
    return (<TableSkeleton />)
  }
  const handleMultiCheckbox = () => {
    setAllChecked(!allChecked);
    if(!allChecked){
      setItemChecked([])
    }
  }
  const handleNew = () => {
    // navigate('/companies/new')
    handleModal('')
  }
  const handleDelete = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    alert('not implemented yet')
    
  }
  const handleItemCheckbox = (event:React.FormEvent<HTMLInputElement>) => {
    let search = Number(event.currentTarget.value)
    let checked = event.currentTarget.checked
    let newChecked: any = []
    if(itemChecked.length === 0 && checked){
      newChecked.push(Number(search))
    } else {
      itemChecked.forEach((id) => {
        if(id === search){
          if(checked){
            newChecked.push(id)
          }
        } else {
          newChecked.push(id)
        }
      })
    }
    setItemChecked(newChecked)
    
  }
  
  
  
  return(
    <>
      {typeof(companies) == "object" && (
        <PageTitle title='Companies' />
      )}
      {/* modal content */}
      <Modal ref={ref}  className="modal-box bg-white w-full  p-4 rounded-md" >
        <form method="dialog" onSubmit={clearModal}>
          <Button className="bg-gray visible absolute right-2 top-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-md w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <span className="text-gray-400 hover:text-white-900">x</span>
          </Button>
        </form>
        <Modal.Body>
          {currentId && <CompanyForm id={currentId} isModal={true}/>}
          {newCo && <CompanyForm isModal={true}/>}
        
        </Modal.Body>
      </Modal>
      <div className="mt-6 flow-root">
        <Button className='btn btn-primary float-right m-2' onClick={handleNew}>
            New Company
        </Button>
        {(allChecked || itemChecked.length > 0)  &&
          <Button className="btn btn-error float-right m-2 mr-0">
            Delete
         </Button>
        }
        
      {typeof(companies) == "object" &&
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
              {typeof(companies) == "object" && companies.map((company: Company) => (
                  <div
                    key={company.id + "-mobile"}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <p>{company.name}</p>
                        </div>
                      </div>
                    </div>
                    
                    
                  </div>
                  ))
                }
              </div>
              <table className="table zebra">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    <input
                      id="selectAll"
                      type="checkbox"
                      checked = {allChecked}
                      onChange={handleMultiCheckbox}
                      className={StyleCheckbox}
                    />
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium sm:pl-6">
                      Action
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium sm:pl-6">
                      Id
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Address
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Logo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                {typeof(companies) == "object"  && companies.map((company: Company) => (
                    <tr
                      key={company.id + "-web"}
                      className="hover w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <input
                          id={"select-" + company.id + "-web"}
                          type="checkbox"
                          checked = {allChecked || itemChecked.includes(company.id)}
                          value= {company.id}
                          onChange={handleItemCheckbox}
                          className={StyleCheckbox}
                        />
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                            
                            <div className='underline cursor-pointer' onClick={() => handleModal(String(company.id))}>edit</div>

                            <Link to={`/companies/${company.id}/delete`} onClick={handleDelete} className='underline'>delete</Link>
                        </div>
                      </td>

                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <p>{company.id}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <p>{company.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          {company.address}
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          {company.img}
                        </div>
                      </td>
                      
                    </tr>
                   ))
                  }
                </tbody>
              </table>
            </div>
          </div>
      }
      </div>
    </>
  )
}

export default withAuth(Companies);