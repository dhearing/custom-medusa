import { Container, Heading, Button, Table } from "@medusajs/ui"
import ResourceModal from "./components/modal"
import ResourceItem from "./components/resource"
import DeleteConfirmation from "./components/delete"
import { useResourceManagement } from "./hooks"

const BlogsResources = () => {
  const {
    sortedResources,
    isModalOpen,
    selectedResource,
    resourceToDelete,
    setIsModalOpen,
    setSelectedResource,
    setResourceToDelete,
    handleSubmit,
    handleDelete,
    currentPage,
    pageSize,
    pageCount,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    currentPageData
  } = useResourceManagement()

  return (
    <Container className="w-full">
      <div className="flex flex-col gap-y-4 p-4">
        <div className="flex items-center justify-between mb-4">
          <Heading level="h2">Blogs & Resources Editor</Heading>
          <Button 
            variant="secondary"
            onClick={() => setIsModalOpen(true)}
          >
            Add Blog or Resource
          </Button>
        </div>

        <div className="border border-ui-border-base rounded-lg overflow-hidden">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="w-[30%]">Title</Table.HeaderCell>
                <Table.HeaderCell className="w-[20%]">Updated At</Table.HeaderCell>
                <Table.HeaderCell className="w-[20%]">Category</Table.HeaderCell>
                <Table.HeaderCell className="w-[20%]">Status</Table.HeaderCell>
                <Table.HeaderCell className="w-[10%]">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentPageData.map((resource) => (
                <ResourceItem
                  key={resource.id}
                  resource={resource}
                  onEdit={(resource) => {
                    setSelectedResource(resource)
                    setIsModalOpen(true)
                  }}
                  onDelete={setResourceToDelete}
                />
              ))}
            </Table.Body>
          </Table>
        </div>

        <Table.Pagination
          count={sortedResources.length}
          pageSize={pageSize}
          pageIndex={currentPage}
          pageCount={pageCount}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          previousPage={previousPage}
          nextPage={nextPage}
        />


        <ResourceModal
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open)
            if (!open) setSelectedResource(undefined)
          }}
          onSubmit={handleSubmit}
          initialResource={selectedResource}
        />

        {resourceToDelete && (
          <DeleteConfirmation
            onConfirm={handleDelete}
            onCancel={() => setResourceToDelete(undefined)}
          />
        )}
      </div>
    </Container>
  )
}

export default BlogsResources