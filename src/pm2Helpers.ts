import pm2 from 'pm2';

export async function pm2Connect(): Promise<void> {
  return new Promise((resolve, reject) => {
    pm2.connect(err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

export async function pm2List(): Promise<pm2.ProcessDescription[]> {
  return new Promise((resolve, reject) => {
    pm2.list((err, list) => {
      if (err) {
        return reject(err);
      }

      return resolve(list);
    });
  });
}

export async function pm2Restart(name: string): Promise<pm2.Proc> {
  return new Promise((resolve, reject) => {
    pm2.restart(name, (err, resultApp) => {
      if (err) {
        return reject(err);
      }

      return resolve(resultApp);
    });
  });
}

export async function pm2Stop(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    pm2.stop(name, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}

export async function pm2IsRunning(name: string): Promise<boolean> {
  const list = await pm2List();
  return list.some(app => app.name === name);
}
export async function pm2Start(args: pm2.StartOptions): Promise<pm2.Proc> {
  return new Promise((resolve, reject) => {
    pm2.start(args, (err, resultApp) => {
      if (err) {
        return reject(err);
      }

      return resolve(resultApp);
    });
  });
}
