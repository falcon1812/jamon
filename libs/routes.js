/* Jamon MVC JavaScript 
 * License MIT 
 * Download from / Descarga desde -> falcon1812.github.io/jamon
 * Made with a lot of hard work and ♡. / Hecho con trabajo duro y ♡.
 * @author Christian Falcon.
 */

/**
 * Funciones de enrutamiento
 * Routes functions
 * @author Christian Falcon
 * @return JavaScript class
 */
(function(){
    var cache = {};
    this.template = function template(str, data){
    // Averiguamos si estamos recibiendo un template, o si necesitamos. Al carga la template lo guardamos en cache.
    var fn = !/\W/.test(str) ? cache[str] = cache[str] || template(document.getElementById(str).innerHTML) :   
    // Generar una funcion reutilizable que servira como una plantilla like a boss B)
    // Introducir los datos mientras que el uso de variables locales con ( ) { }
    new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};"+"with(obj){p.push('" +
    // Convierte la template en puro JS, para poder manipular.
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

var controller = (function () {
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
            // Object.unobserve tegnologia experimental. soporta chrome 36+ y opera 23+, gecko es gay y no aguanta. 
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
        // Object.observe tegnologia experimental. soporta chrome 36+ y opera 23+, gecko es gay y no aguanta. 
        Object.observe(actual.controlador, actual.render.bind(actual));
        }
    }
    this.addEventListener('hashchange', router);
    this.addEventListener('load', router);
    // Lanza la funcion de la ruta.
    this.route = route;
})();

/**
 * Funciones de carga de html en la pagina
 * @author Christian Falcon
 * @return JavaScript class
 */
(function(){
    var listoListado,
        DOMContentLoaded,
        class2type = {};
        class2type["[object Boolean]"] = "boolean";
        class2type["[object Number]"] = "number";
        class2type["[object String]"] = "string";
        class2type["[object Function]"] = "function";
        class2type["[object Array]"] = "array";
        class2type["[object Date]"] = "date";
        class2type["[object RegExp]"] = "regexp";
        class2type["[object Object]"] = "object";

    var ObjetoListo = {
        // Esta listo el DOM para darle uso? 
        estaListo: false,
        // Comienza un contador de espera para el DOM
        readyWait: 1,
        // Espera que el objeto este listo, si no aumenta el tiempo de espera.
        holdReady: function(wait) {
            if (wait) {
                ObjetoListo.readyWait++;
                console.log('prueba');
            } else {
                ObjetoListo.ready(true);
            }
        },
        // Se habilita cuando el DOM esta lesto
        listo: function(espera) {
            // Si aun esta cargando o el DOM no esta listo lo pone lento.
            if ( (espera === true && !--ObjetoListo.readyWait) || (espera !== true && !ObjetoListo.estaListo) ) {
                // Verifica que todo el body este cargado, IE se tarde burda.
                if (!document.body) {
                    return setTimeout(ObjetoListo.ready, 1);
                }

                // Guardo que el DOM esta listo
                ObjetoListo.estaListo = true;
                // Si algun evento dentro del DOM es disparado entra aca
                if (espera !== true && --ObjetoListo.readyWait > 0) {
                    return;
                }
                listoListado.resolveWith(document, [ObjetoListo]);
            }
        },
        bindReady: function() {
            if (listoListado) {
                return;
            }
            listoListado = ObjetoListo._Diferido();
            if (document.readyState === "complete") {
                // Hace que los script tarden para tener tiempo de que esten en sincronia
                return setTimeout(ObjetoListo.listo, 1);
            }
            // Mozilla, Opera y chrome soportan este evento, IE es gay
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
                window.addEventListener("load", ObjetoListo.ready, false);
            // Para cuando usan IE
            } else if (document.attachEvent) {
                // Se tarda pero tambien carga los iframe
                document.attachEvent("onreadystatechange",DOMContentLoaded);
                window.attachEvent("onload",ObjetoListo.ready);
                // Verifica si el documento esta listo
                var toplevel = false;
                    try {
                        toplevel = window.frameElement == null;
                    } catch(e) {}
                if (document.documentElement.doScroll && toplevel) {
                    doScrollCheck();
                }
            }
        },
        _Diferido: function() {
            var // Lista de llamadas
                llamadas = [],
                // Guardados [ contexto , argumentos = args ]
                disparados,
                // Evita que se disparen los eventos antes de estar cargados
                disparando,
                // Bandera que identifica cuando fue cancelado
                cancelado,
                // Diferido es donde se ejecuta un mierdero
                diferido  = {
                    // hace( f1, f2, bla, bla, ...) 
                    done: function() {
                        if (!cancelado) {
                            var args = arguments, i, length, elem, type, _disparados;
                            if (disparados) {
                                _disparados = disparados;
                                disparados = 0;
                            }
                            for ( i = 0, length = args.length; i < length; i++ ) {
                                elem = args[i];
                                type = ObjetoListo.type(elem);
                                if (type === "array") {
                                    diferido.done.apply(diferido, elem);
                                } else if (type === "function") {
                                    llamadas.push(elem);
                                }
                            }
                            if (_disparados) {
                                diferido.resolveWith( _disparados[0], _disparados[1] );
                            }
                        }
                        return this;
                    },
                    // Resuelve con el contexto y el argumento dado
                    resolveWith: function( context, args ) {
                        if (cancelado && !disparados && !disparando) {
                            // Se asegura de que los argumentos esten bien
                            args = args || [];
                            disparando = 1;
                            try {
                                while( llamadas[0] ) {
                                    llamadas.shift().apply( context, args );
                                }
                            }
                            finally {
                                disparados = [context, args];
                                disparando = 0;
                            }
                        }
                        return this;
                    },
                    // Resuelve con el contexto y el argumento dado
                    resolve: function() {
                        diferido.resolveWith( this, arguments );
                        return this;
                    },
                    isResolved: function() {
                        return !!( disparando || disparados );
                    },
                    // Cancelar
                    cancel: function() {
                        cancelado = 1;
                        llamadas = [];
                        return this;
                    }
                };
            return diferido;
        },
        type: function(obj) {
            return obj == null ? String(obj) : class2type[Object.prototype.toString.call(obj)] || "object";
        }
    }
    // DOM esta listo para IE
    function doScrollCheck() {
        if (ObjetoListo.estaListo) {
            return;
        }
        try {
            // Si usan IE, pilla este truco por Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            document.documentElement.doScroll("left");
        } catch(e) {
            setTimeout(doScrollCheck, 1 );
            return;
        }
        // Ejecuta funcion de espera.
        ObjetoListo.listo();
    }
    // Limpia funciones de documento.ready
    if (document.addEventListener) {
        DOMContentLoaded = function() {
            document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false);
            ObjetoListo.listo();
        };
    } else if (document.attachEvent) {
        DOMContentLoaded = function() {
            // Verifica que todo el body este cargado, IE se tarde burda.
            if (document.readyState === "complete") {
                document.detachEvent( "onreadystatechange", DOMContentLoaded);
                ObjetoListo.listo();
            }
        };
    }
    function listo(fn) {
        // Adjunta
        ObjetoListo.bindReady();
        var type = ObjetoListo.type(fn);
        // Hace un callback / llamada
        listoListado.done(fn);// Esto es resultado de la funcion _Deferred()
    };
    return listo;
})();

