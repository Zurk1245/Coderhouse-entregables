const request = require("supertest")("http://localhost:8080/api/productos");
const expect = require("chai").expect;

describe("test api rest crud sobre productos ", () => {
        it("agregar el producto Pera", async () => {
            let productSample = {
                nombre: "Pera",
                precio: 10,
                foto: "https://cdn0.iconfinder.com/data/icons/fruity-3/512/Pear-256.png"
            }
            let response = await request.post("/").send(productSample);
            const product = response.body;
            expect(product).to.include.keys("nombre", "precio", "foto");
            expect(product.nombre).to.eql("Pera");
            expect(product.precio).to.eql(10);
            expect(product.foto).to.eql("https://cdn0.iconfinder.com/data/icons/fruity-3/512/Pear-256.png")
        })

        it("obtener el/los productos", async () => {
            let response = await request.get("/");
            expect(response.status).to.eql(200);
            expect(response.body).to.not.be.empty;
        })
        
        it("actualizar producto Pera", async () => {
            let newInfo = {
                precio: 200,
            }
            let producto = "Pera";
            let response = await request.put(`/${producto}`).send(newInfo);
            let productArray = response.body;
            expect(productArray[0].precio).to.eql(200);
        })
        
        it("eliminar el producto Pera", async () => {
            let producto = "Pera";
            await request.del(`/${producto}`);
            let productExists = await request.get(`/${producto}`);
            console.log(productExists.status, productExists.body);
            expect(productExists.body).to.be.undefined;
        })
})