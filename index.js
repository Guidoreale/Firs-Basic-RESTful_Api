import express from 'express';
import fs, { write } from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
    try{
    const data = fs.readFileSync('DataBase.json');
    return (JSON.parse(data));
    }catch (error){
        console.log('Error al intentar leer el archivo', error);
    }
};

const writeData = (data) =>{
    try{
        fs.writeFileSync('DataBase.json', JSON.stringify(data));
        console.log('Archivo escrito correctamente');
    }catch (error){
        console.log('Error al intentar escribir el archivo', error);
    
    }
}


//adiciono endpoints para el CRUD

//GET basico
app.get("/", (req,res) => {
    res.send('Bienvenido a mi primer api con NodeJS')
});

//get con parametros que devuelve el contenido total del archivo json
app.get("/films", (req,res) => {
    const data = readData();
    res.json(data.peliculas);
});

/*
*   get con parametros que devuelve el contenido de un solo elemento
*   del archivo json identificado por su id
*/

app.get("/films/:id", (req,res) => {
    const data = readData();
    const id =  parseInt(req.params.id);
    const pelicula = data.peliculas.find((pelicula) => pelicula.id === id);
    res.json(pelicula);
})

/* 
*   post que recibe un objeto json y lo agrega al archivo json
*/
app.post("/films", (req,res) => {
    const data = readData();
    const body = req.body;
    const newFilm = {
        id: data.peliculas.length + 1,
        ...body,
    };
    data.peliculas.push(newFilm);
    writeData(data);
    res.json(newFilm);
})

/*
*   put que recibe parametros y actualiza el contenido de un elemento del 
*   archivo json identificado por su id
*/
app.put("/films/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const filmIndex = data.peliculas.findIndex((pelicula) => pelicula.id === id);
    data.peliculas[filmIndex] = {
        ...data.peliculas[filmIndex],
        ...body,
    };
    writeData(data);
    res.json(data.peliculas[filmIndex]);
}
)

/*
*   delete que elimina un elemento del archivo json identificado por su id
*/
app.delete("/films/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const filmIndex = data.peliculas.findIndex((pelicula) => pelicula.id === id);
    data.peliculas.splice(filmIndex, 1);
    writeData(data);
    res.json({message: 'Pelicula eliminada correctamente'});
})

//levanto el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('servidor corriendo en puerto 3000')
});