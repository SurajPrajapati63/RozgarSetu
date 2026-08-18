import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWorkers } from '../../api/workerApi';
import { SkeletonCard } from '../common/SkeletonCard';
import { WorkerCard } from './WorkerCard';
import { Pagination } from '../common/Pagination';
import { EmptyState } from '../common/EmptyState';

export function WorkerGrid({ filters = {} }) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['workers', { ...filters, page }],
    queryFn: () => getWorkers({ ...filters, page, limit: 12 }),
    keepPreviousData: true
  });

  const workers = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1, total: workers.length };

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (isError || workers.length === 0) {
    return (
      <EmptyState
        title="No skilled workers found"
        message="Try resetting filters or searching for another category or city."
      />
    );
  }

  return (
    <div id="workers-section">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {workers.map((worker) => (
          <WorkerCard key={worker._id || worker.id} worker={worker} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={pagination.totalPages}
        />
      )}
    </div>
  );
}

export default WorkerGrid;
