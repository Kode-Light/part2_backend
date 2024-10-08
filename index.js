const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

const url = process.env.MONGODB_URI;

app.use(express.static('dist'))
app.use(express.json())
// app.use(requestLogger)

const password = process.argv[2]

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note',noteSchema)

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

app.get('/',(request,response)=>{response.send('<h1>hello world</h1>')})

app.get('/api/notes',(request, response)=>{
  Note.find({}).then(note=>{response.json(notes)})
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if(note)
    {response.json(note)}
    else{response.status(404).end()}
  })

app.delete('/api/notes/:id',(request,response)=>{
    const id = Number(request.params.id)
    notes= notes.filter(note=>note.id!=id)
    response.status(202).end()
})

const generateID = () =>{
    const maxID = notes.length>0
    ? Math.max(...notes.map(n=>Number(n.id))):0
    return String(maxID + 1)
}

app.post('/api/notes', (request, response) => {
    const body = request.body
    if(!body.content){
        return response.status(400).json({ error: 'content missing' });

    }

    const note ={ 
        content: body.content,
        important : Boolean(body.important) || false,
        id : generateID()
    }
    notes = notes.concat(note)
    response.json(note)
  })


  // const requestLogger = (request, response, next) => {
  //   console.log('Method:', request.method)
  //   console.log('Path:  ', request.path)
  //   console.log('Body:  ', request.body)
  //   console.log('---')
  //   next()
  // }

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{console.log(`Server running on port ${PORT}`)})
