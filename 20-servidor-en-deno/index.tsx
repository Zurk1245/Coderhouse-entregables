// @deno-types="https://deno.land/x/servest@v1.3.1/types/react/index.d.ts";
import React from "https://dev.jspm.io/react/index.js";
// @deno-types="https://deno.land/x/servest@v1.3.1/types/react-dom/server/index.d.ts";
import ReactDOMServer from "https://dev.jspm.io/react-dom/server.js";
import { createApp, contentTypeFilter, RoutingError } from "https://deno.land/x/servest@v1.3.4/mod.ts";

const app = createApp();

let colors: string[] = ["orange", "blue"];

const content = () =>
	ReactDOMServer.renderToString(
		<html>
			<head>
				<meta charSet="utf-8" />
				<title>Servest</title>
			</head>
			<body style={{ background: "black", color: "white" }}>
            <form action="http://localhost:8080/post" method="post">
                    <label htmlFor="color">Ingrese un color (en inglés)</label>
                    <br />
                    <br />
                    <input id="color" type="text" />
                    <br />
                    <br />
                    <input type="submit" value="Send" />
                </form>
				{!!colors.length && (
					<ul>
						{colors.map((color, i) => (
							<li key={i} style={{ color }}>
								{color}
							</li>
						))}
					</ul>
				)}
			</body>
		</html>
	)


app.handle("/", async req => {
    await req.respond({
        status: 200,
        headers: new Headers({
            "content-type": "text/html; charset=UTF-8"
        }),
        body: content()
    });
});

app.post("/post", async req => {
        console.log(await req.json());
        const color = (await req.formData()).value("color");
        console.log(color);
        if (color) {
            colors.push(color);
        }
        const response = await req.respond({
            status: 200,
            headers: new Headers({
                "content-type": "text/html; charset=UTF-8",
            }),
            body: content(),
        })   
        return response;
})

app.catch(async (e, req) => {
    // All uncaught errors and unhandled promise rejections will be here.
    if (e instanceof RoutingError && e.status === 404) {
      const errorPage = await Deno.open("./public/error.html");
      try {
        await req.respond({
          status: 404,
          headers: new Headers({
            "content-type": "text/html",
          }),
          body: errorPage,
        });
      } finally {
        errorPage.close();
      }
    } else {
      await req.respond({
        status: 500,
        body: "Internal Server Error",
      });
    }
  });

app.listen({port: 8080});




/*
El servidor presentará en su ruta raíz un formulario de ingreso de un color, que será enviado al mismo por método post. Dicho color (en inglés) será incorporado a un array de colores persistido en memoria.

Por debajo del formulario se deberán representar los colores recibidos en una lista desordenada (ul) utilizando el mismo color para la letra en cada caso. El color de fondo del la vista será negro.
*/