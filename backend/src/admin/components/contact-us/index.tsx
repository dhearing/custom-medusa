import { Container, Heading, Table } from "@medusajs/ui"
// import DeleteConfirmation from "./components/delete"
import ContactItem from "./components/contact-item"
import ViewModal from "./components/modal"
import { useContactManagement } from "./hooks"

const ContactUsPage = () => {
  const {
    sortedContacts,
    isModalOpen,
    selectedContact,
    // contactToDelete,
    setIsModalOpen,
    setSelectedContact,
    // setContactToDelete,
    // handleDelete,
    currentPage,
    pageSize,
    pageCount,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    currentPageData
  } = useContactManagement()

  return (
    <Container className="w-full">
      <div className="flex flex-col gap-y-4 p-4">
        <div className="flex items-center justify-between mb-4">
          <Heading level="h2">Contact Form Submissions</Heading>
        </div>

        <div className="border border-ui-border-base rounded-lg overflow-hidden">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="w-[20%]">Name</Table.HeaderCell>
                <Table.HeaderCell className="w-[25%]">Email</Table.HeaderCell>
                <Table.HeaderCell className="w-[15%]">Subject</Table.HeaderCell>
                <Table.HeaderCell className="w-[20%]">Received At</Table.HeaderCell>
                {/* <Table.HeaderCell className="w-[10%]">Status</Table.HeaderCell> */}
                <Table.HeaderCell className="w-[10%]">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentPageData.map((contact) => (
                <ContactItem
                  key={contact.id}
                  contact={contact}
                  onView={(contact) => {
                    setSelectedContact(contact)
                    setIsModalOpen(true)
                  }}
                  // onDelete={setContactToDelete}
                />
              ))}
            </Table.Body>
          </Table>
        </div>

        <Table.Pagination
          count={sortedContacts.length}
          pageSize={pageSize}
          pageIndex={currentPage}
          pageCount={pageCount}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          previousPage={previousPage}
          nextPage={nextPage}
        />

        <ViewModal
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open)
            if (!open) setSelectedContact(undefined)
          }}
          contact={selectedContact}
        />

        {/* {contactToDelete && (
          <DeleteConfirmation
            onConfirm={handleDelete}
            onCancel={() => setContactToDelete(undefined)}
          />
        )} */}
      </div>
    </Container>
  )
}

export default ContactUsPage
