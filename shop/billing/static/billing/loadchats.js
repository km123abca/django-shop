console.log("loadchats.js was invoked");

 let like_string=`<button class="fa fa-thumbs-up bbtn" onclick="updatelikes(this)" aria-hidden="true" href="https://facebook.com" type="button"></button>`;
 let dislike_string=`<button class="fa fa-thumbs-down bbtn"  onclick="updatedislikes(this)" bbtn" aria-hidden="true" type="button"></button>`;


let rlike_string=`<button class="fa fa-thumbs-up bbtn" onclick="updaterlikes(this)" aria-hidden="true" href="https://facebook.com" type="button"></button>`;
 let rdislike_string=`<button class="fa fa-thumbs-down bbtn" onclick="updaterdislikes(this)" bbtn" aria-hidden="true" type="button"></button>`;

//function to update likes
function updatelikes(elem)
	{
		let chatid=elem.parentElement.classList[elem.parentElement.classList.length-1];
		chatid=chatid.split('_')[1];
		// console.log(`chat number ${chatid} will be updated`);
		updateLikesServer(chatid,1,1);
		elem.blur();
	}
function updatedislikes(elem)
	{
		let chatid=elem.parentElement.classList[elem.parentElement.classList.length-1];
		chatid=chatid.split('_')[1];
		// console.log(`chat number ${chatid} will be updated`);
		updateLikesServer(chatid,1,0);
		elem.blur();
	}

function updaterlikes(elem)
	{
		let chatid=elem.parentElement.classList[elem.parentElement.classList.length-1];
		chatid=chatid.split('_')[1];
		// console.log(`reply number ${chatid} will be updated`);
		updateLikesServer(chatid,0,1);
	}
function updaterdislikes(elem)
	{
		let chatid=elem.parentElement.classList[elem.parentElement.classList.length-1];
		chatid=chatid.split('_')[1];
		// console.log(`reply number ${chatid} will be updated`);
		updateLikesServer(chatid,0,0);
	}

function showEdit(cnt)
	{
		let elem=document.querySelector('#editFormx'+cnt);
		if(elem.style.display=='block')
			elem.style.display='none';
		else
			elem.style.display='block';
	}

function deleteChat(chatid)
	{ 
		//todo write the delete chat script here
		if(!confirm("You sure you want to delete this message?"))
			return	false;
		fetch(`../deletechat/${chatid}/`)
		     .then(
		     		response=>response.json()
		     	  )
		     .then(
		     		response=>{
		     				    if(response.message=="error")
		     				    	showModal_k("Failed","Failed to delete the chat");
		     				  }
		     	  )
		     .catch(err=>
		     	         {
		     	         	console.log(err);
		     	         	showModal_k("error","error at front end");
		     	         }
		     	   );
		return true;
	}

function deleteReply(chatid)
	{ 
		//todo write the delete chat script here
		if(!confirm("You sure you want to delete this message?"))
			return	false;
		fetch(`../deletereply/${chatid}/`)
		     .then(
		     		response=>response.json()
		     	  )
		     .then(
		     		response=>{
		     				    if(response.message=="error")
		     				    	showModal_k("Failed","Failed to delete the reply");
		     				  }
		     	  )
		     .catch(err=>
		     	         {
		     	         	console.log(err);
		     	         	showModal_k("error","error at front end");
		     	         }
		     	   );
		return true;
	}
function updateLikesServer(msg_id,is_msg,is_like)
	{
		let msg={"msg_id":msg_id,"is_msg":is_msg,"is_like":is_like};
		fetch("../postlikes/",
							 {
    		               	method:"POST",
    		               	body:JSON.stringify(msg),
    		               	headers: {
    		               			 "content-type":"application/json",
    	                             "X-CSRFToken":getCookie('csrftoken'),
    		               			 },
		                     }
			 )
		     .then(
		     		response=>{
		     			       // console.log(response);
		     			       return response.json();
		     			      }
		     	  )
		     .then(
		     	    (response)=>
		     	                {
		     	                	if(response.message!="ok")
		     	                		showModal_k("error",response.details);
		     	                }
		     	  )
		     .catch(err=>
		     	         {
		     	         	console.log(err);
		     	         	showModal_k("error","error at front end");
		     	         }
		     	   );

	}

function removeOldChats(discardedMessages)
	{
		for(var discardedMsg of discardedMessages)
			discardedMsg.remove();
	}
