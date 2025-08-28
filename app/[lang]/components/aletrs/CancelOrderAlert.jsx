import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
function CancelOrderAlert({ handleCacelOrder, setCreateOrderDialogOpen }) {
    return (
        <div className="flex items-center justify-between gap-5 my-5">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="w-1/2" color="destructive">
                        Cancel
                    </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will reset everything and start the
                            process from the beginning.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            type="button"
                            variant="outline"
                            color="info"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/80"
                            onClick={handleCacelOrder}
                        >
                            Ok
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Button
                className="w-1/2"
                color="success"
                onClick={() => setCreateOrderDialogOpen(true)}
            >
                Checkout

            </Button>
        </div>
    )
}

export default CancelOrderAlert