console.log("loadchats.js was invoked");


function dynamicChat()
	{
		// console.log(hidden_replies);
		fetch("../chat_json/")
		     .then(response=>{
		     	             //console.log(response);
		     	             return response.json()
		     	             }
		     	  )
		     .then((resp)=>
		     	           {
		     	           // console.log(resp);
		     	           loadChats(resp);
		     	           loadEventListeners();
		     	           }
		     	  )
		     .catch(err=>
		     	         {
		     	         	console.log(err);
		     	         }
		     	   );

	}
dynamicChat();
// setInterval(dynamicChat, 1000);


let numMessages=0;
let chatStorage;
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
			                <div class="senderbox">
			                	<div class="left-child font-weight-bold">${chat.from_whom}</div>
		   						<div class="font-weight-bold">${new Date(chat.sent_when).toLocaleDateString('en-GB')}</div>
		   					</div>
		   					<div>${chat.msg_content}</div>
						   	    <div class="senderbox">
						   			<div class="mid-child font-weight-bold">likes${chat.likes}</div>
						   			<div class="mid-child font-weight-bold">dislikes${chat.dislikes}</div>
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
		   				chatString+=`<div class="senderbox">
							   			<span class="left-child font-weight-bold">${reply.from_whom}</span>
					              		<span class="font-weight-bold">${new Date(reply.sent_when).toLocaleDateString('en-GB')}</span>
							   		  </div>
								   		<div class="msgcontent">${reply.rly_content}</div>
								   		<div class="senderbox">
								   			<span class="mid-child font-weight-bold">likes ${reply.likes}</span>
						              		<span class="mid-child font-weight-bold">dislikes ${reply.dislikes}</span>
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
		                        			       showModal_k("Done",resp.message);
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
				                        			       showModal_k("Done",resp.message);
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
		console.log("All Listeners loaded");
	}
//<input type="hidden" name="csrfmiddlewaretoken" value="getCookie('csrftoken')">

