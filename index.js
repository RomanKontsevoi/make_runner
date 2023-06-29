import express from 'express'
import { config } from 'dotenv'
import { exec } from 'child_process'
import path from 'path'

config()

try {
  const port = process.env.APP_PORT
  const mirrorFolder = process.env.MIRROR_FOLDER

  const app = express()

  const __dirname = path.dirname(new URL(import.meta.url).pathname)
  const currentDir = path.resolve(__dirname)
  const targetDir = path.join(__dirname, `../..${mirrorFolder}`)
  const testDir1 = path.join(__dirname, `../`)
  const testDir2 = path.join(__dirname, `../../`)
  console.log({ currentDir, targetDir, testDir1, testDir2 })

  app.get('/', (req, res) => {
    res.send('Express + TypeScript Server')
  })

  app.post('/hook/mern-blog-be/github', (req, res) => {
    process.chdir(mirrorFolder)

// Выполнение файла redeploy.sh
    const command = './redeploy.sh'
    const child = exec(command)

// Вывод логов в режиме реального времени
    child.stdout.on('data', (data) => {
      console.log(data)
    })

    child.stderr.on('data', (data) => {
      console.error(data)
    })

    child.on('close', (code) => {
      const message = `[server]: Child process exited with code ${code}`
      console.log(message)
      res.send(message)
    })
  })

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
  })
} catch (e) {
  console.error(e)
}
