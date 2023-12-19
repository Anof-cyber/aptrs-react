import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchProjects } from "../lib/data/api";
import { TableSkeleton } from '../components/skeletons'
import ErrorPage from '../components/error-page'
import PageTitle from '../components/page-title';
import { Link } from 'react-router-dom';
import { withAuth } from "../lib/authutils";
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import {Project, Column} from '../lib/data/definitions'
import DataTable from 'react-data-table-component';
import Button from '../components/button';


interface ProjectsProps {
  pageTitle: string; 
  hideActions?: boolean;
}
export function Projects(props:ProjectsProps): JSX.Element {
  const [projects, setProjects] = useState<Project[]>();
  const [error, setError] = useState();
  const [showDelete, setShowDelete] = useState(false); //flag to disable delete button
  interface ProjectWithActions extends Project {
    actions: JSX.Element;
  }
  useEffect(() => {
    fetchProjects()
      .then((data) => {
        let temp: any = []
        data.forEach((row: ProjectWithActions) => {
          row.actions = (<>
                          {!props.hideActions &&
                          <>
                          <Link to={`/projects/${row.id}/edit`}><PencilSquareIcon className="inline w-6" /></Link>
                          <TrashIcon className="inline w-6 ml-2 cursor-pointer" onClick={()=> handleDelete(row.id)}/>
                          </>
                           }                     
                        </>)
          temp.push(row)
        });
        setProjects(temp as ProjectWithActions[])
      }).catch((error) => {
        setError(error)})
  }, []);
  
  const columns: Column[] = [
    {
      name: 'Action',
      selector: (row: any) => row.actions,
      maxWidth: '5em',
      omit: props.hideActions
    },
    {
      name: 'Name',
      selector: (row: Project) => row.name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: (row: Project) => row.description.length > 50 ? row.description.substring(0, 50) + '...' : row.description,
    },
    {
      name: 'Start Date',
      selector: (row: Project) => row.startdate,
      sortable: true,
    },
    {
      name: 'End Date',
      selector: (row: Project) => row.enddate,
    },
  ];
  const navigate = useNavigate();
  const handleNew = () => {
    navigate('/projects/new')
  }
  const clickRow = (id: any) => {
  }
  const handleDelete = (id: any) => {
    console.log("deleting id ",id)
    alert('not implemented yet')
    
  }
  const handleSelectedChange = (event: any) => {
    setShowDelete(event.selectedCount == 0)
  }

  if(error){
    console.error(error)
    return <ErrorPage />
  }
  if(typeof projects == 'undefined'){
    return (<TableSkeleton />)
  }
  
  
  return(
    <>
      {typeof(projects) == "object" && (
        <PageTitle title={props.pageTitle} />
      )}
      <Button className='btn btn-primary float-right m-2' onClick={handleNew}>
            New Project
        </Button>
      <Button onClick = {handleDelete} className="btn btn-error float-right m-2 mr-0 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200" disabled={showDelete}>
        Delete
      </Button>
      {typeof(projects) == "object" &&
          <DataTable
              columns={columns}
              data={projects}
              selectableRows
              pagination
              striped
              onSelectedRowsChange={handleSelectedChange}
          />
        }
    </>
  )
}

export default withAuth(Projects);