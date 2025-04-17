import { Container, Heading, Button } from "@medusajs/ui"
import TextEditor from "../common/text-editor"
import StatusBadge from "../common/status-badge"
import { useContentManagement } from "../../hooks"

const MainContent = () => {
  const {
    content,
    status,
    hasUnsavedChanges,
    isFormValid,
    handleContentChange,
    handleSubmit
  } = useContentManagement()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit()
  }

  return (
    <Container className="w-full">
      <form onSubmit={onSubmit} className="flex flex-col gap-y-4 p-4">
        <div className="flex items-center justify-between">
          <Heading level="h2">Main Content Editor</Heading>
          <div className="flex items-center gap-x-2">
            <div className="min-w-[150px] flex justify-end">
              <StatusBadge status={status} />
            </div>
            <Button 
              type="submit"
              variant="primary"
              disabled={!hasUnsavedChanges || !isFormValid || status === "loading"}
            >
              {status === "loading" ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
        <div className="w-full">
          <TextEditor 
            value={content.content}
            onChange={handleContentChange}
          />
        </div>
      </form>
    </Container>
  )
}

export default MainContent