function dynamicChat()
	{
		// console.log(hidden_replies);
		console.log("dynamic chat called");
		fetch("../chat_json/")
		     .then(response=>{
		     	             //console.log(response);
		     	             return response.json();
		     	             }
		     	  )
		     .then((resp)=>
		     	           {
		     	           // console.log(resp);
		     	           // loadChats(resp);
		     	           scanForChanges(resp);
		     	           loadEventListeners();
		     	          loadEventListeners_editforms(); 
		     	           }
		     	  )
		     .catch(err=>
		     	         {
		     	         	console.log(err);
		     	         }
		     	   );

	}
dynamicChat();
setInterval(dynamicChat, 1000);


let numMessages=0;
let chatStorage=[];
let cntr=0;
function scanForChanges(chats)
	{

        var chats=chats.chats;
		var chatbox_containers=document.getElementsByClassName("chatbox-container");
		//loop over each chatbox container		
		var oldChatsList=[];
		var discardedMessages=[];
		for(var i=0;i<chatbox_containers.length;i++)
		{
			var sender=chatbox_containers[i].querySelector("#fwhom").innerHTML;
			var sendDate=chatbox_containers[i].querySelector("#sdate").innerHTML;
			var msg_content=chatbox_containers[i].querySelector("#msgconx").innerHTML;
			var numlikes=chatbox_containers[i].querySelector("#nlikes").innerHTML;
			var numdislikes=chatbox_containers[i].querySelector("#ndislikes").innerHTML;

			var msg_id=chatbox_containers[i].querySelector("#msgid").innerHTML;

			try{
            var replyMasterContainer=chatbox_containers[i].getElementsByClassName("replyset")[0]
                                     .querySelector("#msgspot");
                }
            catch(err)
            	{
            		throw "oh oh";
            	}
            var reply_elems=chatbox_containers[i].getElementsByClassName("replybox-container");
            var found_flg=false
            for(var l in chats)
            {
            	chat=chats[l];
            	if(chat.id==msg_id)
            		{
            			// console.log(`${msg_content} is duplicate`);
            			if(chatbox_containers[i].querySelector("#nlikes").innerHTML!=like_string+' '+chat.likes)
            				chatbox_containers[i].querySelector("#nlikes").innerHTML=like_string+' '+chat.likes;
            			if(chatbox_containers[i].querySelector("#ndislikes").innerHTML!= dislike_string+' '+chat.dislikes)
            				chatbox_containers[i].querySelector("#ndislikes").innerHTML= dislike_string+' '+chat.dislikes;

            			if(chatbox_containers[i].querySelector('#msgconx').innerHTML!=chat.msg_content)
            				chatbox_containers[i].querySelector('#msgconx').innerHTML=chat.msg_content;

            			checkReplies(reply_elems,chat.replies,replyMasterContainer);
            			found_flg=true;
            			oldChatsList.push(l);
            			break;
            		}
            }
            if(!found_flg)
            	discardedMessages.push(chatbox_containers[i]);


		}
		removeOldChats(discardedMessages);
		for(var l in chats)
		{
			
			if(oldChatsList.indexOf(l)!=-1)
				continue;
			// console.log('loading new chat'); 

			chat=chats[l];
			console.log(`${chat.msg_content} is new`);
            cntr+=1;

            deleteString='<div class="mid-child font-weight-bold"> <a href="javascript:deleteChat('
                         +chat.id+
                         ')" id="del'+
                         chat.id+
                         '">Delete</a></div>';
            editString=`<div class="mid-child font-weight-bold">
            				<a href="javascript:showEdit(${cntr})">Edit</a>
                        </div>`;
			if(document.querySelector("#prezuser").value!=chat.from_whom)
				{
					deleteString="";
					editString="";
		        }

			chatString=`<div class="container border chatbox-container" id="cbcntr${cntr}">
			                <div class="senderbox" id="senderbox">
			                	<div class="left-child font-weight-bold" id="fwhom">${chat.from_whom}</div>
		   						<div class="font-weight-bold" id="sdate">${new Date(chat.sent_when).toLocaleDateString('en-GB')}</div>
		   					</div>
		   					<div id="msgid" style="display:none;">${chat.id}</div>
		   					<div id="msgconx">${chat.msg_content}</div>
					   	    <div class="senderbox">
					   			<div class="mid-child font-weight-bold chat_${chat.id}" id="nlikes">${like_string} ${chat.likes}</div>
					   			<div class="mid-child font-weight-bold chat_${chat.id}" id="ndislikes">${dislike_string} ${chat.dislikes}</div>
					   			<div class="mid-child font-weight-bold">
					   			    <a href="javascript:revealReplies(${cntr})" id="replylink${cntr}">view replies</a>
					   			</div>
					   			${deleteString}
					   			${editString}
						   	</div>

						   	<div class="container editFormx" id="editFormx${cntr}" style="display:none;">
							    <form action="" id="edit-form"  class="edit-win" method="post"> 
							        <input type="hidden" name="counterx" value="${cntr}" />  
	  								<input type="hidden" name="user" value="${userx}" />
	  								<input type="hidden" name="parentid" value="${chat.id}" />
	  						        <input type='text' class='editmsg' id='editmsg' name='editmsg' value='${chat.msg_content}' />
	  								<button type='submit' class='btn btn-primary'>Edit</button>
    							</form>     
	    					</div>
		   							
		   					<div id="reply${cntr}" class="replyset" >	
		   					    <div id="msgspot">

		   					    </div>				
			   					<div class="container">
	    							    <form action="" id="rly-form"  class="rly-win" method="post"> 
	    							           	  
	    	  								<input type="hidden" name="user" value="${userx}" />
	    	  								<input type="hidden" name="parentid" value="${chat.id}" />
	    	  						        <input type='text' class='rlyToSend' id='rlyToSend' name='rlyToSend' />
	    	  								<button type='submit' class='btn btn-primary'>Send</button>
	        							</form>     
	    						</div>
    						</div>
    					</div>`;

    		document.querySelector("#chatContainer").innerHTML+=chatString;
    		// if(document.querySelector("#prezuser").value!=chat.from_whom)
    		// 	document.querySelector(`#del${chat.id}`).style.display='none';
    		
    		// var elemxx=document.getElementsByClassName("chatbox-container");
    		// var elemxx=document.getElementById("cbcntr"+cntr);
    		// elemxx=elemxx[elemxx.length-1];
    		// console.log(elemxx.innerHTML);
    		// var rmc=elemxx.getElementsByClassName("replyset")[0].querySelector("#msgspot");
    		var rmc=document.getElementById("reply"+cntr).querySelector("#msgspot");
    		checkReplies("none",chat.replies,rmc,true);

		}

		
	}

