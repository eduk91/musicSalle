function musicSalle(){
	var MusicRecommender = {
		
		info:'',
		infoReco:'',
		songURL:[],
		songName:[],
		artistID:[],
		artistIDReco:[],

		getInfo : function(){
			return this.info;
		},

		getInfoReco : function(){
			return this.infoReco;
		},

		getSongURL : function(){
			return this.songURL;
		},

		getArtistID : function(){
			return this.artistID;
		},
		
		getSongName : function(){
			return this.songName;
		},

		getArtistIDReco : function(){
			return this.artistIDReco;
		},
		
		getType : function(){
			if(document.getElementById("cancion").checked == true){
				return document.getElementById("cancion").value;
			}
			if(document.getElementById("artista").checked == true){
				return document.getElementById("artista").value;
			}
			if(document.getElementById("album").checked == true){
				return document.getElementById("album").value;
			}
		},
		
		search : function(buscador, tipo){
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "https://api.spotify.com/v1/search?q="+buscador+"&type="+tipo, false);
			//xhr.open("GET", "https://api.spotify.com/v1/search?q=fran%20perea&type=track", false);
			xhr.send();
			var json = xhr.responseText;
			this.info = JSON.parse(json);
		},

		searchRecomend : function(idArtist){
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "https://api.spotify.com/v1/artists/"+idArtist+"/related-artists", false);
			//xhr.open("GET", "https://api.spotify.com/v1/search?q=fran%20perea&type=track", false);
			//5ZmqtSfV4bMseeYE96i7Nt
			xhr.send();
			var json = xhr.responseText;
			this.infoReco = JSON.parse(json);
			//console.log(this.infoReco);
		},
		
		list : function(){
			
			var a = document.createElement('ul');
			a.setAttribute("id", "lista");
			
			if(document.getElementById("cancion").checked == true){
				//guardamos cuantos elementos hay en el json recibido
				this.numItems = this.info.tracks.items.length;
				
				//por cada elemento creamos el html para ir añadiendolo
				for(var i=0; i < this.numItems; i++){

					var trackName = this.info.tracks.items[i].name;
					for(var j=0; j< this.info.tracks.items[i].artists.length;j++){
						trackName += " - " + this.info.tracks.items[i].artists[j].name;
					}
					a.innerHTML += "<div class='item'><li id='item" + i + "'>" + trackName + "</li> <i class='fa fa-youtube-play' aria-hidden='true' fa-3x></i> </div>";
					//guardamos cada uno de los preview de las canciones
					this.songURL[i] = this.info.tracks.items[i].preview_url;
				}
			}
			
			if(document.getElementById("artista").checked == true){
				this.numItems = this.info.artists.items.length;
				for(var i = 0; i < this.numItems; i++){
					this.artistID[i] = this.info.artists.items[i].name;
					var artistName = this.info.artists.items[i].name;
					a.innerHTML += "<div class='item'><li id='item" + i + "'>" + artistName + "</li> </div>";
				}
				MusicRecommender.search(document.getElementById('textSearch').value, 'track');
				this.numItems = this.info.tracks.items.length;
				for(var i = 0; i < this.numItems; i++){
					this.songURL[i] = this.info.tracks.items[i].preview_url;
					this.songName[i] = this.info.tracks.items[i].name;
				}
				
			}
			
			if(document.getElementById("album").checked == true){
	
				this.numItems = this.info.albums.items.length;

				for(var i = 0; i < this.numItems; i++){
					var albumName = this.info.albums.items[i].name;
					a.innerHTML += "<div class='item'><li id='item" + i + "'>" + albumName + "</li> </div>";
				}
			}
			
			document.getElementById('listaCanciones').appendChild(a);
		},

		listRecomend : function(idArtist){

			//document.getElementById('listaRecomend').removeChild(document.getElementById('lista'));

			var a = document.createElement('ul');
			a.setAttribute("id", "listaRe");

			MusicRecommender.searchRecomend(idArtist);
			//console.log(this.infoReco.artists.length);
			this.numItems = this.infoReco.artists.length;
			
			for(var i = 0; i < this.numItems; i++){
				this.artistIDReco[i] = this.infoReco.artists[i].name;
				var artistName = this.infoReco.artists[i].name;
				a.innerHTML += "<div class='item'><li id='item" + i + "'>" + artistName + "</li> </div>";
			}

			/*MusicRecommender.search(document.getElementById('textSearch').value, 'track');
			this.numItems = this.info.tracks.items.length;
			for(var i = 0; i < this.numItems; i++){
				this.songURL[i] = this.info.tracks.items[i].preview_url;
				this.songName[i] = this.info.tracks.items[i].name;
			}*/
			
			document.getElementById('listaRecomend').appendChild(a);

			Listener.showTracksRecomend();

		},
		
		detail:function(cancion, artista, album, imageAlbum){

			document.getElementById('songName').innerHTML =  String(cancion);
			document.getElementById('artistName').innerHTML =  String(artista);
			document.getElementById('imagePlayer').style.backgroundImage = 'url('+imageAlbum+')';
			if(album != ""){
				document.getElementById('albumName').innerHTML = String(album);
			}
		},
		
		playList : function (preview){
			var buttonSave = document.getElementById('saveSong');
			buttonSave.addEventListener('click', function(){
				// guardamos info para la playlist
				Data.save(preview, 1);				
			});			
		},
		
		
		showPlayList : function(){
			var a = document.createElement('ul');
			a.setAttribute("id", "listita");
			
			var canciones = JSON.parse(localStorage.getItem("playList"));
			if(canciones != null){
				for(var i = 4; i < canciones.length; i++){
					a.innerHTML += "<li class='cancionesList' id=" + canciones[i][3] + ">" + canciones[i][0] + " - "+canciones[i][1]+"</li>";
				}
				document.getElementById('playList').appendChild(a);
				
				a.addEventListener('click', function(e){
					if(e.target && e.target.nodeName == "LI"){
						var songName = e.target.textContent;
						var aux = songName.split('-');
						var artistNom = aux[0].trim();
						songName = aux[1].trim();
						
						MusicRecommender.detail(songName, artistNom, 'PLAYLIST', 'http://www.yvelinesradio.com/infos_all/photos/2011/Logo-2-Playlist-04-12-2011-21h52-05-La-premeire-de-Playlist.jpg');
						Player.musicPlayer(e.target.id);
					}
				});
			}
		},
	
	}
	
	var Player = {		
		musicPlayer : function(songPre, songHref){		
			var buttonPlay = document.getElementById('buttonPlay');
			buttonPlay.addEventListener('click', function(){
				var music = document.getElementById('player');
				music.src = songPre;

				if(buttonPlay.className == 'fa fa-play controls--play-button'){
					music.play();
					buttonPlay.className = 'fa fa-stop controls--play-button';
					
					// guardamos info para los recomendados
					//Data.save(songPre, 0);
				}else{
					music.pause();
					buttonPlay.className = 'fa fa-play controls--play-button';
					location.reload(); 
				}
			});

		},		
	}
	
	
	var Data = {
		aux : [],
		listaRep : [],
		
		save : function(pre, option){
			var artNom = document.getElementById('artistName').textContent;
			var songNom = document.getElementById('songName').textContent;
			var albumNom = document.getElementById('albumName').textContent;

			this.aux = [artNom, songNom, albumNom, pre];
			// miramos que no este guardado ya
			var igual = 0;
			if(option == 0){
				this.listaRep = Data.get();
				if(this.listaRep != null){	
					for(var i=0; i < this.listaRep.length ; i++){
						if(this.listaRep[i][0] == artNom && this.listaRep[i][1] == songNom && this.listaRep[i][2] == albumNom && this.listaRep[i][3] == pre){
							igual = 1;
						}
					}
				
					if(igual == 0){
						this.listaRep.push(this.aux);
						// utilizamos localStorage (permanece en el dipositivo del cliente mientras este no borre el cache del navegador)
						localStorage.setItem("repList", JSON.stringify(this.listaRep));
					}
				}else{
					this.listaRep = this.aux;
					localStorage.setItem("repList", JSON.stringify(this.listaRep));
				}
			}else{
				this.listaRep = JSON.parse(localStorage.getItem("playList"));
				if(this.listaRep != null){	
					for(var i=0; i < this.listaRep.length ; i++){
						if(this.listaRep[i][0] == artNom && this.listaRep[i][1] == songNom && this.listaRep[i][2] == albumNom && this.listaRep[i][3] == pre){
							igual = 1;
						}
					}
					if(igual == 0){
						this.listaRep.push(this.aux);
						localStorage.setItem("playList", JSON.stringify(this.listaRep));
					}
				}else{
					this.listaRep = this.aux;
					localStorage.setItem("playList", JSON.stringify(this.listaRep));
				}
			}			
		},	

		get	: function(){
						
			// para recuperar usamos:
			var storedList = JSON.parse(localStorage.getItem("repList"));
			
			// devuelve array, en cada posicion hay: nombreArtista, nombreCancion, nombreAlbum, preview_url. De cada articulo reproducido
			return storedList;
		},	
	}
	
	
	var Listener = {
		
		artistName : '',
		songPreview : '',
		songID : '',
		
		getArtistName : function(){
			return this.artistName;
		},
				
		getSongID : function(){
			return this.songPreview;
		},
							
		searchButtonListener : function(){
			
			document.onkeydown = function (enter){
				if(enter.keyCode === 13){

					var type = MusicRecommender.getType();
	    			MusicRecommender.search(document.getElementById('textSearch').value, type);
	    			MusicRecommender.list();

					Listener.showTracks();
			
				}
 
			}
			
		},
		
		showTracks : function(){
			var artistas = MusicRecommender.getArtistID();
			
			if(document.getElementById("artista").checked == true){
					var a = document.createElement('ul');

					var divArtist = document.getElementById('lista');
					divArtist.addEventListener('click', function(e){
						if(e.target && e.target.nodeName == "LI"){
							//limpiamos y mostramos tracks de ese artista
							document.getElementById('listaCanciones').removeChild(document.getElementById('lista'));
							MusicRecommender.search(e.target.textContent, 'track');
							var info = MusicRecommender.getInfo();
							for(var j=0; j < info.tracks.items.length ; j++){
								a.setAttribute("id", "lista");
								a.innerHTML += "<div class='item'><li id='item" + j + "'>" + info.tracks.items[j].name + "</li> <i class='fa fa-youtube-play' aria-hidden='true' fa-3x></i> </div>";
							}
							this.artistName = e.target.textContent;
							Listener.setDetails(this.artistName, 'nada');	
						}
					});
				document.getElementById('listaCanciones').appendChild(a);
			}
			
			if(document.getElementById("cancion").checked == true){
				var divCancion = document.getElementById('lista');
				var flag = -1;
				divCancion.addEventListener('click', function(e){
						if(e.target && e.target.nodeName == "LI"){
							//limpiamos y etc etc
							document.getElementById('listaCanciones').removeChild(document.getElementById('lista'));
							var songName = e.target.textContent;
							var aux = songName.split('-');
							var artistNom = aux[1].trim();
							songName = aux[0].trim();
							
							// set details....
							
							MusicRecommender.search(songName, 'track');
							var info = MusicRecommender.getInfo();

							// Recomended
							var artistID = info.tracks.items[0].artists[0].id;
							//console.log(artistID);
							MusicRecommender.listRecomend(artistID);
							

							for(var i=0; i < info.tracks.items.length ; i++){
								if(info.tracks.items[i].name == songName){
									if( flag == -1 ){
										flag = i;
									}
								}
								
							}
							
							var albumName = info.tracks.items[flag].album.name;
							var imageAlbum = info.tracks.items[flag].album.images[0].url;
							this.songPreview = info.tracks.items[flag].preview_url;
							this.songID = info.tracks.items[flag].href;
							
							MusicRecommender.detail(songName, artistNom, albumName, imageAlbum);
							Player.musicPlayer(this.songPreview, this.songID);
							MusicRecommender.playList(this.songPreview);
						}
					});
				
			}
			
			if(document.getElementById("album").checked == true){
				var divCancion = document.getElementById('lista');
				var a = document.createElement('ul');
				var nomalbum;
				divCancion.addEventListener('click', function(e){
						if(e.target && e.target.nodeName == "LI"){
							//limpiamos y etc etc
							document.getElementById('listaCanciones').removeChild(document.getElementById('lista'));
							
							var albumName = (e.target.textContent).trim();
							MusicRecommender.search(albumName, 'track');
							var info = MusicRecommender.getInfo();
							
							for(var j=0; j < info.tracks.items.length ; j++){
								a.setAttribute("id", "lista");
								a.innerHTML += "<div class='item'><li id='item" + j + "'>" + info.tracks.items[j].name + "</li> <i class='fa fa-youtube-play' aria-hidden='true' fa-3x></i> </div>";
								
							}
							
							Listener.setDetails('nada', albumName);
						}
					});
				document.getElementById('listaCanciones').appendChild(a);
			}
			
		},


		showTracksRecomend : function(){
			var artistas = MusicRecommender.getArtistID();
			
			if(document.getElementById("artista").checked == true){
					var a = document.createElement('ul');

					var divArtist = document.getElementById('listaRe');
					divArtist.addEventListener('click', function(e){
						if(e.target && e.target.nodeName == "LI"){
							//limpiamos y mostramos tracks de ese artista

							document.getElementById('listaRecomend').removeChild(document.getElementById('listaRe'));
							MusicRecommender.search(e.target.textContent, 'track');
							var info = MusicRecommender.getInfo();
							for(var j=0; j < info.tracks.items.length ; j++){
								a.setAttribute("id", "lista");
								a.innerHTML += "<div class='item'><li id='item" + j + "'>" + info.tracks.items[j].name + "</li> <i class='fa fa-youtube-play' aria-hidden='true' fa-3x></i> </div>";
							}
							this.artistName = e.target.textContent;
							Listener.setDetailsRecomend(this.artistName, 'nada');	
						}
					});
				document.getElementById('listaRecomend').appendChild(a);
			}
			
			if(document.getElementById("cancion").checked == true){
				var divCancion = document.getElementById('listaRe');
				var flag = -1;
				divCancion.addEventListener('click', function(e){
						if(e.target && e.target.nodeName == "LI"){
							//limpiamos y etc etc
							document.getElementById('listaRecomend').removeChild(document.getElementById('listaRe'));
							var songName = e.target.textContent;
							var aux = songName.split('-');
							var artistNom = aux[1].trim();
							songName = aux[0].trim();
							
							// set details....
							
							MusicRecommender.search(songName, 'track');
							var info = MusicRecommender.getInfo();
							

							for(var i=0; i < info.tracks.items.length ; i++){
								if(info.tracks.items[i].name == songName){
									if( flag == -1 ){
										flag = i;
									}
								}
								
							}
							
							var albumName = info.tracks.items[flag].album.name;
							var imageAlbum = info.tracks.items[flag].album.images[0].url;
							this.songPreview = info.tracks.items[flag].preview_url;
							this.songID = info.tracks.items[flag].href;
							
							MusicRecommender.detail(songName, artistNom, albumName, imageAlbum);
							Player.musicPlayer(this.songPreview, this.songID);
							MusicRecommender.playList(this.songPreview);
						}
					});
				
			}
			
			if(document.getElementById("album").checked == true){
				var divCancion = document.getElementById('listaRe');
				var a = document.createElement('ul');
				var nomalbum;
				divCancion.addEventListener('click', function(e){
						if(e.target && e.target.nodeName == "LI"){
							//limpiamos y etc etc
							document.getElementById('listaRecomend').removeChild(document.getElementById('listaRe'));
							
							var albumName = (e.target.textContent).trim();
							MusicRecommender.search(albumName, 'track');
							var info = MusicRecommender.getInfo();
							
							for(var j=0; j < info.tracks.items.length ; j++){
								a.setAttribute("id", "lista");
								a.innerHTML += "<div class='item'><li id='item" + j + "'>" + info.tracks.items[j].name + "</li> <i class='fa fa-youtube-play' aria-hidden='true' fa-3x></i> </div>";
								
							}
							
							Listener.setDetailsRecomend('nada', albumName);
						}
					});
				document.getElementById('listaRecomend').appendChild(a);
			}
			
		},
		
		setDetails : function(artista, albumn){	
			var flag = -1;		
			var divCancion = document.getElementById('lista');
			if(document.getElementById("artista").checked == true){
				divCancion.addEventListener('click', function(e){
							if(e.target && e.target.nodeName == "LI"){
								//limpiamos y etc etc
								document.getElementById('listaCanciones').removeChild(document.getElementById('lista'));
								var songName = e.target.textContent;
								var artistNom = artista;

								MusicRecommender.search(artista, 'track');
								var info = MusicRecommender.getInfo();

								// Recomended
								var artistID = info.tracks.items[0].artists[0].id;
								//console.log(artistID);
								MusicRecommender.listRecomend(artistID);
								

								for(var i=0; i < info.tracks.items.length ; i++){
									if(info.tracks.items[i].name == songName){
										if( flag == -1 ){
											flag = i;
										}
									}
									
								}
								
								var albumName = info.tracks.items[flag].album.name;
								var imageAlbum = info.tracks.items[flag].album.images[0].url;
								this.songPreview = info.tracks.items[flag].preview_url;
								this.songID = info.tracks.items[flag].href;
								Player.musicPlayer(this.songPreview, this.songID);
								MusicRecommender.playList(this.songPreview);

								MusicRecommender.detail(songName, artistNom, albumName, imageAlbum);
							}
						});
			}
			
			
			if(document.getElementById("album").checked == true){
				divCancion.addEventListener('click', function(e){
							if(e.target && e.target.nodeName == "LI"){
								//limpiamos y etc etc
								document.getElementById('listaCanciones').removeChild(document.getElementById('lista'));
								var songName = e.target.textContent;
								
								MusicRecommender.search(albumn, 'track');
								var info = MusicRecommender.getInfo();

								
								// Recomended
								var artistID = info.tracks.items[0].artists[0].id;
								//console.log(info);
								MusicRecommender.listRecomend(artistID);

								for(var i=0; i < info.tracks.items.length ; i++){
									if(info.tracks.items[i].name == songName && info.tracks.items[i].album.name == albumn){
										if( flag == -1 ){
											flag = i;
										}
									}
									
								}
								
								var artistNom = info.tracks.items[flag].artists[0].name;
								var imageAlbum = info.tracks.items[flag].album.images[0].url;
								this.songPreview = info.tracks.items[flag].preview_url;
								this.songID = info.tracks.items[flag].href;
								Player.musicPlayer(this.songPreview, this.songID);
								MusicRecommender.playList(this.songPreview);
								
								MusicRecommender.detail(songName, artistNom, albumn, imageAlbum);
							}
						});
			}
		},

		setDetailsRecomend : function(artista, albumn){	
			var flag = -1;		
			var divCancion = document.getElementById('listaRe');
			if(document.getElementById("artista").checked == true){
				divCancion.addEventListener('click', function(e){
							if(e.target && e.target.nodeName == "LI"){
								//limpiamos y etc etc
								document.getElementById('listaRecomend').removeChild(document.getElementById('listaRe'));
								var songName = e.target.textContent;
								var artistNom = artista;

								MusicRecommender.search(artista, 'track');
								var info = MusicRecommender.getInfo();

								// Recomended
								var artistID = info.tracks.items[0].artists[0].id;
								//console.log(artistID);
								MusicRecommender.listRecomend(artistID);
								

								for(var i=0; i < info.tracks.items.length ; i++){
									if(info.tracks.items[i].name == songName){
										if( flag == -1 ){
											flag = i;
										}
									}
									
								}
								
								var albumName = info.tracks.items[flag].album.name;
								var imageAlbum = info.tracks.items[flag].album.images[0].url;
								this.songPreview = info.tracks.items[flag].preview_url;
								this.songID = info.tracks.items[flag].href;
								Player.musicPlayer(this.songPreview, this.songID);
								MusicRecommender.playList(this.songPreview);

								MusicRecommender.detail(songName, artistNom, albumName, imageAlbum);
							}
						});
			}
			
			
			if(document.getElementById("album").checked == true){
				divCancion.addEventListener('click', function(e){
							if(e.target && e.target.nodeName == "LI"){
								//limpiamos y etc etc
								document.getElementById('listaCanciones').removeChild(document.getElementById('lista'));
								var songName = e.target.textContent;
								
								MusicRecommender.search(albumn, 'track');
								var info = MusicRecommender.getInfo();

								
								// Recomended
								var artistID = info.tracks.items[0].artists[0].id;
								//console.log(info);
								MusicRecommender.listRecomend(artistID);

								for(var i=0; i < info.tracks.items.length ; i++){
									if(info.tracks.items[i].name == songName && info.tracks.items[i].album.name == albumn){
										if( flag == -1 ){
											flag = i;
										}
									}
									
								}
								
								var artistNom = info.tracks.items[flag].artists[0].name;
								var imageAlbum = info.tracks.items[flag].album.images[0].url;
								this.songPreview = info.tracks.items[flag].preview_url;
								this.songID = info.tracks.items[flag].href;
								Player.musicPlayer(this.songPreview, this.songID);
								MusicRecommender.playList(this.songPreview);
								
								MusicRecommender.detail(songName, artistNom, albumn, imageAlbum);
							}
						});
			}
		}

	}
	
	//localStorage.removeItem("playList");
	Listener.searchButtonListener();
	MusicRecommender.showPlayList();
}
document.addEventListener("DOMContentLoaded",musicSalle(),false);