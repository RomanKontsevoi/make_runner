import express from 'express'
import { config } from 'dotenv'
import { exec } from 'child_process'

config()

try {
  const app = express()

  const port = process.env.APP_PORT
  const targetFolder = process.env.TARGET_FOLDER

  app.get('/', (req, res) => {
    res.send('Express + TypeScript Server')
  })

  app.post('/hook/mern-blog-be', (req, res) => {
    process.chdir(targetFolder);

// Выполнение файла redeploy.sh
    const command = './redeploy.sh';
    const child = exec(command);

// Вывод логов в режиме реального времени
    child.stdout.on('data', (data) => {
      console.log(data);
    });

    child.stderr.on('data', (data) => {
      console.error(data);
    });

    child.on('close', (code) => {
      const message = `[server]: Child process exited with code ${code}`
      console.log(message);
      res.send(message)
    });
  })

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
  })
} catch (e) {
  console.error(e)
}