function checkReplies(replyClass,replies,replyMasterContainer,newReplyset=false)
	{
		var oldChatsList=[];
        
		if(!newReplyset)
		{
			var discardedMessages=[];
			for(var i=0;i<replyClass.length;i++)
			{
				var sender=replyClass[i].querySelector("#fwhom").innerHTML;			
				var datex=replyClass[i].querySelector("#fdate").innerHTML;
				var repcontent=replyClass[i].querySelector("#repcontent").innerHTML;
				var rlikes=replyClass[i].querySelector("#rlikes").innerHTML;
				var rdislikes=replyClass[i].querySelector("#rdislikes").innerHTML;

				var rep_id=replyClass[i].querySelector("#rlyid").innerHTML;


	            var found_flg=false;
	            
				for(var k in replies)
				{
					reply=replies[k];
					if( reply.id==rep_id)
					{
                        // console.log(`${repcontent} is duplicate`);
                       
						if(replyClass[i].querySelector("#rlikes").innerHTML!=rlike_string+' '+reply.likes)
							replyClass[i].querySelector("#rlikes").innerHTML=rlike_string+' '+reply.likes;
						if(replyClass[i].querySelector("#rdislikes").innerHTML!=rdislike_string+' '+reply.dislikes)
							replyClass[i].querySelector("#rdislikes").innerHTML=rdislike_string+' '+reply.dislikes;
						found_flg=true;
						oldChatsList.push(k);
						// break;
					}
				}
				if(!found_flg)
				{
					//delete those chats that were not found in the response
					discardedMessages.push(replyClass[i]);
				}
			}
			removeOldChats(discardedMessages);

		}
         
		//set up new chats that are absent in oldChatsList
		for(var k in replies)
		{
			reply=replies[k];
			
			if(oldChatsList.indexOf(k)!=-1)
				continue;
		console.log(`loading new reply,${reply.rly_content}`);

		let deleteString=`<div class="mid-child font-weight-bold">
					   			<a href="javascript:deleteReply(${reply.id})" id="del${reply.id}">Delete</a>
					   		</div>`;
		if(document.querySelector("#prezuser").value!=reply.from_whom)
				deleteString="";

		let chatString=`<div class="replybox-container" >
			               <div class="senderbox" id="senderbox">
			   			    <span class="left-child font-weight-bold" id="fwhom">${reply.from_whom}</span>
	              		    <span class="font-weight-bold" id="fdate">${new Date(reply.sent_when).toLocaleDateString('en-GB')}</span>
			   		       </div>
			   		       <div id="rlyid" style="display:none;">${reply.id}</div>
				   		   <div class="msgcontent" id="repcontent">${reply.rly_content}</div>
				   		   <div class="senderbox">
				   			<span class="mid-child font-weight-bold chat_${reply.id}" id="rlikes">${rlike_string} ${reply.likes}</span>
		              		<span class="mid-child font-weight-bold chat_${reply.id}" id="rdislikes">${rdislike_string} ${reply.dislikes}</span>
		              				              		
		              		${deleteString}
				   		   </div>
			             </div>`;
			             
	    replyMasterContainer.innerHTML+=chatString;
	    // replyMasterContainer.innerHTML=chatString;
		}
	}


