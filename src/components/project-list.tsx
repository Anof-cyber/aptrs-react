import {Project} from '../lib/data/definitions'

export function ProjectList({ projects }: { projects: Project[] }) {
  console.log("ProkectList, projects");
  console.log(projects)
  if(!projects){
    return (<p>Loading</p>);
  }
  return(
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {projects?.map((project) => (
                <div
                  key={project.id + "-mobile"}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p>{project.name}</p>
                      </div>
                      <p className="text-sm text-gray-500">{project.description}</p>
                    </div>
                    {/* <InvoiceStatus status={invoice.status} /> */}
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p>{project.startdate}</p>
                      </div>
                      <p className="text-sm text-gray-500">{project.enddate}</p>
                    </div>
                    {/* <InvoiceStatus status={invoice.status} /> */}
                  </div>
                  
                </div>
              ))}
            </div>
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Id
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Description
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Start Date
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    End Date
                  </th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {projects?.map((project) => (
                  <tr
                    key={project.id + "-web"}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <p>{project.id}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <p>{project.name}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {project.description}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {project.startdate}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                    {project.enddate}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {/* <InvoiceStatus status={invoice.status} /> */}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        {/* <UpdateInvoice id={invoice.id} />
                        <DeleteInvoice id={invoice.id} /> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}
export default ProjectList;