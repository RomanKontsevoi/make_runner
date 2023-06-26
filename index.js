import express from 'express'
import { config } from 'dotenv'
import { spawn } from 'child_process'

config()

try {
  const app = express()

  const port = process.env.APP_PORT
  const targetFolder = process.env.TARGET_FOLDER

  app.get('/', (req, res) => {
    res.send('Express + TypeScript Server')
  })

  app.post('/hook', (req, res) => {
    const ls = spawn('sh', [ `${targetFolder}/redeploy.sh` ])

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    ls.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
    })

    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
    })

    ls.on('error', (err) => {
      console.error(err)
    })
  })

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
  })
} catch (e) {
  console.error(e)
}