/**
 * Funcion para manejo de etiqueta xhtml en el DOM.
 * @param [attribute, atributo] xhtml 
 * @author Christian Falcon
 * @return array[html.object]
 */
function getElement(atributo)
{
    var Coincidencias = [];
    var TodosLosElementos = document.getElementsByTagName('*'); // Busca en todo el DOM
        for (var i = 0, n = TodosLosElementos.length; i < n; i++)
        {
            if (TodosLosElementos[i].getAttribute(atributo) !== null)
            {
                // Se crea arreglo con todos lo elementos con ese atributo
                Coincidencias.push(TodosLosElementos[i]);
            }
        }
    return Coincidencias;
};

/**
 * Funcion de ajax para hacer peticiones
 * @author Christian Falcon
 * @return Peticion / Request Ajax
 */   
var ajax = {};
ajax.x = function() {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();  
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",   
        "MSXML2.XmlHttp.4.0",  
        "MSXML2.XmlHttp.3.0",   
        "MSXML2.XmlHttp.2.0",  
        "Microsoft.XmlHttp"
    ];
    var xhr;
        for(var i = 0; i < versions.length; i++) {  
            try {  
                xhr = new ActiveXObject(versions[i]);  
                break;  
            } catch (e) {
            }  
        }
        return xhr;
    };
    ajax.send = function(url, callback, method, data, sync) {
        var x = ajax.x();
        x.open(method, url, sync);
        x.onreadystatechange = function() {
            if (x.readyState == 4) {
                callback(x.responseText)
            }
        };
        if (method == 'POST') {
            x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        x.send(data)
    };
    ajax.get = function(url, data, callback, sync) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, sync)
    };
    ajax.post = function(url, data, callback, sync) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        ajax.send(url, callback, 'POST', query.join('&'), sync)
};

/**
 * Funcion que limpia textos y arreglos de texto
 * @param [texto|caracter]  
 * @author Christian Falcon
 * @return string
 */