function loadChats(chats)
	{
		//get chats and display to screen
		chats=chats.chats;
		
		// console.log(chats);
		chatString="";
		var msgcount=-1;
		numMessages=chats.length;
		
		for (var chat of chats)
		{
			
			msgcount+=1;
			var dispStyle="none";
			var dispMsg="view replies";
			if(hidden_replies[msgcount])
			{
				dispStyle=hidden_replies[msgcount];
				dispMsg=(dispStyle=="block")?"view replies":"hide replies";
			}
			chatString+=`<div class="container border chatbox-container">
			                <div class="senderbox" id="senderbox">
			                	<div class="left-child font-weight-bold" id="fwhom">${chat.from_whom}</div>
		   						<div class="font-weight-bold" id="sdate">${new Date(chat.sent_when).toLocaleDateString('en-GB')}</div>
		   					</div>
		   					<div id="msgconx">${chat.msg_content}</div>
						   	    <div class="senderbox">
						   			<div class="mid-child font-weight-bold" id="nlikes">likes${chat.likes}</div>
						   			<div class="mid-child font-weight-bold" id="ndislikes">dislikes${chat.dislikes}</div>
						   			<div class="mid-child font-weight-bold">
						   			    <a href="javascript:revealReplies(${msgcount})" id="replylink${msgcount}">${dispMsg}</a>
						   			</div>
						   		</div>
		   					</div>		
		   					<div id="reply${msgcount}" class="replyset" style="display:${dispStyle};">					
		   					`;
		   	var rlycount=-1;
		   	for(var reply of chat.replies)
		   			{
		   				rlycount+=1;
		   				chatString+=`<div class="replybox-container" id="mess${msgcount}reply${rlycount}">`;
		   				chatString+=`<div class="senderbox" id="senderbox">
							   			<span class="left-child font-weight-bold" id="fwhom">${reply.from_whom}</span>
					              		<span class="font-weight-bold" id="fdate">${new Date(reply.sent_when).toLocaleDateString('en-GB')}</span>
							   		  </div>
								   		<div class="msgcontent" id="repcontent">${reply.rly_content}</div>
								   		<div class="senderbox">
								   			<span class="mid-child font-weight-bold" id="rlikes">${like_string} ${reply.likes}</span>
						              		<span class="mid-child font-weight-bold" id="rdislikes">${dislike_string} ${reply.dislikes}</span>
								   		</div>`;
						chatString+='</div>';
		   				
		   			}
		   			
		   			chatString+=`<div class="container">
    							    <form action="" id="rly-form${msgcount}" name="rly-form${msgcount}" class="rly-win" method="post"> 
    							           	  
    	  								<input type="hidden" name="user" value="${userx}" />
    	  								<input type="hidden" name="parentid" value="${chat.id}" />
    	  						        <input type='text' class='rlyToSend' id='rlyToSend${msgcount}' name='rlyToSend' />
    	  								<button type='submit' class='btn btn-primary'>Send</button>
        							</form>     
    						     </div>`;
		   			
		   			chatString+=`</div></div>`;
		}
		document.querySelector("#chatContainer").innerHTML=chatString;
	}









// function revealReplies(x)
// {
// 	alert(`reply num:${x} will be revealed`);
// }
// console.log("im loaded");
const form=document.getElementById("msg-form");
form.addEventListener("submit", 
		                      (event) => 
		                        {
		                        	// alert("hey");
		                        	event.preventDefault();
		                        	const formData = new FormData(form);
		                        	const msgToSend=formData.get("msgToSend");
		                        	const user=formData.get("user");		                        	
		                        	const msg={"msg":msgToSend,"user":user};
		                        	console.log(msgToSend);
		                        	
		                        	fetch("../postchat/",
		                        		               {
		                        		               	method:"POST",
		                        		               	body:JSON.stringify(msg),
		                        		               	headers: {
		                        		               			 "content-type":"application/json",
		                        	                             "X-CSRFToken":getCookie('csrftoken'),
		                        		               			 },
		                        		               }	                        		               
		                        		 )
		                        	.then(response=>response.json())
		                        	.then( (resp)=>
		                        		           {
		                        			       // document.querySelector('#warn-i').innerHTML=resp.message;
		                        			       // showModal_k("Done",resp.message);
		                        			       form.reset();
		                        			       }
		                        		 )
		                        	.catch(err=>
		                        		        {
		                        		        	showModal_k("Error",err);
		                        		        }
		                        		  );
									
		                        }
			             );



