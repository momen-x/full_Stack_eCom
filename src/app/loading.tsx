const Loading = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
          <div className="h-6 bg-muted rounded w-20 animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 p-4 border-b bg-muted/50">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse"></div>
            ))}
          </div>

          {/* Table Rows */}
          <div className="divide-y">
            {[...Array(5)].map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-5 gap-4 p-4">
                {[...Array(5)].map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className="h-4 bg-muted rounded animate-pulse"
                    style={{
                      animationDelay: `${rowIndex * 0.1}s`,
                      animationDuration: '1.5s'
                    }}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;