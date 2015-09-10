/**
 * @autor Christian Falcon
 * Funciones de enrutamiento
 */
(function(){
  var cache = {};
  this.template = function template(str, data){
      // Averiguamos si estamos recibiendo una template, o si necesitamos. Al carga la template lo guardamos en cache.
    var fn = !/\W/.test(str) ? cache[str] = cache[str] || template(document.getElementById(str).innerHTML) :   
    // Generar una funcion reutilizable que servira como una plantilla like a boss B)
    // Introducir los datos mientras que el uso de variables locales con ( ) { }
        new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};"+"with(obj){p.push('" +
        // Convierte la template en puro JS
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    // Da configuracion al usuario.
    return data ? fn( data ) : fn;
  };
})();

(function () {
      // Guardo las rutas en routes, lo pongo en ingles porque se ve mas pro.
      var routes = {};
      function route (path, templateId, controlador) {
        // Da permiso a la ruta(path, controlador)
        if (typeof templateId === 'function') {
          controlador = templateId;
          templateId = null;
        }
        routes[path] = {templateId: templateId, controlador: controlador};
      }
      var esto = null, actual = null;
      function router () {
        // actual ruta url
        var url = location.hash.slice(1) || '/';
        // Obtiene la ruta por la url 
        var route = routes[url];
        // Que pasa si no tiene template ? 
        if (route && !route.templateId) {
          // Solo inicia el controlador. c:
          return route.controlador ? new route.controlador : null;
        }
        // Carga la vista
        esto = esto || document.getElementById('view');
        if (actual) {
          Object.unobserve(actual.controlador, actual.render);
          actual = null;
        }
        // Verifica si existe la ruta y la vista
        if (esto && route && route.controlador) {
          actual = {
            controlador: new route.controlador,
            template: template(route.templateId),
            render: function () {
              // Renderiza
              esto.innerHTML = this.template(this.controlador);
            }
          };
          actual.render();
          Object.observe(actual.controlador, actual.render.bind(actual));
        }
      }
      this.addEventListener('hashchange', router);
      this.addEventListener('load', router);
      // Lanza la funcion de la ruta.
      this.route = route;
    })();