function loadEventListeners()
	{   
		var replyForms=document.getElementsByClassName('rly-win');

        // var replyForms=[];
        
        // for(var i=0;i<numMessages;i++)
        // {
        // 	replyForms.push(document.querySelector("#rly-form"+i));
        // }
		
		for(var i=0;i<replyForms.length;i++)
		{
		const form=replyForms[i];
		if(form.getAttribute('listenerLoadedHere'))
			continue;
		form.setAttribute('listenerLoadedHere',true);
		form.addEventListener("submit", 
				                      (event) => 
				                        {
				                        	// alert("hey");
				                        	event.preventDefault();
				                        	const formData = new FormData(form);
				                        	const msgToSend=formData.get("rlyToSend");
				                        	const user=formData.get("user");
				                        	const parentid=formData.get("parentid");
				                        	const msg={"msg":msgToSend,"user":user,"chatid":parentid};
				                        	// const csrft=formData.get("csrfmiddlewaretoken");
		                        	        //console.log(csrft);
				                        	// console.log(msgToSend);
				                        	
				                        	fetch("../postchat_reply/",
				                        		               {
				                        		               	method:"POST",
				                        		               	body:JSON.stringify(msg),
				                        		               	headers: {
				                        		               			 "content-type":"application/json",
				                        	                             "X-CSRFToken":getCookie('csrftoken'),
				                        		               			 },
				                        		               }	                        		               
				                        		 )
				                        	.then(response=>response.json())
				                        	.then( (resp)=>
				                        		           {
				                        			       // document.querySelector('#warn-i').innerHTML=resp.message;
				                        			       // showModal_k("Done",resp.message);
				                        			       form.reset();
				                        			       }
				                        		 )
				                        	.catch(err=>
				                        		        {
				                        		        	showModal_k("Error",err);
				                        		        }
				                        		  );
				                        	
				                        }
					             );
		}
		// console.log("All Listeners loaded");
	}
//<input type="hidden" name="csrfmiddlewaretoken" value="getCookie('csrftoken')">


function loadEventListeners_editforms()
	{   
		var editForms=document.getElementsByClassName('edit-win');

        // var replyForms=[];
        
        // for(var i=0;i<numMessages;i++)
        // {
        // 	replyForms.push(document.querySelector("#rly-form"+i));
        // }
		
		for(var i=0;i<editForms.length;i++)
		{
		const form=editForms[i];
		if(form.getAttribute('listenerLoadedHere'))
			continue;
		form.setAttribute('listenerLoadedHere',true);
		form.addEventListener("submit", 
				                      (event) => 
				                        {
				                        	// alert("hey");
				                        	event.preventDefault();
				                        	const formData = new FormData(form);
				                        	const msgToSend=formData.get("editmsg");
				                        	const user=formData.get("user");
				                        	const parentid=formData.get("parentid");
				                        	const counterx=formData.get("counterx");
				                        	const msg={"msg":msgToSend,"user":user,"chatid":parentid};
				                        	// const csrft=formData.get("csrfmiddlewaretoken");
		                        	        //console.log(csrft);
				                        	// console.log(msgToSend);
				                        	
				                        	fetch("../edit_chat/",
				                        		               {
				                        		               	method:"POST",
				                        		               	body:JSON.stringify(msg),
				                        		               	headers: {
				                        		               			 "content-type":"application/json",
				                        	                             "X-CSRFToken":getCookie('csrftoken'),
				                        		               			 },
				                        		               }	                        		               
				                        		 )
				                        	.then(response=>response.json())
				                        	.then( (resp)=>
				                        		           {

				                        			       // document.querySelector('#warn-i').innerHTML=resp.message;
				                        			       // showModal_k("Done",resp.message);
				                        			       // form.reset();
				                        			       if(resp.message=="noauth")
				                        			       	showModal_k("Unauthorized","you cant edit something that you havent posted");
				                        			       else
				                        			       	document.querySelector('#editFormx'+counterx).style.display="none";
				                        			       }
				                        		 )
				                        	.catch(err=>
				                        		        {
				                        		        	showModal_k("Error",err);
				                        		        }
				                        		  );
				                        	
				                        }
					             );
		}
		// console.log("All Listeners loaded");
	}

