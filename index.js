// Módulos
var fs = require('fs') // IO ficheros
  , parser = require('csv-parse') // carga CSV en array
  , slug = require('slug') // genera slug
  , ejs = require ('ejs'); // motor de plantillas

// CONFIGURACIÓN
var FICH_DATA = __dirname + '/data/programa.csv';
var DELIMITER = '\t';
var PLANTILLA = __dirname + '/plantilla.ejs';

var etiquetas = require('./data/etiquetas.json');
//añadimos slugs
etiquetas.forEach(function(etiqueta) {
	etiqueta["slug"] = slug(etiqueta.nombre).toLowerCase();
});

function dame_etiquetas(num_medida) {
	var categorias = [];
	etiquetas.forEach(function(etiqueta) {
		if (etiqueta.medidas.indexOf(num_medida)>=0) categorias.push(etiqueta);
	});
	return categorias;
}
// MAIN
// Leemos el fichero con las medidas
parser(fs.readFileSync(FICH_DATA, "utf8"), 
{comment: '#', delimiter: DELIMITER, quote: '"'}, 
function(err, medidas_csv) {
	if (err) return;
	var medidas = [];
	var total_medidas = medidas_csv.length;
	for (var i=0; i<total_medidas; i++) {
		var num = parseInt(medidas_csv[i][0]);
		if (num) {
			var medida = {
				num: num,
				titulo: (medidas_csv[i][1])?medidas_csv[i][1]:"",
				descripcion: (medidas_csv[i][2])?medidas_csv[i][2]:"",
				etiquetas: dame_etiquetas(num)
			};
			medidas.push(medida);
		}
	}
	var pagina = ejs.render(fs.readFileSync(PLANTILLA, "utf8"), {medidas: medidas, etiquetas: etiquetas});
	console.log(pagina);
});

