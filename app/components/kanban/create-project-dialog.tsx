import type { DialogProps } from '@radix-ui/react-dialog'
import { Form } from '@remix-run/react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

export default function CreateProjectDialog(props: DialogProps) {
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-4'>Create Project</DialogTitle>
          <DialogDescription>
            <Form method='POST' className='flex flex-col gap-4'>
              <Input label='Title' placeholder='Enter title...' name='title' value={title} onChange={ev => setTitle(ev.target.value)} />
              <Textarea label='Description' placeholder='Enter description...' name='description' value={description} onChange={ev => setDescription(ev.target.value)} />
              <Button>Create</Button>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
