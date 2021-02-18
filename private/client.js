console.log("client");
Object.defineProperties ( window, {
	clone : { value : ( o ) => {
		return JSON.parse ( JSON.stringify ( o ) );
	} },
	render_history : { value : new Object () },
	start : { value : _render => {
		//console.log("start", _render );
		this.render_history [ JSON.stringify ( get_url ) ] = clone ( _render );
		render ( _render );
		window.addEventListener ( 'resize', () => refresh );
	} },
	render : { value : _render => {
		window.actual_url = get_url;
		//console.log("render", url, _render.dom.content);
		const old_style = style.get ( 'render' );
		dom.map ( _element => _element.pre );
		style.put ( 'render', _render.css );
		Object.entries ( _render.dom ).map ( ( [ _id, _render ] ) => {
			show ( Object.assign ( { id : _id }, _render ) );
		} );
		setTimeout ( () => {
			dom.map ( _element => _element.pos );
		}, 1000 );
		style.quit ( old_style );
		//console.log(777,localStorage);
		history.pushState ( {}, 'foo', `./${ url }` );
		
		pages.map ( _page => {
			if ( url != _page ) {
				if ( pages.indexOf ( _page ) > pages.indexOf ( url ) ) {
					dom.content.dom [ _page ].show ( { class : 'contenido_oculto_abajo' } );
				}
				else {
					dom.content.dom [ _page ].show ( { class : 'contenido_oculto_arriba' } );
				};
			}
			else {
				const item = dom.menu.dom [ _page ].body.getBoundingClientRect ();
				const menu = dom.menu.body.getBoundingClientRect ();
				dom.menu.dom.guide.show ( {
					left : item.left - menu.left + 'px',
					width : item.width + 'px',
					opacity : 0.8,
				} );
			};
		} );
		//dom.scroll.body.scrollTo ( 0, pages.indexOf ( url ) * dom.scroll.body.getBoundingClientRect ().height );
		//dom.scroll.body.removeEventListener ( 'scroll', scroll );
		//dom.scroll.body.addEventListener ( 'scroll', scroll );
		return;
		dom.content.body.removeEventListener ( 'scroll', scroll );
		setTimeout ( () => {
			pages.map ( _page => {
				if ( url != _page ) {
					dom.content.dom [ _page ].show ( { class : 'contenido_oculto' } );
					//console.log ( 555, _page );
				}
				else {
					console.log ( 555, _page );
					var y = dom.content.dom [ _page ].body.getBoundingClientRect ().y;
					var c = 120 * ( window.innerWidth / window.innerHeight );
					var b = y - c;
					dom.content.body.scrollTo ( 0, b );
					//console.log ( 444, devicePixelRatio, y, c );
					setTimeout ( () => {
						dom.content.body.addEventListener ( 'scroll', scroll );
					}, 500 );
				};
			} );
		}, 500 );
		
	} },
	pages : { value : [ 'HOME', 'DESIGN', 'ASSEMBLY', 'MAINTENANCE', 'TRANSFER', 'CONTACT' ] },
	scroll : { value : () => {
		const h = dom.scroll.body.getBoundingClientRect ().height;
		const y = pages.indexOf ( url ) * h;
		var p;
		for ( let i = 5 ; i >= 0 ; i -- ) {
			if ( y > i * h ) {
				console.log ( y, i );
				p = i;
				break;
			};
		};
		console.log ( pages [ p ] );
		return;
		const a = dom.content.dom [ url ].body.getBoundingClientRect ().y;
		var page;
		if ( a < 0 ) {
			console.log ( 'up' );
			page = pages [ pages.indexOf ( url ) + 1 ];
		}
		else if ( a > dom.content.dom [ url ].body.getBoundingClientRect ().height ) {
			page = pages [ pages.indexOf ( url ) - 1 ];
			console.log ( 'down' );
		};
		//console.log ( url, a, ' | ', b );
		if ( page ) navigate ( page );
		//console.log ( 'scroll', dom.content.dom [ url ].body.getBoundingClientRect ().height );
	} },
	get_url : { get : () => {
		return { url : url, device : device };
	} },
	request : { value : async ( _name, _param ) => new Promise ( ( _resolve, _reject ) => {
		const key = key_gen;
		socket.send ( { request : _name, param : Object.assign ( _param || new Object (), { request_key : key } ) } );
		Object.defineProperty ( request, key, { value : ( ... _argument ) => { delete request [ key ]; _resolve ( ... _argument ); } } );
	} ) },
	key_gen : { get : () => {
		let [ length, result, letters, characters ] = [ 10, new Array (), 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' ];
		result.push ( letters.charAt ( Math.floor ( Math.random () * letters.length ) ) );
		for ( let i = 1 ; i < length ; i ++ ) result.push ( characters.charAt ( Math.floor ( Math.random () * characters.length ) ) );
		return result.join ( '' );
	} },
	get_render : { value : async ( _url ) => {
		return request ( 'render', { url : _url } );
	} },
	refresh : { get : async () => {
		const actual_url = get_url;
		if ( window.actual_url != actual_url ) {
			if ( ! this.render_history [ JSON.stringify ( actual_url ) ] ) {
				//console.log (333,actual_url, window.actual_url);
				this.render_history [ JSON.stringify ( actual_url ) ] = await get_render ( actual_url );
			};
			render ( this.render_history [ JSON.stringify ( actual_url ) ] );
		};
	} },
	set_url : { value : ( _name, _value ) => localStorage [ _name ] = _value },
	navigate : { value : ( _url ) => set_url ( 'url', _url ) & refresh },
	show : { value : ( _render, _father ) => {
		_render.id = _render.id || key_gen;
		return ( dom [ _render.id ] = dom [ _render.id ] || new Element ( _render.id, _father ) ).show ( _render )
	} },
	dom : { value : Object.defineProperties ( new Object (), {
		map : { value : ( _loop ) => Object.values ( dom ).map ( _loop ) },
	} ) },
	Element : { value : function Element ( _id, _father ) {
		Object.defineProperties ( this, {
			id : { value : _id },
			father : { get : () => {
				return _father
			} },
			dom_id : { get : () => this.father ? `${ this.father.dom_id }_${ this.id }` : this.id },
			body : { get : () => document.getElementById ( this.dom_id ) || ( () => {
				var body;
				switch ( this.type ) {
				case 'text' :
				case 'password' :
				case 'button' : body = document.createElement ( 'input' ); body.setAttribute ( 'type', this.type ); break;
				default : body = document.createElement ( this.type );
				};
				body.setAttribute ( 'id', this.dom_id );
				( this.father || document ).body.appendChild ( body );
				return body;
			} ) () },
			old_style : { value : new Array (), writable : true },
			pre : { get : () => {
				//this.body.parentNode.replaceChild ( this.body.cloneNode ( true ), this.body );//unbind
				//this.body.classList.className = '';
				
				var classList = this.body.classList;
				while ( this.body.classList.length > 0 ) {
					this.body.classList.remove ( this.body.classList.item ( 0 ) );
				};
				
				delete this.refreshed;
				this.old_style = style.get ( this.dom_id );
				this.dom.map ( _child => _child.pre );
				//console.log (111,this.old_style);
			} },
			pos : { get : () => {
				//console.log (222,this.old_style);
				if ( ! this.refreshed ) this.hide;
				else style.quit ( this.old_style );
				this.old_style = new Array ();
				this.dom.map ( _child => _child.pos );
			} },
			hide : { get : () => {
				( this.father || document ).body.removeChild ( this.body );
				delete ( this.father || window ).dom [ this.id ];
				style.hide ( this.dom_id );
			} },
			dom : { value : Object.defineProperties ( new Object (), {
				map : { value : ( _loop ) => Object.values ( this.dom ).map ( _loop ) },
			} ), writable : true },
			add : { value : _render => {
				_render.id = _render.id || key_gen;
				return ( this.dom [ _render.id ] = this.dom [ _render.id ] || new Element ( _render.id, this ) ).show ( _render );
				return show ( _render, this );
			} },
			show : { value : _render => {
				this.refreshed = true;
				this.type = this.type || _render.type || 'div';
				this.body;
				style.add ( this.dom_id, Object.entries ( _render ).reduce ( ( _style, [ name, value ] ) => {
					switch ( name ) {
					case 'border-radius' :
					case 'text-indent' :
					case 'margin' :
					case 'margin-left' :
					case 'margin-right' :
					case 'margin-top' :
					case 'margin-bottom' :
					case 'padding' :
					case 'padding-left' :
					case 'padding-right' :
					case 'padding-top' :
					case 'padding-bottom' :
					case 'left' :
					case 'right' :
					case 'top' :
					case 'bottom' :
					case 'width' :
					case 'height' : {
						_style [ name ] = isNaN ( value ) ? value : `${ value }vw`;
					} break;
					case 'placeholder' : {
						this.body.setAttribute ( name, value );
					} break;
					case 'image' : {
						_style [ `background-image` ] = `url("./img/${ value }")`;
						_style [ `background-repeat` ] = 'no-repeat';
						_style [ `background-position` ] = 'center center';
						_style [ `background-size` ] = 'cover';
					} break;
					case 'click' : {
						//console.log ('click', value);
						this.body.removeEventListener ( 'click', this.click );
						this.click = () => eval ( value );
						this.body.addEventListener ( 'click', this.click );
					} break;
					case 'class' : {
						this.body.classList.add ( value );
					} break;
					case 'type' :
					case 'id' : {
						
					} break;
					case 'value' : {
						switch ( this.type ) {
						case 'h1' :
						case 'p' :
						case 'div' :
						case 'label' : {
							this.body.innerHTML = value;
						} break;
						default :
							//this.body.value = value;
							this.body.setAttribute ( 'value', value );
						};
					} break;
					default : {
						switch ( typeof value ) {
						case 'object' : {
							value.id = value.id || name;
							this.add ( value );
							//console.log ('add', this.dom_id, value );
						} break;
						default : _style [ name ] = value;
						};
					};
					};
					return _style;
				}, new Object () ) );
				return this;
			} },
		} );
		//console.log ('NEW', this.dom_id );
		( this.father || window ).dom [ this.id ] = this;
	} },
	style : { value : Object.defineProperties ( new Object (), {
		add : { value : ( _id, _style ) => {
			if ( Object.values ( _style ).length == 0 ) return;
			const style = document.createElement ( 'style' );
			style.classList.add ( `style_${ _id }` );
			style.innerHTML = `\n#${ _id } {\n\t` + Object.entries ( _style ).map ( ( [ _name, _value ] ) => `${ _name } : ${ _value }` ).join ( `;\n\t` ) + `\n}\n`;
			document.head.appendChild ( style );
		} },
		put : { value : ( _id, _style ) => {
			const style = document.createElement ( 'style' );
			style.classList.add ( `style_${ _id }` );
			style.innerHTML = Object.entries ( _style ).map ( ( [ _name, _value ] ) => _name + ' { ' +  Object.entries ( _value ).map ( ( [ _name, _value ] ) => {
				switch ( _name ) {
					case 'border-radius' :
					case 'text-indent' :
					case 'margin' :
					case 'margin-left' :
					case 'margin-right' :
					case 'margin-top' :
					case 'margin-bottom' :
					case 'padding' :
					case 'padding-left' :
					case 'padding-right' :
					case 'padding-top' :
					case 'padding-bottom' :
					case 'left' :
					case 'right' :
					case 'top' :
					case 'bottom' :
					case 'width' :
					case 'height' : {
						return `${ _name } : ${ isNaN ( _value ) ? _value : _value + 'vw' }`;
					} break;
					default : return `${ _name } : ${ _value }`;
				};
			} ).join ( ";\n\t" ) + ' } ' ).join ( `\n\t` );
			document.head.appendChild ( style );
		} },
		get : { value : _id => ( [ ... document.getElementsByClassName ( `style_${ _id }` ) ] ) },
		quit : { value : _style => _style.map ( _style => _style.parentNode == document.head ? document.head.removeChild ( _style ) : undefined ) },
		hide : { value : _id => style.quit ( style.get ( _id ) ) },
	} ) },
	
} );
