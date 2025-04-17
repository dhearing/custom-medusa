import { Button, Table } from "@medusajs/ui"
import { Trash, SquareBlueSolid, SquareGreenSolid } from "@medusajs/icons"
import { BlogResourceItem } from "@src/types"

interface ResourceItemProps {
  resource: BlogResourceItem
  onEdit: (resource: BlogResourceItem) => void
  onDelete: (resource: BlogResourceItem) => void
}

const ResourceItem = ({ resource, onEdit, onDelete }: ResourceItemProps) => (
  <Table.Row>
    <Table.Cell>{resource.title}</Table.Cell>
    <Table.Cell>{new Date(resource.updated_at).toLocaleDateString()}</Table.Cell>
    <Table.Cell>{resource.category}</Table.Cell>
    <Table.Cell>
      <Button variant="secondary" className="cursor-default hover:bg-ui-bg-muted whitespace-nowrap">
        {resource.status ? <SquareGreenSolid className="inline-block mr-2" /> : <SquareBlueSolid className="inline-block mr-2" />}
        {resource.status ? "Published" : "Draft"}
      </Button>
    </Table.Cell>
    <Table.Cell className="flex flex-row items-center gap-x-4">
      <Button 
        variant="secondary"
        onClick={() => onEdit(resource)}
        >
          Edit
        </Button>
        <Button 
          variant="secondary"
          onClick={() => onDelete(resource)}
          className="py-2 px-4 hover:text-red-500"
        >
          <Trash />
      </Button>
    </Table.Cell>
  </Table.Row>
)

export default ResourceItem 