import { FocusModal } from "@medusajs/ui"
import { ContactSubmission } from "../../hooks"

interface ViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact?: ContactSubmission
}

const ViewModal = ({ open, onOpenChange, contact }: ViewModalProps) => {
  if (!contact) return null

  return (
    <FocusModal 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title>
            <div className="flex flex-row items-center gap-x-4">
              Contact Form Submission
              {/* <Badge color={contact.status === "read" ? "green" : "blue"}>
                {contact.status === "read" ? "Read" : "Unread"}
              </Badge> */}
            </div>
          </FocusModal.Title>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col max-h-[calc(100vh-65px)]">
          <div className="flex overflow-y-auto min-h-0 p-6">
            <div className="flex flex-col gap-y-6">
              <div className="flex flex-row gap-x-4">
                <div className="font-semibold">From</div>
                <div className="bg-ui-bg-muted rounded">
                  <p>{contact.name}</p>
                  <p>{contact.email}</p>
                  <p>{contact.phone}</p>
                  <p>{new Date(contact.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex flex-row gap-x-4">
                <div className="font-semibold">Subject</div>
                <div className="bg-ui-bg-muted rounded">
                  <p>{contact.subject}</p>
                </div>
              </div>
              <div>
                <div className="font-semibold">Message</div>
                <div className="bg-ui-bg-muted rounded p-3 whitespace-pre-wrap">
                  <p>{contact.message}</p>
                </div>
              </div>
            </div>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  )
}

export default ViewModal 