$( document ).ready( function()
{
	var webgl_ok = false;
	try
	{
		//Init
		var renderer = new THREE.WebGLRenderer( { antialias: true } );
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera( 60, 1024 / 512, 1, 1000 );
		var container = $( "#webgl_banner" )[0];

		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( 1024, 512 );

		var box = new THREE.BoxGeometry( -1024, 1024, 1024 );

		var materials = [];
		for ( var i = 0 ; i < 6; i++ )
		{
			var img = new Image();
			img.src = "http://tf2classic.com/content/banners/ctf_2fort/" + i + ".png";
			var tex = new THREE.Texture( img );
			img.tex = tex;
			img.onload = function()
			{
				this.tex.needsUpdate = true;
				render();
			};
			var mat = new THREE.MeshBasicMaterial( { color: 0xffffff, map: tex } );
			materials.push( mat );
		}

		var world = new THREE.Mesh( box, new THREE.MeshFaceMaterial( materials ) );
		world.overdraw = true;
		scene.add( world );

		$( container ).html( renderer.domElement );

		webgl_ok = true;
	} catch ( err )
	{
		console.log( "Error loading three.js (webgl)" );
		webgl_ok = false;
	}

	var slider = $( "#webgl_slider" );
	var lastset = 180000;
	var paused = -9001;
	function render()
	{
		var ang = Number(slider.val());
		if ( lastset != ang )
		{
			paused = window.performance.now()/1000;
			lastset = ang;
		}else{
			if ( paused < ( window.performance.now()/1000 ) - 5 )
			{
				ang += 5;
				ang = ang % 360000;
				lastset = ang;
				slider.val( ang );
			}
		}
		camera.rotation.y = -(ang/1000) * ( Math.PI / 180 );
		renderer.render( scene, camera );
		window.requestAnimationFrame( render );
	}

	if ( webgl_ok )
	{
		console.log( "WebGL Ok!" );
		render();
	}else{
		console.log( "WebGL fail!" );
		$( "#webgl_slider" ).remove();
	}
} );
