import Application from './index';

export function createBatchApps(applications = [], matrix) {
    return applications.map(app => new Application(app, matrix));
}