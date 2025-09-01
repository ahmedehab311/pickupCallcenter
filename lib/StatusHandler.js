const StatusHandler = ({
    isOnline = true,
    isLoading = false,
    error = null,
    isEmpty = false,
    emptyMessage = "No data found",
    loadingMessage = "Loading...",
    errorMessage = "Something went wrong",
    children,
}) => {
    if (!isOnline) {
        return (
            <div className="w-full text-red-500 text-lg flex justify-center py-3">
                🚨 Internet disconnected
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="w-full animate-pulse text-important text-lg flex justify-center py-3">
                {loadingMessage}
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full text-red-500 text-lg flex justify-center py-3">
                {errorMessage}
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="w-full text-important text-lg flex justify-center py-3">
                {emptyMessage}
            </div>
        );
    }

    return <>{children}</>;
};

export default StatusHandler;
