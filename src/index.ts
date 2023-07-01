import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import { exec } from 'child_process'
import path from 'path'

dotenv.config()

try {
  const port = process.env.APP_PORT
  const mirrorFolder = process.env.MIRROR_FOLDER

  const app = express()

  const __dirname = path.dirname(new URL(import.meta.url).pathname)
  const currentDir = path.resolve(__dirname)
  const targetDir = path.join(__dirname, `../..${mirrorFolder}`)
  console.log({ currentDir, targetDir })

  app.get('/', (req, res) => {
    res.send('Express + TypeScript Server')
  })

  const runCommandInChildProcess = (command: string, processDir: string | undefined, res: Response): void => {
    if (!processDir) {
      res.status(500).send("Process dir is unavailable")
      return
    }
    process.chdir(processDir)
    const child = exec(command)

    // Вывод логов в режиме реального времени
    child.stdout!.on('data', (data) => {
      console.log(data)
    })

    child.stderr!.on('data', (data) => {
      console.error(data)
    })

    child.on('close', (code) => {
      if (code === null) {
        return
      }
      let message
      if (+code === 0) {
        message = `[server]: Child process exited with code ${code}`
        res.send(message)
      } else {
        message = `[server]: Sorry, error happened with code ${code}`
        res.status(500).send(message)
      }
      console.log(message)
    })
  }

  app.post('/hook/mern-blog-be/github', (req: Request, res: Response) => {
    // Выполнение файла redeploy.sh
    const command = './redeploy.sh'
    runCommandInChildProcess(command, mirrorFolder, res)
  })

  app.post('/hook/mern-blog-be/docker_hub', (req: Request, res: Response) => {
    // Выполнение файла update_container.sh
    const command = './update_container.sh'
    runCommandInChildProcess(command, mirrorFolder, res)
  })

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
  })
} catch (e) {
  console.error(e)
}
