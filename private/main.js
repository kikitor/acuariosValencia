"use strinct";
console.clear ();
const
port = process.env.PORT || 3000,
host = process.env.PORT ? 'www.maremagno.es' : 'localhost',
protocol = process.env.PORT ? 'https' : 'http',
address = `${ protocol }://${ host }:${ port }`,
default_address =  'HOME',
get = ( req, res ) => {
	req.session.con = true;
	console.log ( 'GET', req.originalUrl );
	return `<!DOCTYPE html>
<html>
	<head>
		<title>&lrm;</title>
		<style>
			* {
				margin : 0;
				padding : 0;
				border : none;
				background-color : inherit;
				color : inherit;
				text-decoration : none;
				overflow : hidden;
				font-size : 1vw;
			}
			body {
				background-color : black;
				color : white;
				position : absolute;
				width : 100%;
				height : 100%;
			}
			body * {
				position : absolute;
			}
		</style>
		<script type = 'text/javaScript' src = '${ address }/socket.io.js'></script>
		<script type = 'text/javaScript'>
			Object.defineProperties ( window, {
				address : { value : '${ address }' },
				device : { get : () => localStorage.device || 'desktop' },
				default_address : { value : '${ default_address }' },
				url : { get : () => localStorage.url || default_address, set : _value => localStorage.url = _value },
			} );
			url = '${ req.originalUrl.split ( '/' ).pop () || default_address }';
			Object.defineProperty ( window, 'socket', { value : window.io.connect ( address, { query : { device : device, url : url } } ).on ( 'message', _message => eval ( _message ) ) } );
		</script>
	</head>
</html>`;
},
con = _socket => {
	if ( ! _socket.handshake.session.con ) return _socket.send ( `location = '';` );
	delete _socket.handshake.session.con;
	const r = render ( { url : _socket.handshake.query.url, device : _socket.handshake.query.device } );
	//console.log ( 'CON', r );
	console.log ( 'CON', _socket.handshake.query.url );
	_socket.send ( `${ client_code }\nstart ( JSON.parse ( \`${ JSON.stringify ( r ) }\` ) );` );
	_socket.on ( 'message', _message => {
		var result;
		//console.log ( 'mes', _message );
		switch ( _message.request ) {
		case 'render' : {
			result = render ( _message.param.url );
		} break;
		default : result = 'NULL';
		};
		_socket.send ( `request [ '${ _message.param.request_key }' ] ( JSON.parse ( \`${ JSON.stringify ( result ) }\` ) );` );
		
	} );
	
},
css = Object.defineProperties ( new Object (), {
	background : { value : Object.defineProperties ( new Object (), {
		logo : { value : 'transparent', },
		menu : { value : 'transparent', },
		content : { value : 'transparent', },
		hover : { value : 'lightgray', },
	} ) },
	margin : { value : Object.defineProperties ( new Object (), {
		left : { value : 1, },
		right : { value : 1, },
		top : { value : 1, },
		bottom : { value : 1, },
		logo : { value : 1, },
		menu : { value : 1, },
		menu_inset : { value : 1, },
		content : { value : 1, },
		content_inset : { value : 1, },
	} ) },
	logo : { value : Object.defineProperties ( new Object (), {
		left : { get : () => css.margin.left + 32, },
		right : { get : () => css.margin.right + 32, },
		top : { get : () => css.margin.top, },
		height : { value : 3, },
	} ) },
	menu : { value : Object.defineProperties ( new Object (), {
		left : { get : () => css.margin.left + 28.15, },
		right : { get : () => css.margin.right + 28.15, },
		top : { get : () => css.margin.menu + css.logo.top + css.logo.height },
		height : { value : 3, },
	} ) },
	content : { value : Object.defineProperties ( new Object (), {
		left : { get : () => css.margin.left + 32, },
		right : { get : () => css.margin.right + 32, },
		top : { get : () => css.margin.content + css.menu.top + css.menu.height },
		bottom : { get : () => css.margin.bottom, },
	} ) },
	image : { value : Object.defineProperties ( new Object (), {
		small : { value : Object.defineProperties ( new Object (), {
			width : { value : 10, },
			height : { value : 5, },
		} ) },
		medium : { value : Object.defineProperties ( new Object (), {
			width : { value : 30, },
			height : { value : 20, },
		} ) },
		big : { value : Object.defineProperties ( new Object (), {
			width : { value : 40, },
			height : { value : 30, },
		} ) },
	} ) },
	p : { value : Object.defineProperties ( new Object (), {
		small : { value : Object.defineProperties ( new Object (), {
			width : { value : 20, },
			height : { value : 5, },
		} ) },
		medium : { value : Object.defineProperties ( new Object (), {
			width : { value : 30, },
			height : { value : 20, },
		} ) },
		big : { value : Object.defineProperties ( new Object (), {
			width : { value : 40, },
			height : { value : 30, },
		} ) },
	} ) },
	title : { value : Object.defineProperties ( new Object (), {
		height : { value : 3, },
	} ) },
	
	
} ),
ui =
[
	{//MASK
		ui : {
			css : {
				'.menu' : {
					position : 'relative',
					float : 'left',
					width : 'auto',
					height : '100%',
					'background-color' : css.background.menu,
					'margin-left' : css.margin.menu_inset / 2,
					'margin-right' : css.margin.menu_inset / 2,
					'padding-left' : css.margin.menu_inset / 2,
					'padding-right' : css.margin.menu_inset / 2,
					'border-radius' : 0.5,
					outline : 'none',
				},
				'.menu:hover' : {
					'background-color' : css.background.hover,
				},
				'.contenido' : {
					top : '0%',
					width : '100%',
					height : '100%',
					'background-color' : 'transparent',
					transition : 'all 1s',
				},
				'.contenido_oculto_arriba' : {
					top : '-100%',
					'background-color' : 'transparent',
				},
				'.contenido_oculto_abajo' : {
					top : '100%',
					'background-color' : 'transparent',
				},
				/* '#content_DESIGN > *' : {
					position : 'relative',
					width : 10,
					height : 10,
				}, */
				
				/* '.contenido' : {
					position : 'absolute',
					left : 0,
					right : 0,
					top : 0,
					height : '100%',
					'background-color' : 'gray',
					transition : 'all 1s',
				},
				'.contenido_oculto_arriba' : {
					top : '-100%',
					'background-color' : 'black',
					//'padding' : 0,
					//'margin' : 0,
				},
				'.contenido_oculto_abajo' : {
					top : '100%',
					'background-color' : 'black',
					//'padding' : 0,
					//'margin' : 0,
				},
				'.menu' : {
					position : 'relative',
					float : 'left',
					width : 'auto',
					height : '100%',
					'background-color' : 'gray',
					'margin-left' : 1,
					'margin-right' : 1,
					'padding-left' : 1,
					'padding-right' : 1,
					outline : 'none',
				},
				'h1' : {
					left : 0,
					right : 0,
					top : 0,
					height : 3,
					'text-align' : 'center',
				},
				'p' : {
					'text-indent' : 3,
					'background-color' : 'green',
				},
				/* 'p' : {
					position : 'relative',
					float : 'left',
					width : '100%',
					height : 'auto',
					'text-align' : 'left',
					display : 'block',
					'text-indent' : 3,
				},
				'.img_small' : {
					//position : 'relative',
					width :  20,
					height : 10,
				}, */
				
			},
			dom : {
				logo : {
					left : css.logo.left,
					right : css.logo.right,
					top : css.logo.top,
					height : css.logo.height,
					'background-color' : css.background.logo,
					titulo : {
						type : 'h1',
						value : 'MAREMAGNO',
						width : '100%',
						height : '100%',
						'text-align' : 'center',
						'font-size' : '2vw',
					},
				},
				menu : {
					left : css.menu.left,
					right : css.menu.right,
					top : css.menu.top,
					height : css.menu.height,
					'background-color' : 'transparent',
					guide : {
						left : 0,
						top : 0,
						width : '100%',
						bottom : 0,
						'background-color' : 'lightgray',
						opacity : 0,
						'border-radius' : 0.5,
						transition : 'all 1s',
					},
					HOME : {
						type : 'button',
						class : [ 'menu' ],
						click : `navigate ( 'HOME' )`,
						value : 'INICIO',
					},
					DESIGN : {
						type : 'button',
						class : [ 'menu' ],
						click : `navigate ( 'DESIGN' )`,
						value : 'DISEÑO',
					},
					ASSEMBLY : {
						type : 'button',
						class : [ 'menu' ],
						click : `navigate ( 'ASSEMBLY' )`,
						value : 'MONTAJE',
					},
					MAINTENANCE : {
						type : 'button',
						class : [ 'menu' ],
						click : `navigate ( 'MAINTENANCE' )`,
						value : 'MANTENIMIENTO',
					},
					TRANSFER : {
						type : 'button',
						class : [ 'menu' ],
						click : `navigate ( 'TRANSFER' )`,
						value : 'TRASLADO',
					},
					CONTACT : {
						type : 'button',
						class : [ 'menu' ],
						click : `navigate ( 'CONTACT' )`,
						value : 'CONTACTO',
					},
				},
				content : {
					left : css.content.left,
					right : css.content.right,
					top : css.content.top,
					bottom : css.content.bottom,
					'background-color' : css.background.content,
					wall : {
						left : 0,
						top : 0,
						right : 0,
						bottom : 0,
						'background-color' : 'lightgray',
						opacity : 0.8,
						'border-radius' : 0.5,
					},
					HOME : {
						class : [ 'contenido' ],
					},
					DESIGN : {
						class : [ 'contenido' ],
					},
					ASSEMBLY : {
						class : [ 'contenido' ],
					},
					MAINTENANCE : {
						class : [ 'contenido' ],
					},
					TRANSFER : {
						class : [ 'contenido' ],
					},
					CONTACT : {
						class : [ 'contenido' ],
					},
					
				},
				wallpaper : {
					left : 0,
					top : 0,
					width : 100,
					height : 100,
					image : 'aquarium-1789918_1920.jpg',
					filter : 'blur(1vw)',
					'z-index' : - 1,
					transition : 'all 1s',
				},
			},
		},
	},
	{//HOME
		url : [ 'HOME' ],
		ui : {
			dom : {
				logo : {
					'background-color' : 'lightgray',
					'border-radius' : 0.5,
				},
				content : {
					HOME : {
						titulo : {
							type : 'h1',
							value : 'BIENVENIDO!',
							//'background-color' : 'blue',
							'text-align' : 'center',
							'vertical-align' : 'middle',
							'font-size' : '1.5vw',
							width : '100%',
							height : css.title.height,
						},
						
					},
				},
				wallpaper : {
					top : 0,
				},
			},
		},
	},
	{//DISEÑO
		url : [ 'DESIGN' ],
		ui : {
			dom : {
				content : {
					DESIGN : {
						'overflow-y' : 'auto',
						titulo : {
							type : 'h1',
							value : 'DISEÑO DE TUS IDEAS Y PROPUESTAS',
							//'background-color' : 'blue',
							'text-align' : 'center',
							'vertical-align' : 'middle',
							'font-size' : '1.5vw',
							width : '100%',
							height : css.title.height,
						},
						i1 : {
							image : 'discus-fish-1943755_1920.jpg',
							left : css.margin.content_inset,
							top : css.title.height + css.margin.content_inset,
							width : css.image.small.width,
							height : css.image.small.height,
							//'background-color' : 'red',
						},
						p1 : {
							type : 'p',
							value : 'Desde hace años, ayudamos a nuestros clientes a cumplir sus sueños, los avances dados en el sector en la última década Hace que nada sea imposible',
							left : css.margin.content_inset * 2 + css.image.small.width,
							top : css.title.height + css.margin.content_inset,
							width : css.p.small.width,
							height : css.p.small.height,
							//'background-color' : 'red',
							'text-indent' : 2,
						},
						i2 : {
							image : 'discus-fish-1943755_1920.jpg',
							left : css.margin.content_inset * 2 + css.p.small.width,
							top : css.title.height + css.margin.content_inset * 2 + css.image.small.height,
							width : css.image.small.width,
							height : css.image.small.height,
							//'background-color' : 'red',
						},
						p2 : {
							type : 'p',
							value : 'Cada vez se ven más acuarios que muy lejos quedan ya de aquel acuario negro encima de un mueble.',
							left : css.margin.content_inset,
							top : css.title.height + css.margin.content_inset * 2 + css.image.small.height,
							width : css.p.small.width,
							height : css.p.small.height,
							//'background-color' : 'red',
							'text-indent' : 2,
						},
						p3 : {
							type : 'p',
							value : 'Hoy en día somos capaces de tener un ecosistema acuático totalmente integrado en nuestro despacho, sala de reuniones, salón... O donde nosotros deseemos tenerlo, con un aspecto y diseño acorde a nuestras expectativas.',
							left : css.margin.content_inset,
							top : css.title.height + css.margin.content_inset * 3 + css.image.small.height * 2,
							width : css.p.medium.width + css.margin.content_inset,
							height : css.p.small.height,
							//'background-color' : 'red',
							'text-indent' : 2,
						},
						i4 : {
							image : 'discus-fish-1943755_1920.jpg',
							left : css.margin.content_inset * 2 + css.p.small.width,
							top : css.title.height + css.margin.content_inset * 4 + css.image.small.height * 3,
							width : css.image.small.width,
							height : css.image.small.height,
							//'background-color' : 'red',
						},
						p4 : {
							type : 'p',
							value : 'Desde nuestro departamento de diseño y creación trabajamos para hacer realidad cualquier idea o sueño.',
							left : css.margin.content_inset,
							top : css.title.height + css.margin.content_inset * 4 + css.image.small.height * 3,
							width : css.p.small.width,
							height : css.p.small.height,
							//'background-color' : 'red',
							'text-indent' : 2,
						},
						i5 : {
							image : 'discus-fish-1943755_1920.jpg',
							left : css.margin.content_inset,
							top : css.title.height + css.margin.content_inset * 5 + css.image.small.height * 4,
							width : css.image.small.width,
							height : css.image.small.height,
							//'background-color' : 'red',
						},
						p5 : {
							type : 'p',
							value : 'Solo tiene que imaginarlo y nosotros lo haremos posible.',
							left : css.margin.content_inset * 2 + css.image.small.width,
							top : css.title.height + css.margin.content_inset * 5 + css.image.small.height * 4,
							width : css.p.small.width,
							height : css.p.small.height,
							//'background-color' : 'red',
							'text-indent' : 2,
						},
					},
				},
				wallpaper : {
					top : - 10,
				},
			},
		},
	},
	{//MONTAJE
		url : [ 'ASSEMBLY' ],
		ui : {
			dom : {
				content : {
					ASSEMBLY : {
						titulo : {
							type : 'h1',
							value : 'MONTAJE Y PUESTA A PUNTO',
							//'background-color' : 'blue',
							'text-align' : 'center',
							'vertical-align' : 'middle',
							'font-size' : '1.5vw',
							width : '100%',
							height : css.title.height,
						},
						i1 : {
							image : 'discus-fish-1943755_1920.jpg',
							left : css.margin.content_inset,
							top : css.title.height + css.margin.content_inset,
							width : css.image.small.width,
							height : css.image.small.height,
							//'background-color' : 'red',
						},
						p1 : {
							type : 'p',
							value : 'En los últimos años el mundo de la acuarofilia se está abriendo paso en nuestras vidas siendo cada vez más una parte muy apreciada en nuestros hogares y empresas.',
							left : css.margin.content_inset * 2 + css.image.small.width,
							top : css.title.height + css.margin.content_inset,
							width : css.p.small.width,
							height : css.p.small.height,
							//'background-color' : 'red',
							'text-indent' : 2,
						},
						i2 : {
							image : 'discus-fish-1943755_1920.jpg',
							left : css.margin.content_inset * 2 + css.p.small.width,
							top : css.title.height + css.margin.content_inset * 2 + css.image.small.height,
							width : css.image.small.width,
							height : css.image.small.height,
							//'background-color' : 'red',
						},
						p2 : {
							type : 'p',
							value : 'Si está pensando en tener un acuario, o ya lo ha adquirido y tiene dudas de cómo instalarlo, o simplemente prefiere que un equipo especializado se lo instale, nosotros nos desplazamos y se lo montamos.',
							left : css.margin.content_inset,
							top : css.title.height + css.margin.content_inset * 2 + css.image.small.height,
							width : css.p.small.width,
							height : css.p.small.height,
							//'background-color' : 'red',
							'text-indent' : 2,
						},
					},
				},
				wallpaper : {
					top : - 20,
				},
			},
		},
	},
	{//MANTENIMIENTO
		url : [ 'MAINTENANCE' ],
		ui : {
			dom : {
				content : {
					MAINTENANCE : {
						titulo : {
							type : 'h1',
							value : 'MANTENIMIENTO Y SOLUCIÓN DE PROBLEMAS',
							//'background-color' : 'blue',
							'text-align' : 'center',
							'vertical-align' : 'middle',
							'font-size' : '1.5vw',
							width : '100%',
							height : css.title.height,
						},
						i1 : {
							image : 'discus-fish-1943755_1920.jpg',
							left : css.margin.content_inset,
							top : css.title.height + css.margin.content_inset,
							width : css.image.small.width,
							height : css.image.small.height,
							//'background-color' : 'red',
						},
						p1 : {
							type : 'p',
							value : 'El mantenimiento de cualquier acuario es fundamental para que se forme, estabilice y mantenga saludable.',
							left : css.margin.content_inset * 2 + css.image.small.width,
							top : css.title.height + css.margin.content_inset,
							width : css.p.small.width,
							height : css.p.small.height,
							//'background-color' : 'red',
							'text-indent' : 2,
						},
						i2 : {
							image : 'discus-fish-1943755_1920.jpg',
							left : css.margin.content_inset * 2 + css.p.small.width,
							top : css.title.height + css.margin.content_inset * 2 + css.image.small.height,
							width : css.image.small.width,
							height : css.image.small.height,
							//'background-color' : 'red',
						},
						p2 : {
							type : 'p',
							value : 'Desde nuestra empresa nos ponemos a su disposición para ayudarle a tener un ecosistema sano y sostenible.',
							left : css.margin.content_inset,
							top : css.title.height + css.margin.content_inset * 2 + css.image.small.height,
							width : css.p.small.width,
							height : css.p.small.height,
							//'background-color' : 'red',
							'text-indent' : 2,
						},
						p3 : {
							type : 'p',
							value : 'Si tiene un acuario pero no puede hacerse cargo de las tareas que conlleva o le surgen problemas en su mantenimiento, no dude en llamarnos, nos desplazamos y ajustamos a usted para que pueda tener su acuario siempre perfecto.',
							left : css.margin.content_inset,
							top : css.title.height + css.margin.content_inset * 3 + css.image.small.height * 2,
							width : css.p.medium.width + css.margin.content_inset,
							height : css.p.small.height,
							//'background-color' : 'red',
							'text-indent' : 2,
						},
						i4 : {
							image : 'discus-fish-1943755_1920.jpg',
							left : css.margin.content_inset * 2 + css.p.small.width,
							top : css.title.height + css.margin.content_inset * 4 + css.image.small.height * 3,
							width : css.image.small.width,
							height : css.image.small.height,
							//'background-color' : 'red',
						},
						p4 : {
							type : 'p',
							value : 'Nosotros nos encargamos de todo usted solo tiene que disfrutarlo.',
							left : css.margin.content_inset,
							top : css.title.height + css.margin.content_inset * 4 + css.image.small.height * 3,
							width : css.p.small.width,
							height : css.p.small.height,
							//'background-color' : 'red',
							'text-indent' : 2,
						},
						
					},
				},
				wallpaper : {
					top : - 30,
				},
			},
		},
	},
	{//TRASLADO
		url : [ 'TRANSFER' ],
		ui : {
			dom : {
				content : {
					TRANSFER : {
						titulo : {
							type : 'h1',
							value : 'TRASLADO DE ACUARIOS',
							//'background-color' : 'blue',
							'text-align' : 'center',
							'vertical-align' : 'middle',
							'font-size' : '1.5vw',
							width : '100%',
							height : css.title.height,
						},
						i1 : {
							image : 'discus-fish-1943755_1920.jpg',
							left : css.margin.content_inset,
							top : css.title.height + css.margin.content_inset,
							width : css.image.small.width,
							height : css.image.small.height,
							//'background-color' : 'red',
						},
						p1 : {
							type : 'p',
							value : 'Muchas veces nos encontramos ante el problema de mover o desplazar nuestro acuario y no sabemos cómo hacerlo.',
							left : css.margin.content_inset * 2 + css.image.small.width,
							top : css.title.height + css.margin.content_inset,
							width : css.p.small.width,
							height : css.p.small.height,
							//'background-color' : 'red',
							'text-indent' : 2,
						},
						i2 : {
							image : 'discus-fish-1943755_1920.jpg',
							left : css.margin.content_inset * 2 + css.p.small.width,
							top : css.title.height + css.margin.content_inset * 2 + css.image.small.height,
							width : css.image.small.width,
							height : css.image.small.height,
							//'background-color' : 'red',
						},
						p2 : {
							type : 'p',
							value : 'Si tienes prevista una mudanza, obra o reforma, o solo quieres cambiar de ubicación Tu acuario y necesitas ayuda para hacerlo, solo tienes que llamarnos y nosotros nos encargamos de todo.',
							left : css.margin.content_inset,
							top : css.title.height + css.margin.content_inset * 2 + css.image.small.height,
							width : css.p.small.width,
							height : css.p.small.height,
							//'background-color' : 'red',
							'text-indent' : 2,
						},
						p3 : {
							type : 'p',
							value : 'Trabajaremos para que el desmontaje, transporte y montaje en la nueva ubicación sea lo más seguro, tanto para el acuario y sus componentes cómo por supuesto para los animales que en el conviven, velando siempre por su bienestar.',
							left : css.margin.content_inset,
							top : css.title.height + css.margin.content_inset * 3 + css.image.small.height * 2,
							width : css.p.medium.width + css.margin.content_inset,
							height : css.p.small.height,
							//'background-color' : 'red',
							'text-indent' : 2,
						},
					},
				},
				wallpaper : {
					top : - 40,
				},
			},
		},
	},
	{//CONTACTO
		url : [ 'CONTACT' ],
		ui : {
			dom : {
				content : {
					CONTACT : {
						titulo : {
							type : 'h1',
							value : 'CONTACTA CON NOSOTROS',
							//'background-color' : 'blue',
							'text-align' : 'center',
							'vertical-align' : 'middle',
							'font-size' : '1.5vw',
							width : '100%',
							height : css.title.height,
						},
						mail : {
							'text-indent' : 1,
							type : 'text',
							left : css.margin.content,
							top : css.title.height,
							width : 32,
							height : 1.5,
							'background-color' : 'white',
							placeholder : 'CORREO...',
							color : 'black',
							'border-radius' : 0.5,
						},
						text : {
							type : 'textarea',
							'text-indent' : 1,
							left : css.margin.content,
							top : css.title.height + css.margin.content_inset + 1.5,
							width : 32,
							bottom : css.margin.content + css.margin.content_inset + 1.5,
							'background-color' : 'white',
							placeholder : 'MENSAJE...',
							color : 'black',
							resize : 'none',
							'border-radius' : 0.5,
						},
						send : {
							type : 'button',
							right : css.margin.content,
							bottom : css.margin.content,
							width : 5,
							height : 1.5,
							'background-color' : 'white',
							color : 'black',
							value : 'ENVIAR',
							'border-radius' : 0.5,
						},
					},
				},
				wallpaper : {
					top : - 50,
				},
			},
		},
	},
],
clone = ( o ) => {
	return JSON.parse ( JSON.stringify ( o ) );
},
merge = ( _a, _b ) => {
	const
	a = clone ( _a ),
	b = clone ( _b );
	Object.entries ( b ).map ( ( [ k, v ] ) => {
		if ( a [ k ] == undefined ) a [ k ] = v;
		else if ( typeof a [ k ] == typeof v ) {
			switch ( typeof v ) {
			case 'object' : {
				if ( Array.isArray ( v ) ) {
					v.map ( vv => a [ k ].push ( vv ) );
				}
				else {
					a [ k ] = merge ( a [ k ], v );
				};
			} break;
			default : a [ k ] = v;
			};
		}
		else {
			a [ k ] = v;
		};
	} );
	return a;
},
render_ram = new Object (),
render = _url => {
	return clone ( render_ram [ JSON.stringify ( _url ) ] = render_ram [ JSON.stringify ( _url ) ] || ui.filter ( _ui => {
		return _ui.url ? _ui.url.indexOf ( _url.url ) != - 1 : true &&
		_ui.device ? _ui.device == _url.device : true
	} ).reduce ( ( _result, _ui ) => {
		return merge ( _result, _ui );
	}, new Object () ).ui );
},
[ express_service, http_service, express_session, input, path, socket_service, socket_session, fs ] = ( [ 'express', 'http', 'express-session', 'body-parser', 'path', 'socket.io', 'express-socket.io-session', 'fs' ] ).map ( require ),
[ express, session ] = [ express_service (), express_session ( { secret : 'ghflsdjklfkjsd', resave : true, saveUninitialized : true } ) ],
client_code = fs.readFileSync ( './private/client.js', 'utf8' ),
http = http_service.createServer ( express ),
socket = socket_service ( http );
express.set ( 'trust proxy', 1 ).use ( express_service.static ( path.join ( __dirname, `../public` ) ), input.urlencoded ( { extended : false } ), input.json (), session ).get ( '*', async ( _request, _response ) => _response.end ( await get ( _request ) ) );
socket.use ( socket_session ( session ) ).on ( 'connection', async _socket => con ( _socket ) );
http.listen ( port );
console.log ( `deploy: ${ address }` );
