import logger from './logger';

export interface Job {
  id: string;
  name: string;
  data: any;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

class MockQueue {
  private jobs: Job[] = [];

  async add(name: string, data: any): Promise<Job> {
    const job: Job = {
      id: `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      data,
      status: 'queued',
      createdAt: new Date(),
    };

    this.jobs.push(job);
    logger.info(`[Queue] Job added: ${job.name} (ID: ${job.id})`);

    // Asynchronously process the job to mimic a separate worker process
    this.processJob(job.id);

    return job;
  }

  private async processJob(jobId: string) {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return;

    // Transition to processing
    job.status = 'processing';
    logger.info(`[Queue Worker] Processing job ${job.name} (ID: ${job.id})...`);

    // Simulate heavy async processing (e.g. sending email, generating PDF)
    setTimeout(() => {
      job.status = 'completed';
      logger.info(`[Queue Worker] Successfully completed job ${job.name} (ID: ${job.id})`);
    }, 3000);
  }

  async getJobs(): Promise<Job[]> {
    return this.jobs;
  }
}

export const queue = new MockQueue();
export default queue;
