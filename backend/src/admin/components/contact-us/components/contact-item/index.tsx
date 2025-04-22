import { Button, Table } from "@medusajs/ui"
// import { Trash, SquareGreenSolid, SquareBlueSolid } from "@medusajs/icons"
import { ContactSubmission } from "../../hooks"

interface ContactItemProps {
  contact: ContactSubmission
  onView: (contact: ContactSubmission) => void
}

const ContactItem = ({ contact, onView }: ContactItemProps) => (
  <Table.Row>
    <Table.Cell>{contact.name}</Table.Cell>
    <Table.Cell>{contact.email}</Table.Cell>
    <Table.Cell>{contact.subject}</Table.Cell>
    <Table.Cell>{new Date(contact.created_at).toLocaleDateString()}</Table.Cell>
    {/* <Table.Cell> */}
      {/* <Button variant="secondary" className="cursor-default hover:bg-ui-bg-muted whitespace-nowrap"> */}
        {/* {contact.status === "read" ? (
          <SquareGreenSolid className="inline-block mr-2" />
        ) : (
          <SquareBlueSolid className="inline-block mr-2" />
        )}
        {contact.status === "read" ? "Read" : "Unread"} */}
      {/* </Button> */}
    {/* </Table.Cell> */}
    <Table.Cell className="flex flex-row items-center gap-x-4">
      <Button 
        variant="secondary"
        onClick={() => onView(contact)}
      >
        View
      </Button>
      {/* <Button 
        variant="secondary"
        onClick={() => onDelete(contact)}
        className="py-2 px-4 hover:text-red-500"
      >
        <Trash />
      </Button> */}
    </Table.Cell>
  </Table.Row>
)

export default ContactItem 