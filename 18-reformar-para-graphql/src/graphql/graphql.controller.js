const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const ProductosServices = require('./services/productos.services.graphql');
const MensajesServices = require('./services/mensajes.services.graphql');
  
const schema = buildSchema(`
    # Defino los Inputs: Producto y Mensaje

    input ProductoInput {
        nombre: String,
        precio: String,
        foto: String,
    }

    input Autor {
        id: String,
        nombre: String,
        apellido: String,
        edad: Int,
        alias: String,
        avatar: String
    }

    input MensajeInput {
        autor: Autor,
        mensaje: String
    }

    # Defino los types: Producto y Mensaje

    type Producto {
        nombre: String,
        precio: String,
        foto: String,
    }

    type Mensaje {
        id: String,
        nombre: String,
        apellido: String,
        edad: String,
        alias: String,
        avatar: String
        mensaje: String,
    }

    # Defino los type Query y Mutation

    type Query {
        getProducts: [Producto],
        getProduct(nombre: String!): Producto,
        getMessages: [Mensaje]
    }

    type Mutation {
        createProduct(producto: ProductoInput): Producto
        createMessage(mensaje: MensajeInput): Mensaje
        updateProduct(nombre: String, newData: ProductoInput): Producto,
        deleteProduct(nombre: String): [Producto],
    }
`);

module.exports = class GraphQLController {
    constructor() {
        return graphqlHTTP({
            schema: schema,
            rootValue: {
                createProduct: ProductosServices.create,
                getProducts: ProductosServices.getAll,
                getProduct: ProductosServices.getById,
                updateProduct: ProductosServices.update,
                deleteProduct: ProductosServices.remove,
                getMessages: MensajesServices.getAll,
                createMessage: MensajesServices.create
            },
            graphiql: true,
        })
    }
}