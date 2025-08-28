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

function RestaurantChangeAlert({
    showRestaurantChangeAlert,
    setShowRestaurantChangeAlert, confirmRestaurantChange
}) {
    return (
        <AlertDialog
            open={showRestaurantChangeAlert}
            onOpenChange={setShowRestaurantChangeAlert}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Changing the restaurant will clear your cart. Do you want to
                        proceed?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        type="button"
                        variant="outline"
                        color="info"
                        onClick={() => setShowRestaurantChangeAlert(false)}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/80"
                        onClick={confirmRestaurantChange}
                    >
                        Ok
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default RestaurantChangeAlert;