require('./config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const Personas = [];

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/inicio', (req, res) => {

    Personas.splice(0, Personas.length);

    Personas.push({ id: 1, nombre: "César", Apellido: "Mariluz" });
    Personas.push({ id: 2, nombre: "Joel", Apellido: "Gutierrez" });
    Personas.push({ id: 3, nombre: "Liz", Apellido: "Quiroz" });
    res.status(200).json({
        err: false,
        message: "Se ha inicializado la aplicación"
    });

});

const BuscarPersona = (id, callback) => {
    let fin = false;

    for (let i = 0; i < Personas.length; i++) {
        if (Personas[i].id == id) {
            callback(Personas[i], id);
            fin = true;
            break;

        }
    }

    if (!fin) {
        callback(undefined, id)
    };
}

app.get('/usuario', function(req, res) {
    let id = req.query.id || undefined;

    if (id) {
        BuscarPersona(id, (Aux, id) => {
            let message = `Se esta buscando el usuario por ID=${id}`;
            let respuesta = Aux ? Aux : `No existe la persona con ID=${id}`;
            let err = Aux ? false : true;
            res.status(200).json({
                err,
                message,
                respuesta
            });
        });

    } else {
        let message;
        let respuesta;
        let err;
        message = "Se muestran todos los usuarios";
        respuesta = Personas.length == 0 ? "No hay usuarios" : Personas;
        err = Personas.length == 0 ? true : false;
        res.status(200).json({
            err,
            message,
            respuesta
        });
    }

});



app.post('/usuario/:nombre/:apellido', function(req, res) {
    let nombre = req.params.nombre;
    let apellido = req.params.apellido;

    let NuevaPersona = {
        id: Personas[Personas.length - 1].id + 1,
        nombre,
        apellido
    }

    Personas.push(NuevaPersona);

    res.status(200).json({
        err: false,
        message: "Se añadio una nueva personas",
        NuevaPersona
    });

});

const ActualizarPersona = (id, nombre, apellido, callback) => {
    let fin = false;

    for (let i = 0; i < Personas.length; i++) {
        if (Personas[i].id == id) {
            Personas[i].nombre = nombre;
            Personas[i].apellido = apellido;
            callback(Personas[i], id);
            fin = true;
            break;
        }
    }

    if (!fin) {
        callback(undefined, id)
    };

}

app.put('/usuario/:id/:nombre/:apellido', function(req, res) {

    let id = req.params.id;
    let nombre = req.params.nombre;
    let apellido = req.params.apellido;

    ActualizarPersona(id, nombre, apellido, (Aux, id) => {
        let message = `Se esta actualizando el usuario por ID=${id}`;
        let respuesta = Aux ? Aux : `No existe la persona con ID=${id}`;
        let err = Aux ? false : true;
        res.status(200).json({
            err,
            message,
            respuesta
        });
    });


});

const EliminarPersona = (id, callback) => {
    let fin = false;

    for (let i = 0; i < Personas.length; i++) {
        if (Personas[i].id == id) {
            let persona = Personas[i];
            Personas.splice(i, 1);
            callback(persona, id);
            fin = true;
            break;
        }
    }

    if (!fin) {
        callback(undefined, id)
    };

}


app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    EliminarPersona(id, (Aux, id) => {
        let message = `Se esta eliminando el usuario por ID=${id}`;
        let respuesta = Aux ? Aux : `No existe la persona con ID=${id}`;
        let err = Aux ? false : true;
        res.status(200).json({
            err,
            message,
            respuesta
        });
    });

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});