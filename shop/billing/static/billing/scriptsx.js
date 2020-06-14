function showModal_k(titleMessage="Done",bodyMessage="Dang it Kitchu, get real for once")
	{ 
		console.log('show modal worked');
		document.querySelector('#mheader').innerHTML=titleMessage;
        document.querySelector('#mmessage').innerHTML=bodyMessage;
        document.querySelector('#mm').modal();
	}
	/*
{% if err %}
	<script> showModal_k("unauthorized","You have to login first to access that page")
    </script>
{% endif %}
*/