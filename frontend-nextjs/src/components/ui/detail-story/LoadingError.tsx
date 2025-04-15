interface LoadingErrorProps {
  isLoading: boolean;
  error: string | null;
}

const LoadingError: React.FC<LoadingErrorProps> = ({ isLoading, error }) => {
  if (isLoading) {
    return <div className="container mx-auto my-10 px-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto my-10 px-6 text-red-500">{error}</div>
    );
  }

  return null;
};

export default LoadingError;