function cleanString(valor, elemento)
{
    var resultado;
    // Verifico que sea de tipo array
    if (valor.constructor === Array) {
        for (var i = 0; i < valor.length; i++) {
            resultado = valor[i].replace(elemento ,'');
        }
    } else {
        resultado = valor.replace(elemento ,'');
    }
    return resultado;
}

/**
 * Funcion para crear ruta hacia controlador de la pagina
 * @param metodo del controlador
 * @author Christian Falcon
 * @return string(uri)
 */
function thismethod(method) {
    var controlador = window.location.pathname.split("/");
    var url = controlador[1] + '/' + method + '/';
    var uri = cleanString(url, '.,#?'); // Limpio la url de variables y esas cosas
    return uri;
}

/**
 * Funcion que crea formularios
 * @param ...
 * @author Christian Falcon
 * @return DOM
 */
function createform(append, attribute) {
    var form = document.createElement("form");
    for (var i = 0; i < attribute.length; i++) {
        form.setAttribute(this ,this.value);
        console.log(this);
        console.log(this.value)
    }
    console.log(append);
//    var dom = document.getElementsByTagName(whereappend).appendChild(form);
//    return dom;
}

/**
 * Funcion que crear inputs
 * Funcion que crear inputs
 * @param [string|array] el arreglo viene con objetos
 * @author Christian Falcon
 * @return DOM
 */
function createinput(append, attribute) {
    var input = document.createElement("input"); //input element, text
    input.setAttribute(attribute,attribute.value);
    append.appendChild(input);
}

/**
 * Funcion para borrar cosas por Ajax
 * @param id elemento
 * @author Christian Falcon
 * @return JavaScript class
 */
var thisdelete = (function() {
    thisdelete: function thisdelete() {
            var accion = getElement('delete');
                for (var i = 0; i < accion.length; i++) {
                accion[i].onclick = function() {
                    var valor = this.getAttribute('delete');
                    var method = thismethod('destroy');
                    ajax.post(method, {id: valor}, function() {});
                }
            } 
        } 
    return thisdelete;
})();

/**
 * Funcion para crear cosas por Ajax
 * @param 
 * @author Christian Falcon
 * @return JavaScript class
 */
var thiscreate = (function() {
    thiscreate: function thiscreate() {
            var accion = getElement('create');
                for (var i = 0; i < accion.length; i++) {
                accion[i].onsubmit = function() {
                    // Obtengo el valor de create y verifico su metodo
                    var metodo = this.getAttribute('create').toUpperCase(); 
                    var method = thismethod('create'); // metodo del controlador en donde este
                    var valor = this.querySelectorAll('[this]');
                    var objectSend = {};
                    for (var o = 0; o < valor.length; o++) {
                        var objecto = valor[o].getAttribute('this');
                        var objectovalor = valor[o].value;
                        objectSend[objecto] = objectovalor;
                    }
                    if (metodo == 'POST') {
                            ajax.post(method, objectSend, function() {}); 
                    } else {
                            ajax.get(method, objectSend, function() {}); 
                    }
                }
            } 
        } 
    return thiscreate;
})();

/**
 * Funcion para mostrar todas las funciones ejecutadas (debug).
 * @author Christian Falcon
 * @param [name]
 * @return [function=name].
 */
function debug(withFn) {
    var nombre, fn;
    for (nombre in window) {
        fn = window[nombre];
        if (typeof fn === 'function') {
            window[nombre] = (function(nombre, fn) {
                    var args = arguments;
                    return function() {
                        withFn.apply(this, args);
                        return fn.apply(this, arguments);
                    }
            })(nombre, fn);
        }
    }
}

/**
 * Funcion para editar cosas por Ajax
 * @param id elemento
 * @author Christian Falcon
 * @return JavaScript class
 */
var getupdate = (function() {
    getupdate: function getupdate() {
            var accion = getElement('edit');
                for (var i = 0; i < accion.length; i++) {
                accion[i].onclick = function() {
                    var valor = this.parentNode.parentElement;
                    // obtengo el texto de los th de la tabla
                    var th = valor.parentNode.parentElement.childNodes[1].childNodes[1].cells;
                    for (var o = 0; o < valor.cells.length; o++) {
                        var value = valor.cells[o].firstChild.data;
                        value.trim() ? console.log(value) : 'tag html' ;
                        console.log(th);
                        var esto = {atributo:'true'};
                        var veamos = createform('body',esto);
                        console.log(veamos)
//                            var method = thismethod('update');
//                            ajax.post(uri, {id: valor}, function() {});
                        
                    }
                }
            } 
        }
    return getupdate;
})();
