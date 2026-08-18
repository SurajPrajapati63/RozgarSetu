import { useQuery } from '@tanstack/react-query'
import { getWorkers, getWorkerById } from '../api/workerApi'

export function useWorkers() {
  return useQuery({ queryKey: ['workers'], queryFn: getWorkers, select: (res) => res.data })
}

export function useWorker(id) {
  return useQuery({ queryKey: ['worker', id], queryFn: () => getWorkerById(id), enabled: Boolean(id), select: (res) => res.data })
}
