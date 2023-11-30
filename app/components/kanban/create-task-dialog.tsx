import type { DialogProps } from '@radix-ui/react-dialog';
import type { FetcherWithComponents } from '@remix-run/react';
import { useFetcher } from '@remix-run/react';
import { LucideLoader } from 'lucide-react';
import { createRef, useEffect } from 'react';
import { cn } from 'utils/cn';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

// hack to reset the fetcher state after api request
export const resetFetcher = (fetcher: FetcherWithComponents<any>) => {
    fetcher.submit({}, { action: "/reset-fetcher", method: "post" });
};

export default function CreateTaskDialog({ open, onOpenChange, ...rest }: DialogProps) {
    const fetcher = useFetcher()
    const submitting = fetcher.state === 'submitting'
    const formRef = createRef<HTMLFormElement>()

    useEffect(() => {
        if (fetcher.data) {
            formRef.current?.reset()
            resetFetcher(fetcher)
            onOpenChange?.(false)
        }
    }, [fetcher.state, fetcher, onOpenChange, formRef])

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault()
        fetcher.submit(ev.currentTarget)
    }

    return (
        <Dialog open={open} {...rest}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='mb-4'>Create Task</DialogTitle>
                    <DialogDescription>
                        <fetcher.Form ref={formRef} method='POST' onSubmit={handleSubmit} className='flex flex-col gap-4'>
                            <Input label='Title' placeholder='Enter title...' name='title' />
                            <Textarea label='Description' placeholder='Enter description...' name='description' />
                            <input hidden type='number' min='0' max='4' name='status' value={0} />
                            <Button>{
                                submitting ? (
                                    <LucideLoader
                                        size={18}
                                        className={cn('animate-spin')}
                                    />
                                ) : 'Create'
                            }
                            </Button>
                        </fetcher.Form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
