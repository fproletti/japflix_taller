// agrego el evento cargar la pagina 
//utilizando fetch para "fetchear" la url 
//puse mjs de console.log para ver si funciona

addEventListener("DOMContentLoaded", (event) => {

    let URL = "https://japceibal.github.io/japflix_api/movies-data.json"
    let listaCompleta = []
    let peliculasFiltradas = []; // defini peliculasFiltradas aca para que la funcion showPeliculas acceda


    fetch(URL) 

    .then(function (response) {
        if (response.ok) {
         console.log ("contenido cargado");
    
        // convierto la respuesta en formato json en un objeto js porque lo voy a usar luego 
         return response.json();
        } else {
          console.log("Error fetcheando la url");
        }})

        .then(data => {
            listaCompleta = data; 
            console.log("Datos cargados:", listaCompleta); 
        });


    function filtrarPeliculas () {

        let input = document.getElementById("inputBuscar").value.toLowerCase();
        

        /* nota OJITO  que antes habia puesto peliculas filtradas como un arreglo vacio y los filtros de arreglos 
        parten de otros arreglos */

   peliculasFiltradas =  listaCompleta.filter( pelicula => {
        return (
        pelicula.title.toLowerCase().includes(input) ||
        pelicula.overview.toLowerCase().includes(input)||
        pelicula.tagline.toLowerCase().includes(input)||
        pelicula.genres.some(genre => genre.name.toLowerCase().includes(input)) // Esta línea daba problemas
        /* ya que son propiedades del json que estan en menor jerarquia, "mas adentro" o subordinadas
        /*  Array.prototype.some()
         se ultilizo el método some() comprueba si al menos un elemento del array cumple con la condición implementada
         por la función proporcionada.
         La stx basica es: arreglo.some(funcioncallback)

         */

     )

    
        });
            console.log(peliculasFiltradas); 

        }
    
     // funcion para mostrar las peliculas y las calificaciones

     function showPeliculas(arreglo) {
        //string vacio para colocar la info
            let htmlContentToAppend = "";
        
            // con un for inicio el recorrido del arreglo 
            //declarando dos variables en el primer for 
            for (let i = 0; i < arreglo.length; i++) {
                let pelicula = arreglo[i];
                let calificacion = "";
        

            //  Dentro del segundo for es donde se hace el chequeo de las estrellas 
            //aca declaro la variable estrellasFull pedirle que redondee con mathround y poner 5 estrellas , no 10
            //
            
            let estrellaFull = Math.round(pelicula.vote_average/2)

            // cambio el id de cada offcanvas insertado 

                let offcanvasId = `offcanvas-${i}`; 

            // cambio el id de cada dropdown insertado 


                let dropdownId = `dropdown-${i}`; 


            // le pido que itere entre 5 estrellas en vez de 10
              for (let j = 0; j < 5; j++) {
                if (j < estrellaFull) {
                    calificacion += '<i class="fa-solid fa-star" style="color: #f5a824;"></i>';
                } else {
                    calificacion += '<i class="fa-regular fa-star"></i>';
                    }
                }
                
            // Extraer los nombres de los géneros y unirlos con guiones con .join
            // .map se utiliza en arreglos (arrays) para crear un nuevo arreglo basado en los resultados de aplicar una función a cada elemento del arreglo original.
               let genres = pelicula.genres.map(genre => genre.name).join(' - ');

            // Para poner solo el anio y no la fecha entera declaro una variable 
            // y uso .split que me que al contratrario que join , separa y recorta la cadena cuando encuentra un guion 

              let releaseYear = pelicula.release_date.split('-')[0]; // Obtiene el año


            // ahora si se suma la informacion completa al html
                 htmlContentToAppend += `
                    <div>
                    <li class="list-group-item" data-bs-toggle="offcanvas" data-bs-target="#${offcanvasId}" aria-controls="${offcanvasId}">
                            <h4>${pelicula.title}</h4>
                            <small>${pelicula.tagline}</small>
                            <div>${calificacion}</div>
                        </li>
                    </div>
                    
            <div class="offcanvas offcanvas-top" tabindex="-1" id="${offcanvasId}" aria-labelledby="${offcanvasId}-label">                          <div class="offcanvas-header">
            <h5 id=${offcanvasId}>${pelicula.title}</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
            <div class="offcanvas-body">
            <p>${pelicula.overview}</p><hr>
            <small> ${genres} </small>

        </div>
                  <div class="dropdown">
            <button class="btn btn-danger dropdown-toggle" type="button" id="${dropdownId}" data-bs-toggle="dropdown" aria-expanded="false">
                Ver más
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><a class="dropdown-item" href="#">Year: ${releaseYear}</a></li>
                <li><a class="dropdown-item" href="#">Runtime: ${pelicula.runtime}</a></li>
                <li><a class="dropdown-item" href="#">Budget:  ${pelicula.budget} </a></li>
            <li><a class="dropdown-item" href="#">Revenue:  ${pelicula.revenue} </a></li>

            </ul>
                </div>
       </div>
                        
                          `
                    
                    
            }
        
        //Llamo al elemento a traves de DOM para agregar el codigo
        document.getElementById("lista").innerHTML = htmlContentToAppend;
        console.log("se agregaron");
        }

        

 /* esta fue mi version anterior que no funcionaba 
 ERRORES: las variables estan colocadas en lugares donde  no funcionan 
 Los recorridos se estan haciendo uno dentro del otro, y se esta indicando agregar html en disitos lados.

 function showPeliculas(arreglo) {

        let htmlContentToAppend = "";
        for (let i = 0; i < arreglo.length; i++) {
            let pelicula = arreglo[i];
            htmlContentToAppend += '<div><li class="list-group-item"><h4>' 
            + pelicula.title + '</h4> <small>' + pelicula.tagline + ' </small></div><div>' + 
            
            for(let pelicula of peliculasFiltradas){
                let calificacion="";
                for(let i=0;i<10;i++){
                    if ((i+1)<pelicula.vote_average){
                        calificacion+="<p> llena </p>";
                    }else{
                        calificacion+="<p> vacia </p>";
                    }
                }

                puntos+=`${calificacion}`;
            } pelicula.vote_average + '</li></div>';} 
        
        document.getElementById("lista").innerHTML= htmlContentToAppend;
        console.log("se agregaron"); // esto se ve en consola, o sea que funciona , no se porque no se muestran en pantalla

    
    }*/

  
 let buscar = document.getElementById("btnBuscar")

buscar.addEventListener("click", (e) => {
    filtrarPeliculas ();
    showPeliculas(peliculasFiltradas)

}
)
 

});



    





